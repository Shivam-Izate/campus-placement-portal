"""
Campus Placement & Internship Management Portal
Database module using SQLite3 (standard Python library).
Handles schema creation, connections, and initial realistic seed data.
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "placement.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(force_reseed=False):
    """Creates tables and populates sample data if database is new or force_reseed=True."""
    db_exists = os.path.exists(DB_PATH)
    if force_reseed and db_exists:
        try:
            os.remove(DB_PATH)
            db_exists = False
        except Exception as e:
            print(f"Warning: could not remove DB for reseed: {e}")

    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Students table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_no TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        department TEXT NOT NULL,
        cgpa REAL NOT NULL,
        active_backlogs INTEGER NOT NULL DEFAULT 0,
        skills TEXT,
        resume_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Placement Drives table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS drives (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT NOT NULL,
        role TEXT NOT NULL,
        job_type TEXT NOT NULL DEFAULT 'Full-Time',
        package_lpa REAL NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        min_cgpa REAL NOT NULL DEFAULT 6.0,
        max_backlogs INTEGER NOT NULL DEFAULT 0,
        eligible_branches TEXT NOT NULL,
        deadline TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Applications table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        drive_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'Applied',
        feedback TEXT,
        FOREIGN KEY (drive_id) REFERENCES drives (id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
        UNIQUE (drive_id, student_id)
    )
    """)

    # 4. Announcements table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'Normal',
        date_posted TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    # Check if seed data exists
    cursor.execute("SELECT COUNT(*) FROM students")
    student_count = cursor.fetchone()[0]

    if student_count == 0:
        seed_data(conn)

    conn.close()

def seed_data(conn):
    """Seed sample students, drives, applications, and announcements."""
    cursor = conn.cursor()

    # Seed Students
    students = [
        ("21CS001", "Aarav Sharma", "aarav.sharma@college.edu", "+91 98765 43210", "Computer Science", 8.85, 0, "Python, React, FastApi, SQL, Git", "https://github.com/aarav-sharma"),
        ("21CS042", "Ananya Deshmukh", "ananya.d@college.edu", "+91 98765 43211", "Computer Science", 9.40, 0, "C++, Java, Distributed Systems, Docker", "https://github.com/ananya-deshmukh"),
        ("21IT015", "Rohan Verma", "rohan.verma@college.edu", "+91 98765 43212", "Information Tech", 7.80, 0, "JavaScript, Node.js, MongoDB, AWS", "https://github.com/rohan-v"),
        ("21EC028", "Sneha Iyer", "sneha.iyer@college.edu", "+91 98765 43213", "Electronics & Comm", 8.20, 0, "Embedded C, IoT, Verilog, Python", "https://github.com/sneha-iyer"),
        ("21ME009", "Vikram Rathore", "vikram.r@college.edu", "+91 98765 43214", "Mechanical Eng", 7.20, 1, "AutoCAD, SolidWorks, MATLAB, Python", "https://github.com/vikram-rathore"),
        ("21AI033", "Pooja Nair", "pooja.nair@college.edu", "+91 98765 43215", "AI & Data Science", 8.60, 0, "PyTorch, Scikit-Learn, Pandas, NLP, React", "https://github.com/pooja-nair")
    ]
    cursor.executemany("""
    INSERT INTO students (roll_no, name, email, phone, department, cgpa, active_backlogs, skills, resume_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, students)

    # Seed Drives
    drives = [
        (
            "Google Cloud",
            "Associate Cloud Solutions Engineer",
            "Full-Time",
            24.0,
            "Bengaluru / Hyderabad",
            "Work with Google Cloud customers on enterprise architecture, automation scripts, and cloud migration solutions. Excellent problem solving and networking fundamentals required.",
            8.0,
            0,
            "Computer Science, Information Tech, AI & Data Science",
            "2026-11-20",
            "Active"
        ),
        (
            "Microsoft",
            "Software Development Intern (SDE)",
            "Internship",
            18.5,
            "Hyderabad / Remote",
            "6-month pre-placement internship opportunity. Candidates will contribute to Azure cloud services or Teams collaboration tools with senior engineering mentors.",
            8.2,
            0,
            "Computer Science, Information Tech, Electronics & Comm, AI & Data Science",
            "2026-11-15",
            "Active"
        ),
        (
            "Deloitte USI",
            "Analyst - Technology Consulting",
            "Full-Time",
            9.2,
            "Bengaluru / Gurugram",
            "Technical consulting, data analytics, enterprise ERP implementation and system integration for Fortune 500 clients.",
            7.0,
            0,
            "Computer Science, Information Tech, Electronics & Comm, Mechanical Eng, AI & Data Science",
            "2026-11-30",
            "Active"
        ),
        (
            "L&T Technology Services",
            "Embedded Systems Engineer",
            "Full-Time",
            8.5,
            "Pune / Chennai",
            "Designing firmware, sensor interfacing, and micro-controller software for automotive and industrial automation verticals.",
            7.0,
            0,
            "Electronics & Comm, Mechanical Eng",
            "2026-11-25",
            "Active"
        ),
        (
            "TCS Digital",
            "Systems Engineer (Digital Track)",
            "Full-Time",
            7.5,
            "Pan India",
            "Mass recruitment drive for high-potential engineering graduates working on AI, IoT, Cloud, and Cybersecurity enterprise solutions.",
            6.5,
            1,
            "Computer Science, Information Tech, Electronics & Comm, Mechanical Eng, AI & Data Science",
            "2026-12-05",
            "Active"
        ),
        (
            "Amazon Web Services (AWS)",
            "Cloud Support Associate",
            "Full-Time",
            14.0,
            "Bengaluru",
            "Troubleshoot deep technical cloud issues, optimize distributed architectures, and deliver operational excellence to AWS global customers.",
            7.5,
            0,
            "Computer Science, Information Tech, AI & Data Science",
            "2026-10-15",
            "Closed"
        )
    ]
    cursor.executemany("""
    INSERT INTO drives (company_name, role, job_type, package_lpa, location, description, min_cgpa, max_backlogs, eligible_branches, deadline, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, drives)

    # Seed Applications (mapping student ids to drives)
    applications = [
        # Aarav (id 1) applied to Google (1), Microsoft (2), Deloitte (3)
        (1, 1, "Under Review", "Awaiting online assessment results"),
        (2, 1, "Shortlisted", "Shortlisted for Round 1 technical interview on Nov 12"),
        (3, 1, "Offer Extended", "Congratulations! Full-time offer rolled out."),
        # Ananya (id 2) applied to Google (1), Microsoft (2)
        (1, 2, "Offer Extended", "Offered 24 LPA package"),
        (2, 2, "Shortlisted", "Final HR Round scheduled"),
        # Rohan (id 3) applied to Deloitte (3), TCS (5)
        (3, 3, "Applied", "Application submitted"),
        (5, 3, "Under Review", "Cognitive test cleared"),
        # Sneha (id 4) applied to L&T (4), Deloitte (3)
        (4, 4, "Offer Extended", "Offer extended at Pune facility"),
        (3, 4, "Shortlisted", "Technical interview scheduled"),
        # Vikram (id 5) applied to TCS (5)
        (5, 5, "Applied", "Application submitted")
    ]
    cursor.executemany("""
    INSERT INTO applications (drive_id, student_id, status, feedback)
    VALUES (?, ?, ?, ?)
    """, applications)

    # Seed Announcements
    announcements = [
        ("Mock Technical & HR Interviews by Alumni", "T&P cell is conducting 1-on-1 mock interviews this Saturday (10 AM - 4 PM) in Lab 402. Bring 2 hard copies of your updated resume.", "High", "2026-10-27"),
        ("Google Cloud Assessment Guidelines", "Shortlisted students for Google Cloud Drive: Please ensure your system meets the Proctoring requirements (webcam, microphone, Chrome browser).", "High", "2026-10-25"),
        ("Resume Building & ATS Optimization Workshop", "Session on how to optimize technical keywords for Applicant Tracking Systems (ATS) will be held on Thursday at the Central Auditorium.", "Normal", "2026-10-20")
    ]
    cursor.executemany("""
    INSERT INTO announcements (title, content, priority, date_posted)
    VALUES (?, ?, ?, ?)
    """, announcements)

    conn.commit()

if __name__ == "__main__":
    init_db(force_reseed=True)
    print("Database initialized and seeded successfully at:", DB_PATH)
