"""
Comprehensive Unit & Integration Test Suite for Campus Placement Portal.
Verifies all REST API endpoints, eligibility rules, and report generation.
"""

import unittest
from app import app
from database import init_db

class TestCampusPlacementPortal(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db(force_reseed=True)
        cls.client = app.test_client()

    def test_01_health_check(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "healthy")

    def test_02_get_stats(self):
        res = self.client.get("/api/stats")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertGreater(data["total_drives"], 0)
        self.assertGreater(data["total_students"], 0)
        self.assertIn("placement_rate", data)
        self.assertIn("department_stats", data)

    def test_03_get_students_and_drives(self):
        students_res = self.client.get("/api/students")
        self.assertEqual(students_res.status_code, 200)
        students = students_res.get_json()
        self.assertGreaterEqual(len(students), 6)

        drives_res = self.client.get("/api/drives")
        self.assertEqual(drives_res.status_code, 200)
        drives = drives_res.get_json()
        self.assertGreaterEqual(len(drives), 5)

    def test_04_eligibility_enforcement(self):
        # Vikram Rathore (id 5) is MECH with 1 backlog and 7.2 CGPA
        # Google Cloud (id 1) requires min 8.0 CGPA, 0 backlogs, CSE/IT/AI&DS
        res = self.client.post("/api/applications", json={
            "student_id": 5,
            "drive_id": 1
        })
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("Ineligible", data["error"])

    def test_05_successful_application(self):
        # Pooja Nair (id 6) is AI & DS with 8.6 CGPA, 0 backlogs
        # Google Cloud (id 1) allows AI & DS with >= 8.0 CGPA
        res = self.client.post("/api/applications", json={
            "student_id": 6,
            "drive_id": 1
        })
        self.assertIn(res.status_code, [201, 409])
        if res.status_code == 201:
            data = res.get_json()
            self.assertTrue(data["success"])

    def test_06_admin_status_update(self):
        # Update application 1 status to Shortlisted
        res = self.client.put("/api/applications/1/status", json={
            "status": "Shortlisted",
            "feedback": "Selected for Round 1 Interview"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])

    def test_07_csv_export(self):
        res = self.client.get("/api/export/csv")
        self.assertEqual(res.status_code, 200)
        self.assertIn("text/csv", res.headers["Content-Type"])
        self.assertIn("Roll No,Student Name", res.data.decode("utf-8"))

if __name__ == "__main__":
    unittest.main()
