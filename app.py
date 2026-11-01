"""
Campus Placement & Internship Management Portal
Backend API Server built with Flask and SQLite3.
Provides RESTful APIs for students, drives, applications, analytics, and reports.
"""

import os
import sqlite3
import csv
import io
from flask import Flask, request, jsonify, send_from_directory, Response
from database import init_db, get_db_connection, DB_PATH

app = Flask(__name__, static_folder="static", static_url_path="")

# Ensure database is initialized
if not os.path.exists(DB_PATH):
    init_db()

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# ----------------- Static Frontend Routes -----------------

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

# ----------------- Health & Analytics API -----------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "Campus Placement Portal API", "version": "1.0.0"})

@app.route("/api/stats", methods=["GET"])
def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Total drives
    cursor.execute("SELECT COUNT(*) FROM drives")
    total_drives = cursor.fetchone()[0]

    # Active drives
    cursor.execute("SELECT COUNT(*) FROM drives WHERE status = 'Active'")
    active_drives = cursor.fetchone()[0]

    # Total students
    cursor.execute("SELECT COUNT(*) FROM students")
    total_students = cursor.fetchone()[0]

    # Total applications
    cursor.execute("SELECT COUNT(*) FROM applications")
    total_applications = cursor.fetchone()[0]

    # Total offers extended
    cursor.execute("SELECT COUNT(DISTINCT student_id) FROM applications WHERE status = 'Offer Extended'")
    placed_students = cursor.fetchone()[0]

    # Placement percentage
    placement_rate = round((placed_students / total_students * 100), 1) if total_students > 0 else 0.0

    # Highest and Average Package
    cursor.execute("SELECT MAX(package_lpa), AVG(package_lpa) FROM drives")
    pkg_row = cursor.fetchone()
    highest_package = pkg_row[0] or 0.0
    avg_package = round(pkg_row[1] or 0.0, 2)

    # Department-wise placement stats
    cursor.execute("""
    SELECT 
        s.department,
        COUNT(DISTINCT s.id) AS total_candidates,
        COUNT(DISTINCT CASE WHEN a.status = 'Offer Extended' THEN s.id END) AS placed_count
    FROM students s
    LEFT JOIN applications a ON s.id = a.student_id
    GROUP BY s.department
    ORDER BY total_candidates DESC
    """)
    dept_rows = cursor.fetchall()
    department_stats = [
        {
            "department": row["department"],
            "total": row["total_candidates"],
            "placed": row["placed_count"],
            "placement_rate": round((row["placed_count"] / row["total_candidates"] * 100), 1) if row["total_candidates"] > 0 else 0.0
        }
        for row in dept_rows
    ]

    # Application status distribution
    cursor.execute("""
    SELECT status, COUNT(*) AS count
    FROM applications
    GROUP BY status
    """)
    status_rows = cursor.fetchall()
    status_breakdown = {row["status"]: row["count"] for row in status_rows}

    conn.close()

    return jsonify({
        "total_drives": total_drives,
        "active_drives": active_drives,
        "total_students": total_students,
        "total_applications": total_applications,
        "placed_students": placed_students,
        "placement_rate": placement_rate,
        "highest_package": highest_package,
        "avg_package": avg_package,
        "department_stats": department_stats,
        "status_breakdown": status_breakdown
    })

# ----------------- Students API -----------------

@app.route("/api/students", methods=["GET", "POST"])
def manage_students():
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute("SELECT * FROM students ORDER BY roll_no ASC")
        students = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(students)

    elif request.method == "POST":
        data = request.json or {}
        required = ["roll_no", "name", "email", "department", "cgpa"]
        for field in required:
            if field not in data:
                conn.close()
                return jsonify({"error": f"Missing required field: {field}"}), 400

        try:
            cursor.execute("""
            INSERT INTO students (roll_no, name, email, phone, department, cgpa, active_backlogs, skills, resume_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data["roll_no"].strip(),
                data["name"].strip(),
                data["email"].strip().lower(),
                data.get("phone", "").strip(),
                data["department"].strip(),
                float(data["cgpa"]),
                int(data.get("active_backlogs", 0)),
                data.get("skills", "").strip(),
                data.get("resume_url", "").strip()
            ))
            conn.commit()
            new_id = cursor.lastrowid
            cursor.execute("SELECT * FROM students WHERE id = ?", (new_id,))
            new_student = dict(cursor.fetchone())
            conn.close()
            return jsonify(new_student), 201
        except sqlite3.IntegrityError as e:
            conn.close()
            return jsonify({"error": "A student with this Roll No or Email already exists."}), 409

@app.route("/api/students/<int:student_id>", methods=["GET", "PUT"])
def single_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return jsonify({"error": "Student not found"}), 404
        
        student = dict(row)
        # Fetch their applications
        cursor.execute("""
        SELECT a.id as application_id, a.applied_at, a.status, a.feedback,
               d.id as drive_id, d.company_name, d.role, d.package_lpa, d.job_type, d.location
        FROM applications a
        JOIN drives d ON a.drive_id = d.id
        WHERE a.student_id = ?
        ORDER BY a.applied_at DESC
        """, (student_id,))
        student["applications"] = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return jsonify(student)

    elif request.method == "PUT":
        data = request.json or {}
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        existing = cursor.fetchone()
        if not existing:
            conn.close()
            return jsonify({"error": "Student not found"}), 404

        cursor.execute("""
        UPDATE students
        SET name = ?, email = ?, phone = ?, department = ?, cgpa = ?, active_backlogs = ?, skills = ?, resume_url = ?
        WHERE id = ?
        """, (
            data.get("name", existing["name"]),
            data.get("email", existing["email"]),
            data.get("phone", existing["phone"]),
            data.get("department", existing["department"]),
            float(data.get("cgpa", existing["cgpa"])),
            int(data.get("active_backlogs", existing["active_backlogs"])),
            data.get("skills", existing["skills"]),
            data.get("resume_url", existing["resume_url"]),
            student_id
        ))
        conn.commit()
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        updated = dict(cursor.fetchone())
        conn.close()
        return jsonify(updated)

# ----------------- Drives API -----------------

@app.route("/api/drives", methods=["GET", "POST"])
def manage_drives():
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == "GET":
        # Supports query param: ?status=Active
        status_filter = request.args.get("status")
        query = """
        SELECT d.*, COUNT(a.id) AS total_applicants
        FROM drives d
        LEFT JOIN applications a ON d.id = a.drive_id
        """
        params = []
        if status_filter:
            query += " WHERE d.status = ?"
            params.append(status_filter)
        query += " GROUP BY d.id ORDER BY d.id DESC"

        cursor.execute(query, params)
        drives = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(drives)

    elif request.method == "POST":
        data = request.json or {}
        required = ["company_name", "role", "package_lpa", "eligible_branches", "deadline"]
        for field in required:
            if field not in data:
                conn.close()
                return jsonify({"error": f"Missing required field: {field}"}), 400

        cursor.execute("""
        INSERT INTO drives (company_name, role, job_type, package_lpa, location, description, min_cgpa, max_backlogs, eligible_branches, deadline, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["company_name"].strip(),
            data["role"].strip(),
            data.get("job_type", "Full-Time").strip(),
            float(data["package_lpa"]),
            data.get("location", "On-Campus / Hybrid").strip(),
            data.get("description", "").strip(),
            float(data.get("min_cgpa", 6.0)),
            int(data.get("max_backlogs", 0)),
            data["eligible_branches"].strip(),
            data["deadline"].strip(),
            data.get("status", "Active").strip()
        ))
        conn.commit()
        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM drives WHERE id = ?", (new_id,))
        drive = dict(cursor.fetchone())
        conn.close()
        return jsonify(drive), 201

@app.route("/api/drives/<int:drive_id>", methods=["GET", "PUT", "DELETE"])
def single_drive(drive_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute("SELECT * FROM drives WHERE id = ?", (drive_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return jsonify({"error": "Drive not found"}), 404
        
        drive = dict(row)
        # Fetch applicants list
        cursor.execute("""
        SELECT a.id as application_id, a.applied_at, a.status, a.feedback,
               s.id as student_id, s.roll_no, s.name, s.email, s.department, s.cgpa, s.active_backlogs, s.skills, s.resume_url
        FROM applications a
        JOIN students s ON a.student_id = s.id
        WHERE a.drive_id = ?
        ORDER BY s.cgpa DESC
        """, (drive_id,))
        drive["applicants"] = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return jsonify(drive)

    elif request.method == "PUT":
        data = request.json or {}
        cursor.execute("SELECT * FROM drives WHERE id = ?", (drive_id,))
        existing = cursor.fetchone()
        if not existing:
            conn.close()
            return jsonify({"error": "Drive not found"}), 404

        cursor.execute("""
        UPDATE drives
        SET company_name = ?, role = ?, job_type = ?, package_lpa = ?, location = ?, description = ?,
            min_cgpa = ?, max_backlogs = ?, eligible_branches = ?, deadline = ?, status = ?
        WHERE id = ?
        """, (
            data.get("company_name", existing["company_name"]),
            data.get("role", existing["role"]),
            data.get("job_type", existing["job_type"]),
            float(data.get("package_lpa", existing["package_lpa"])),
            data.get("location", existing["location"]),
            data.get("description", existing["description"]),
            float(data.get("min_cgpa", existing["min_cgpa"])),
            int(data.get("max_backlogs", existing["max_backlogs"])),
            data.get("eligible_branches", existing["eligible_branches"]),
            data.get("deadline", existing["deadline"]),
            data.get("status", existing["status"]),
            drive_id
        ))
        conn.commit()
        cursor.execute("SELECT * FROM drives WHERE id = ?", (drive_id,))
        updated = dict(cursor.fetchone())
        conn.close()
        return jsonify(updated)

    elif request.method == "DELETE":
        cursor.execute("DELETE FROM drives WHERE id = ?", (drive_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": f"Drive {drive_id} deleted successfully"})

# ----------------- Applications API & Eligibility Engine -----------------

@app.route("/api/applications", methods=["GET", "POST"])
def manage_applications():
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == "GET":
        student_id = request.args.get("student_id")
        drive_id = request.args.get("drive_id")

        query = """
        SELECT a.id, a.applied_at, a.status, a.feedback,
               s.id as student_id, s.roll_no, s.name as student_name, s.department, s.cgpa, s.active_backlogs, s.email, s.skills, s.resume_url,
               d.id as drive_id, d.company_name, d.role, d.package_lpa, d.job_type, d.location
        FROM applications a
        JOIN students s ON a.student_id = s.id
        JOIN drives d ON a.drive_id = d.id
        """
        params = []
        conditions = []
        if student_id:
            conditions.append("a.student_id = ?")
            params.append(student_id)
        if drive_id:
            conditions.append("a.drive_id = ?")
            params.append(drive_id)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY a.applied_at DESC"
        cursor.execute(query, params)
        applications = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(applications)

    elif request.method == "POST":
        data = request.json or {}
        student_id = data.get("student_id")
        drive_id = data.get("drive_id")

        if not student_id or not drive_id:
            conn.close()
            return jsonify({"error": "student_id and drive_id are required"}), 400

        # Fetch student and drive to evaluate eligibility criteria
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        student = cursor.fetchone()
        if not student:
            conn.close()
            return jsonify({"error": "Student not found"}), 404

        cursor.execute("SELECT * FROM drives WHERE id = ?", (drive_id,))
        drive = cursor.fetchone()
        if not drive:
            conn.close()
            return jsonify({"error": "Drive not found"}), 404

        # 1. Check if drive is active
        if drive["status"] != "Active":
            conn.close()
            return jsonify({"error": "This hiring drive is closed for new applications."}), 400

        # 2. Check CGPA eligibility
        if float(student["cgpa"]) < float(drive["min_cgpa"]):
            conn.close()
            return jsonify({
                "error": f"Ineligible: Minimum CGPA required is {drive['min_cgpa']}, your CGPA is {student['cgpa']}."
            }), 400

        # 3. Check Backlogs eligibility
        if int(student["active_backlogs"]) > int(drive["max_backlogs"]):
            conn.close()
            return jsonify({
                "error": f"Ineligible: Maximum active backlogs allowed is {drive['max_backlogs']}, you have {student['active_backlogs']} active backlogs."
            }), 400

        # 4. Check Branch eligibility
        eligible_branches = [b.strip().lower() for b in drive["eligible_branches"].split(",")]
        student_dept = student["department"].strip().lower()
        # Allow if "all branches" or matches any substring
        matches_branch = any(dept in student_dept or student_dept in dept for dept in eligible_branches) or "all" in drive["eligible_branches"].lower()
        if not matches_branch:
            conn.close()
            return jsonify({
                "error": f"Ineligible: Your branch ({student['department']}) is not among the eligible branches ({drive['eligible_branches']})."
            }), 400

        # 5. Check duplicate application
        cursor.execute("SELECT id FROM applications WHERE drive_id = ? AND student_id = ?", (drive_id, student_id))
        existing_app = cursor.fetchone()
        if existing_app:
            conn.close()
            return jsonify({"error": "You have already applied for this company drive."}), 409

        # Submit application
        cursor.execute("""
        INSERT INTO applications (drive_id, student_id, status, feedback)
        VALUES (?, ?, 'Applied', 'Application received by T&P cell')
        """, (drive_id, student_id))
        conn.commit()
        app_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Successfully applied for {drive['company_name']} - {drive['role']}!",
            "application_id": app_id
        }), 201

@app.route("/api/applications/<int:app_id>/status", methods=["PUT"])
def update_application_status(app_id):
    """Placement Officer can update status to: Applied, Under Review, Shortlisted, Interview Scheduled, Offer Extended, Rejected"""
    data = request.json or {}
    new_status = data.get("status")
    feedback = data.get("feedback", "")

    valid_statuses = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Offer Extended", "Rejected"]
    if new_status not in valid_statuses:
        return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM applications WHERE id = ?", (app_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({"error": "Application not found"}), 404

    cursor.execute("""
    UPDATE applications
    SET status = ?, feedback = ?
    WHERE id = ?
    """, (new_status, feedback, app_id))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": f"Application status updated to '{new_status}'"})

# ----------------- Announcements API -----------------

@app.route("/api/announcements", methods=["GET", "POST"])
def manage_announcements():
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute("SELECT * FROM announcements ORDER BY id DESC")
        items = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return jsonify(items)

    elif request.method == "POST":
        data = request.json or {}
        if not data.get("title") or not data.get("content"):
            conn.close()
            return jsonify({"error": "Title and content are required"}), 400

        cursor.execute("""
        INSERT INTO announcements (title, content, priority, date_posted)
        VALUES (?, ?, ?, date('now'))
        """, (data["title"].strip(), data["content"].strip(), data.get("priority", "Normal")))
        conn.commit()
        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM announcements WHERE id = ?", (new_id,))
        item = dict(cursor.fetchone())
        conn.close()
        return jsonify(item), 201

# ----------------- CSV Report Export (NAAC / NBA Format) -----------------

@app.route("/api/export/csv", methods=["GET"])
def export_placements_csv():
    """Generates real-time downloadable CSV report of all placement records."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        s.roll_no AS "Roll No",
        s.name AS "Student Name",
        s.department AS "Department",
        s.cgpa AS "CGPA",
        d.company_name AS "Company",
        d.role AS "Job Role",
        d.package_lpa AS "Package (LPA)",
        a.status AS "Application Status",
        a.applied_at AS "Applied Date",
        a.feedback AS "Officer Remarks"
    FROM applications a
    JOIN students s ON a.student_id = s.id
    JOIN drives d ON a.drive_id = d.id
    ORDER BY s.department, s.roll_no
    """)
    rows = cursor.fetchall()
    conn.close()

    output = io.StringIO()
    if rows:
        headers = [col[0] for col in cursor.description]
        writer = csv.writer(output)
        writer.writerow(headers)
        for row in rows:
            writer.writerow([row[col] for col in headers])
    else:
        output.write("No placement records found.")

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=Campus_Placement_Report.csv"}
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("=" * 60)
    print(" [*] Campus Placement & Internship Management Portal")
    print(f" Local Server running at: http://127.0.0.1:{port}")
    print(f" Network Access at:       http://0.0.0.0:{port}")
    print(f" API Health Check at:     http://127.0.0.1:{port}/api/health")
    print("=" * 60)
    app.run(host="0.0.0.0", port=port, debug=True)
