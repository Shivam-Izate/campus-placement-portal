# PlaceIQ: Campus Placement & Internship Management Portal
> **Engineering College Capstone / Mini-Project**  
> **Domain:** Full-Stack Web Development, Campus Automation, Academic Analytics  
> **Tech Stack:** Python (Flask REST API), SQLite3, React 18, Tailwind CSS  

---

## 📌 1. Project Overview & Problem Statement
In engineering colleges, the **Training and Placement (T&P) Cell** manually manages hundreds of student registrations, visiting corporate companies, job postings, minimum CGPA thresholds, branch restrictions, backlog criteria, and multi-round interviews.

Manual spreadsheet-based tracking leads to:
- Ineligible students mistakenly applying for restricted corporate drives.
- Delay in notifying students about interview shortlists.
- Inaccurate manual calculations for NAAC / NBA placement accreditation reports.

**PlaceIQ** solves this by providing a unified, automated portal with:
1. **Automated Eligibility Engine**: Dynamically cross-verifies Student CGPA, Backlogs, and Branch against Company criteria before allowing an application.
2. **Dual Role Architecture**:
   - 🎓 **Student Portal**: Browse drives, check eligibility badges in real time, apply in 1-click, and track application stages.
   - 🛡️ **T&P Officer / Admin Console**: Post new drives, filter candidates, advance application statuses, and view live placement metrics.
3. **Institutional Analytics**: Real-time department placement rates, average/highest CTC, and instant NAAC-compliant CSV reports.

---

## 🏗️ 2. System Architecture

```text
+-------------------------------------------------------------+
|                     Client Tier (Browser)                   |
|  - React 18 Single-Page Application (SPA)                   |
|  - Real-time Eligibility Evaluation Engine                  |
|  - Role Switcher (Student Simulation vs Placement Officer)  |
|  - Interactive Department Placement Analytics Charts        |
+------------------------------+------------------------------+
                               |
                               | RESTful HTTP JSON Requests
                               v
+-------------------------------------------------------------+
|                     Server Tier (Flask)                     |
|  - Flask Application Server (app.py)                        |
|  - Cross-Origin Resource Sharing (CORS)                     |
|  - Eligibility Business Rules & Integrity Verification      |
|  - Dynamic CSV Generation Engine                            |
+------------------------------+------------------------------+
                               |
                               | SQLite Driver (Python sqlite3)
                               v
+-------------------------------------------------------------+
|                    Database Tier (SQLite)                   |
|  - placement.db                                             |
|  - Tables: students, drives, applications, announcements    |
+-------------------------------------------------------------+
```

---

## 🗄️ 3. Entity-Relationship (ER) Schema

```
  +------------------+         +----------------------+         +--------------------+
  |     STUDENTS     |         |     APPLICATIONS     |         |       DRIVES       |
  +------------------+         +----------------------+         +--------------------+
  | id (PK)          |<-------+| id (PK)              |+------->| id (PK)            |
  | roll_no (UNIQUE) |         | student_id (FK)      |         | company_name       |
  | name             |         | drive_id (FK)        |         | role               |
  | email (UNIQUE)   |         | status               |         | job_type           |
  | department       |         | applied_at           |         | package_lpa        |
  | cgpa             |         | feedback             |         | min_cgpa           |
  | active_backlogs  |         +----------------------+         | max_backlogs       |
  | skills           |                                          | eligible_branches  |
  | resume_url       |                                          | deadline           |
  +------------------+                                          | status             |
                                                                +--------------------+
```

---

## 🚀 4. How to Run the Project

### Prerequisites
- **Python 3.8+** (Uses standard Python library `sqlite3` and `Flask`).
- No external internet or database installation required—all vendor libraries are cached offline!

### Quick Start (Windows)
1. Navigate to the project directory:
   ```cmd
   cd C:\Users\qa\.gemini\antigravity\scratch\campus-placement-portal
   ```
2. Double-click `run.bat` **OR** run via command prompt:
   ```cmd
   py app.py
   ```
3. Open your web browser and visit:
   ```
   http://127.0.0.1:5000
   ```

### Running Unit & Integration Tests
To demonstrate test automation to examiners:
```cmd
py test_portal.py
```
*(Runs 7 automated test cases verifying health, eligibility enforcement, status updates, and reports in < 0.1 seconds).*

---

## 📡 5. REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/stats` | Aggregated placement KPIs, department rates, and funnel metrics |
| `GET` | `/api/students` | List all registered engineering students |
| `GET` | `/api/students/<id>` | Fetch student profile and application history |
| `PUT` | `/api/students/<id>` | Update student profile (CGPA, skills, backlogs) |
| `GET` | `/api/drives` | List campus hiring drives (supports `?status=Active`) |
| `POST` | `/api/drives` | Post a new company recruitment drive (Admin) |
| `GET` | `/api/applications` | Query applications (supports `?student_id=` or `?drive_id=`) |
| `POST` | `/api/applications` | Submit job application with automated eligibility validation |
| `PUT` | `/api/applications/<id>/status` | Update candidate hiring stage (Shortlist, Interview, Offer, Reject) |
| `GET` | `/api/announcements` | Get T&P notice board announcements |
| `GET` | `/api/export/csv` | Download instant accreditation-ready placement report (CSV) |

---

## 🎯 6. Key Features Demonstrated in Viva

1. **Dynamic Eligibility Validation Engine**:
   - Try applying for *Google Cloud* (Min 8.0 CGPA) with *Aarav Sharma* (8.85 CGPA) ➔ **Eligible & Application Accepted**.
   - Switch active student to *Vikram Rathore* (Mechanical, 7.20 CGPA, 1 Backlog) ➔ **Real-time Ineligibility warnings displayed**, and backend rejects application with `400 Bad Request`.
2. **Placement Funnel & Candidate Management**:
   - In Admin Mode, switch to the *Applicant Management* tab.
   - Select any company drive to view the applicant table.
   - Change candidate stage to `Shortlisted`, `Interview Scheduled`, or `Offer Extended`—the UI and database update instantly without page reloads.
3. **Accreditation Export**:
   - Click **Export CSV Report** to download student placement records formatted for NAAC Criteria 5.2.1 and NBA accreditation files.

---

## 💡 7. Frequently Asked Viva-Voce Questions & Answers

### Q1: Why did you choose SQLite instead of MySQL or MongoDB for this system?
> **Answer:** SQLite is an ACID-compliant, serverless, self-contained relational database stored in a single file (`placement.db`). For an on-premise college portal or departmental demo, it eliminates complex database server setup while delivering sub-millisecond query execution. In production, the SQLite schema can be transitioned to PostgreSQL with zero schema rewrite using an ORM like SQLAlchemy.

### Q2: How does your application prevent unauthorized or duplicate applications?
> **Answer:** At the database level, a composite unique constraint `UNIQUE(drive_id, student_id)` prevents double applications. At the application layer, the Flask API executes a 4-point eligibility check (Active Drive status, CGPA threshold, Backlog limit, and Department matching) before inserting any record.

### Q3: How is this architecture decoupled?
> **Answer:** The frontend communicates strictly via JSON over REST APIs (`/api/*`). The React presentation layer does not have direct database access, allowing the backend to scale or change independently from the client UI.
