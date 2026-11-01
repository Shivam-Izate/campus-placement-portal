const { useState, useEffect, useMemo } = React;

// --- Helper Icons (Pure SVG) ---
const Icons = {
    Briefcase: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Graduation: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
    ),
    Chart: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    User: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Shield: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    Check: () => (
        <svg className="w-4 h-4 text-emerald-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
    ),
    XCross: () => (
        <svg className="w-4 h-4 text-rose-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Bell: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    ),
    Download: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    ),
    Plus: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
    )
};

function App() {
    // Main state
    const [role, setRole] = useState('student'); // 'student' or 'admin'
    const [selectedStudentId, setSelectedStudentId] = useState(1);
    const [activeTab, setActiveTab] = useState('dashboard');
    
    // Data state
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [drives, setDrives] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('All');
    const [onlyEligible, setOnlyEligible] = useState(false);

    // Selected Drive for Admin Applicant view or Student Detail Modal
    const [selectedDriveForAdmin, setSelectedDriveForAdmin] = useState(1);
    const [adminDriveData, setAdminDriveData] = useState(null);
    const [modalDrive, setModalDrive] = useState(null);

    // Toast alerts
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Current Student Object
    const currentStudent = useMemo(() => {
        return students.find(s => s.id === Number(selectedStudentId)) || null;
    }, [students, selectedStudentId]);

    // Initial Load & refresh
    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [statsRes, studentsRes, drivesRes, annRes, appsRes] = await Promise.all([
                fetch('/api/stats').then(r => r.json()),
                fetch('/api/students').then(r => r.json()),
                fetch('/api/drives').then(r => r.json()),
                fetch('/api/announcements').then(r => r.json()),
                fetch('/api/applications').then(r => r.json())
            ]);
            setStats(statsRes);
            setStudents(studentsRes);
            setDrives(drivesRes);
            setAnnouncements(annRes);
            setApplications(appsRes);
        } catch (err) {
            console.error('Fetch error:', err);
            showToast('Failed to load portal data from backend', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Load admin drive details when drive selection changes
    useEffect(() => {
        if (selectedDriveForAdmin) {
            fetch(`/api/drives/${selectedDriveForAdmin}`)
                .then(r => r.json())
                .then(data => setAdminDriveData(data))
                .catch(err => console.error(err));
        }
    }, [selectedDriveForAdmin, applications]);

    // Eligibility Evaluation Engine
    const evaluateEligibility = (drive, student) => {
        if (!student) return { isEligible: false, reasons: ['Student profile not loaded'] };
        if (drive.status !== 'Active') return { isEligible: false, reasons: ['Drive is closed'] };

        const reasons = [];
        // 1. CGPA Check
        if (Number(student.cgpa) < Number(drive.min_cgpa)) {
            reasons.push(`CGPA is ${student.cgpa} (Min required: ${drive.min_cgpa})`);
        }
        // 2. Backlog Check
        if (Number(student.active_backlogs) > Number(drive.max_backlogs)) {
            reasons.push(`${student.active_backlogs} active backlogs (Max allowed: ${drive.max_backlogs})`);
        }
        // 3. Department Check
        const eligibleDepts = drive.eligible_branches.split(',').map(b => b.trim().toLowerCase());
        const studentDept = student.department.trim().toLowerCase();
        const matchesDept = eligibleDepts.some(d => d.includes(studentDept) || studentDept.includes(d)) || drive.eligible_branches.toLowerCase().includes('all');
        if (!matchesDept) {
            reasons.push(`Branch ${student.department} not in [${drive.eligible_branches}]`);
        }

        return {
            isEligible: reasons.length === 0,
            reasons
        };
    };

    // Check if current student has already applied to a drive
    const getStudentApplication = (driveId) => {
        if (!currentStudent) return null;
        return applications.find(a => a.drive_id === driveId && a.student_id === currentStudent.id) || null;
    };

    // Apply for Drive handler
    const handleApply = async (driveId) => {
        if (!currentStudent) return;
        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: currentStudent.id,
                    drive_id: driveId
                })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(data.message || 'Application submitted successfully!', 'success');
                fetchAllData();
                setModalDrive(null);
            } else {
                showToast(data.error || 'Failed to submit application', 'error');
            }
        } catch (err) {
            showToast('Server connection error', 'error');
        }
    };

    // Admin Status Update handler
    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            const res = await fetch(`/api/applications/${appId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, feedback: `Status updated to ${newStatus} by T&P Cell` })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`Applicant status changed to: ${newStatus}`, 'success');
                fetchAllData();
                if (selectedDriveForAdmin) {
                    fetch(`/api/drives/${selectedDriveForAdmin}`).then(r => r.json()).then(setAdminDriveData);
                }
            } else {
                showToast(data.error || 'Status update failed', 'error');
            }
        } catch (err) {
            showToast('Server error while updating status', 'error');
        }
    };

    // Filtered Drives
    const filteredDrives = useMemo(() => {
        return drives.filter(d => {
            const matchesSearch = d.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  d.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  d.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = jobTypeFilter === 'All' || d.job_type === jobTypeFilter;
            
            if (!matchesSearch || !matchesType) return false;
            
            if (onlyEligible && currentStudent) {
                const { isEligible } = evaluateEligibility(d, currentStudent);
                return isEligible;
            }
            return true;
        });
    }, [drives, searchQuery, jobTypeFilter, onlyEligible, currentStudent]);

    // Student's personal applications
    const studentApplications = useMemo(() => {
        if (!currentStudent) return [];
        return applications.filter(a => a.student_id === currentStudent.id);
    }, [applications, currentStudent]);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Top Notification Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-semibold transition-all duration-300 transform translate-y-0 ${
                    toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                    <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Navigation Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & College Badge */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white shadow-md">
                                <Icons.Graduation />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-extrabold text-lg text-slate-900 tracking-tight">PlaceIQ</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">College Project</span>
                                </div>
                                <p className="text-xs text-slate-500">Training & Placement Automation Portal</p>
                            </div>
                        </div>

                        {/* Role Switcher & Student Selector */}
                        <div className="flex items-center space-x-4">
                            {/* Role Toggle */}
                            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
                                <button
                                    onClick={() => { setRole('student'); setActiveTab('dashboard'); }}
                                    className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                                        role === 'student' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <Icons.User />
                                    <span>Student Portal</span>
                                </button>
                                <button
                                    onClick={() => { setRole('admin'); setActiveTab('dashboard'); }}
                                    className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                                        role === 'admin' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <Icons.Shield />
                                    <span>T&P Officer (Admin)</span>
                                </button>
                            </div>

                            {/* Active Student Switcher (When in student mode) */}
                            {role === 'student' && currentStudent && (
                                <div className="hidden sm:flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
                                    <div className="text-left text-xs">
                                        <span className="text-slate-500 text-[10px] block leading-none">Simulating Student:</span>
                                        <select
                                            value={selectedStudentId}
                                            onChange={(e) => setSelectedStudentId(e.target.value)}
                                            className="bg-transparent font-bold text-indigo-900 focus:outline-none cursor-pointer text-xs"
                                        >
                                            {students.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name} ({s.department.split(' ')[0]} - {s.cgpa} CGPA, {s.active_backlogs} bl)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Secondary Navigation Bar (Tabs) */}
                    <div className="flex space-x-6 border-t border-slate-100 overflow-x-auto text-sm">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`py-3 px-1 border-b-2 font-medium flex items-center space-x-2 whitespace-nowrap transition-colors ${
                                activeTab === 'dashboard' ? 'border-brand-600 text-brand-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Icons.Chart />
                            <span>Overview & Analytics</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('drives')}
                            className={`py-3 px-1 border-b-2 font-medium flex items-center space-x-2 whitespace-nowrap transition-colors ${
                                activeTab === 'drives' ? 'border-brand-600 text-brand-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Icons.Briefcase />
                            <span>Campus Drives ({drives.length})</span>
                        </button>

                        {role === 'student' && (
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`py-3 px-1 border-b-2 font-medium flex items-center space-x-2 whitespace-nowrap transition-colors ${
                                    activeTab === 'applications' ? 'border-brand-600 text-brand-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <span>My Applications</span>
                                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                    {studentApplications.length}
                                </span>
                            </button>
                        )}

                        {role === 'admin' && (
                            <>
                                <button
                                    onClick={() => setActiveTab('admin_applicants')}
                                    className={`py-3 px-1 border-b-2 font-medium flex items-center space-x-2 whitespace-nowrap transition-colors ${
                                        activeTab === 'admin_applicants' ? 'border-brand-600 text-brand-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <span>Applicant Management</span>
                                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                                        Review
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('post_drive')}
                                    className={`py-3 px-1 border-b-2 font-medium flex items-center space-x-2 whitespace-nowrap transition-colors ${
                                        activeTab === 'post_drive' ? 'border-brand-600 text-brand-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <Icons.Plus />
                                    <span>Post New Drive</span>
                                </button>
                            </>
                        )}

                        {role === 'student' && (
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-3 px-1 border-b-2 font-medium flex items-center space-x-2 whitespace-nowrap transition-colors ${
                                    activeTab === 'profile' ? 'border-brand-600 text-brand-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Icons.User />
                                <span>My Profile & Eligibility</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-semibold text-slate-600">Loading placement data from SQLite database...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && (
                            <DashboardView
                                stats={stats}
                                drives={drives}
                                announcements={announcements}
                                onSelectDrive={(d) => { setActiveTab('drives'); setModalDrive(d); }}
                                role={role}
                            />
                        )}

                        {activeTab === 'drives' && (
                            <DrivesView
                                drives={filteredDrives}
                                currentStudent={currentStudent}
                                evaluateEligibility={evaluateEligibility}
                                getStudentApplication={getStudentApplication}
                                onApply={handleApply}
                                onOpenModal={(d) => setModalDrive(d)}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                jobTypeFilter={jobTypeFilter}
                                setJobTypeFilter={setJobTypeFilter}
                                onlyEligible={onlyEligible}
                                setOnlyEligible={setOnlyEligible}
                                role={role}
                            />
                        )}

                        {activeTab === 'applications' && role === 'student' && (
                            <StudentApplicationsView
                                studentApplications={studentApplications}
                                currentStudent={currentStudent}
                                onBrowseDrives={() => setActiveTab('drives')}
                            />
                        )}

                        {activeTab === 'admin_applicants' && role === 'admin' && (
                            <AdminApplicantsView
                                drives={drives}
                                selectedDriveId={selectedDriveForAdmin}
                                setSelectedDriveId={setSelectedDriveForAdmin}
                                driveData={adminDriveData}
                                onUpdateStatus={handleUpdateStatus}
                                onRefresh={fetchAllData}
                            />
                        )}

                        {activeTab === 'post_drive' && role === 'admin' && (
                            <PostDriveView
                                onSuccess={() => {
                                    showToast('Hiring Drive created successfully!', 'success');
                                    fetchAllData();
                                    setActiveTab('drives');
                                }}
                            />
                        )}

                        {activeTab === 'profile' && role === 'student' && currentStudent && (
                            <StudentProfileView
                                student={currentStudent}
                                onUpdateStudent={async (updatedData) => {
                                    try {
                                        const res = await fetch(`/api/students/${currentStudent.id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(updatedData)
                                        });
                                        if (res.ok) {
                                            showToast('Profile updated successfully!', 'success');
                                            fetchAllData();
                                        } else {
                                            showToast('Failed to update profile', 'error');
                                        }
                                    } catch (e) {
                                        showToast('Server error', 'error');
                                    }
                                }}
                                drives={drives}
                                evaluateEligibility={evaluateEligibility}
                            />
                        )}
                    </>
                )}
            </main>

            {/* Drive Details Modal */}
            {modalDrive && (
                <DriveDetailModal
                    drive={modalDrive}
                    student={currentStudent}
                    role={role}
                    eligibility={evaluateEligibility(modalDrive, currentStudent)}
                    application={getStudentApplication(modalDrive.id)}
                    onClose={() => setModalDrive(null)}
                    onApply={() => handleApply(modalDrive.id)}
                />
            )}

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p>© 2026 Campus Placement Portal — Final Year / Semester Engineering Project</p>
                    <div className="flex items-center space-x-4">
                        <span className="font-semibold text-slate-700">Tech Stack:</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Python Flask REST API</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">SQLite3 Database</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">React 18 SPA</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// ----------------- SUB-VIEW COMPONENTS -----------------

function DashboardView({ stats, drives, announcements, onSelectDrive, role }) {
    if (!stats) return null;

    return (
        <div className="space-y-8">
            {/* College Welcome Banner */}
            <div className="bg-gradient-to-r from-brand-900 via-indigo-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <span className="bg-indigo-700/60 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                        T&P Official Dashboard
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
                        Department Placement & Corporate Connect Portal
                    </h1>
                    <p className="text-indigo-200 text-sm mt-2 leading-relaxed">
                        Automating student eligibility verification, on-campus drive scheduling, and transparent application tracking for the Academic Year 2026.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-2xl"></div>
                <div className="absolute right-32 -top-12 w-48 h-48 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Drives</p>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{stats.active_drives}</h3>
                        <p className="text-xs text-emerald-600 font-semibold mt-1">Out of {stats.total_drives} total companies</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                        💼
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Placement Rate</p>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{stats.placement_rate}%</h3>
                        <p className="text-xs text-slate-500 mt-1">{stats.placed_students} of {stats.total_students} students placed</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                        📈
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Highest Package</p>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">₹{stats.highest_package} <span className="text-sm font-normal text-slate-500">LPA</span></h3>
                        <p className="text-xs text-indigo-600 font-semibold mt-1">Avg: ₹{stats.avg_package} LPA</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                        🏆
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Applications Processed</p>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{stats.total_applications}</h3>
                        <p className="text-xs text-slate-500 mt-1">Across all departments</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold">
                        📑
                    </div>
                </div>
            </div>

            {/* Department Placements & Notices Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Chart: Department Placements */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Branch-Wise Placement Statistics</h2>
                            <p className="text-xs text-slate-500">Percentage of placed students sorted by academic department</p>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg">NAAC Metric 5.2.1</span>
                    </div>

                    <div className="space-y-4">
                        {stats.department_stats && stats.department_stats.map((dept, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-slate-800 font-bold">{dept.department}</span>
                                    <span className="text-slate-600">
                                        <span className="text-indigo-600 font-extrabold">{dept.placed}</span> / {dept.total} placed ({dept.placement_rate}%)
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                                    <div
                                        className="bg-gradient-to-r from-brand-600 to-indigo-500 h-full rounded-full transition-all duration-700"
                                        style={{ width: `${dept.placement_rate}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Funnel distribution preview */}
                    <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                        {Object.entries(stats.status_breakdown || {}).map(([key, count], idx) => (
                            <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-base font-extrabold text-slate-800 block">{count}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-tight block truncate font-medium">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* College T&P Notice Board */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                                <Icons.Bell />
                                <span>T&P Notice Board</span>
                            </h2>
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                            </span>
                        </div>

                        <div className="space-y-4">
                            {announcements.map((ann) => (
                                <div key={ann.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                            ann.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                            {ann.priority} Priority
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">{ann.date_posted}</span>
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900">{ann.title}</h3>
                                    <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">{ann.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {role === 'admin' && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <a
                                href="/api/export/csv"
                                className="w-full inline-flex items-center justify-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors border border-indigo-200"
                            >
                                <Icons.Download />
                                <span>Download Accreditation CSV Report</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Drives Carousel / Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Featured Recruitment Drives</h2>
                    <span className="text-xs text-slate-500">Currently accepting applications</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {drives.slice(0, 3).map(drive => (
                        <div key={drive.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        ₹{drive.package_lpa} LPA
                                    </span>
                                    <span className="text-[11px] font-semibold text-slate-400">{drive.job_type}</span>
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900 mt-3">{drive.company_name}</h3>
                                <p className="text-xs font-semibold text-indigo-600">{drive.role}</p>
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{drive.description}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-400 font-medium">Min CGPA: <strong>{drive.min_cgpa}</strong></span>
                                <button
                                    onClick={() => onSelectDrive(drive)}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                                >
                                    Details & Apply →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DrivesView({
    drives,
    currentStudent,
    evaluateEligibility,
    getStudentApplication,
    onApply,
    onOpenModal,
    searchQuery,
    setSearchQuery,
    jobTypeFilter,
    setJobTypeFilter,
    onlyEligible,
    setOnlyEligible,
    role
}) {
    return (
        <div className="space-y-6">
            {/* Search and Filters Header */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search Box */}
                <div className="w-full md:w-96 relative">
                    <input
                        type="text"
                        placeholder="Search company, job role, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <div className="absolute left-3 top-2.5 text-slate-400">
                        🔍
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Job Type Selector */}
                    <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium">
                        {['All', 'Full-Time', 'Internship'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setJobTypeFilter(type)}
                                className={`px-3 py-1 rounded-lg transition-colors ${
                                    jobTypeFilter === type ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Only Eligible Filter (Student mode) */}
                    {role === 'student' && (
                        <button
                            onClick={() => setOnlyEligible(!onlyEligible)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                onlyEligible
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {onlyEligible ? '✓ Showing Only Eligible' : 'Filter: Eligible For Me'}
                        </button>
                    )}
                </div>
            </div>

            {/* Drives List Grid */}
            {drives.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <p className="text-slate-500 text-sm">No campus drives match your active filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drives.map(drive => {
                        const eligibility = role === 'student' ? evaluateEligibility(drive, currentStudent) : null;
                        const application = role === 'student' ? getStudentApplication(drive.id) : null;

                        return (
                            <div
                                key={drive.id}
                                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                                    drive.status === 'Closed' ? 'opacity-70 border-slate-200' : 'border-slate-200'
                                }`}
                            >
                                <div className="p-5">
                                    {/* Top Tags */}
                                    <div className="flex justify-between items-start gap-2">
                                        <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            ₹{drive.package_lpa} LPA
                                        </span>
                                        <div className="flex items-center space-x-1.5">
                                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                                {drive.job_type}
                                            </span>
                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                                drive.status === 'Active' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                                {drive.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Company & Role */}
                                    <div className="mt-3">
                                        <h3 className="text-lg font-black text-slate-900">{drive.company_name}</h3>
                                        <p className="text-xs font-bold text-indigo-600 mt-0.5">{drive.role}</p>
                                        <p className="text-xs text-slate-500 flex items-center mt-1">
                                            📍 {drive.location}
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                                        {drive.description}
                                    </p>

                                    {/* Criteria Requirements */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                                        <div className="bg-slate-50 p-2 rounded-lg">
                                            <span className="text-slate-400 block text-[10px]">Min CGPA:</span>
                                            <span className="font-bold text-slate-800">{drive.min_cgpa} / 10.0</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-lg">
                                            <span className="text-slate-400 block text-[10px]">Backlogs:</span>
                                            <span className="font-bold text-slate-800">Max {drive.max_backlogs} Allowed</span>
                                        </div>
                                    </div>

                                    {/* Eligible Branches */}
                                    <div className="mt-2 text-[10px] text-slate-500 truncate">
                                        <span className="font-semibold text-slate-700">Eligible: </span>
                                        {drive.eligible_branches}
                                    </div>

                                    {/* Student Eligibility Evaluation Badge */}
                                    {role === 'student' && currentStudent && (
                                        <div className="mt-4">
                                            {eligibility.isEligible ? (
                                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs flex items-center space-x-2">
                                                    <Icons.Check />
                                                    <span className="font-bold">You are Eligible to Apply</span>
                                                </div>
                                            ) : (
                                                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2 rounded-xl text-xs">
                                                    <div className="flex items-center space-x-1.5 font-bold mb-1">
                                                        <Icons.XCross />
                                                        <span>Not Eligible:</span>
                                                    </div>
                                                    <ul className="list-disc list-inside text-[11px] text-rose-700 space-y-0.5">
                                                        {eligibility.reasons.map((r, idx) => (
                                                            <li key={idx} className="truncate">{r}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer Actions */}
                                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        Deadline: <strong>{drive.deadline}</strong>
                                    </span>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onOpenModal(drive)}
                                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                                        >
                                            Details
                                        </button>

                                        {role === 'student' && (
                                            application ? (
                                                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                                    {application.status}
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => onApply(drive.id)}
                                                    disabled={!eligibility.isEligible || drive.status !== 'Active'}
                                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                        eligibility.isEligible && drive.status === 'Active'
                                                            ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-xs'
                                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    Apply Now
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function StudentApplicationsView({ studentApplications, currentStudent, onBrowseDrives }) {
    if (studentApplications.length === 0) {
        return (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 max-w-xl mx-auto shadow-xs">
                <div className="text-4xl mb-3">📂</div>
                <h3 className="text-lg font-bold text-slate-900">No Applications Yet</h3>
                <p className="text-xs text-slate-500 mt-1">You haven't submitted any job or internship applications for this hiring season.</p>
                <button
                    onClick={onBrowseDrives}
                    className="mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-sm"
                >
                    Browse Eligible Drives →
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900">My Application Timeline</h2>
                    <p className="text-xs text-slate-500">Track interview progress, screening results, and corporate offers</p>
                </div>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-100">
                    {studentApplications.length} Submissions
                </span>
            </div>

            <div className="space-y-4">
                {studentApplications.map(app => {
                    const statusSteps = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Offer Extended'];
                    const currentIdx = statusSteps.indexOf(app.status);
                    const isRejected = app.status === 'Rejected';

                    return (
                        <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                                <div>
                                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">{app.job_type}</span>
                                    <h3 className="text-xl font-black text-slate-900">{app.company_name}</h3>
                                    <p className="text-xs font-semibold text-slate-600">{app.role} • {app.location}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-extrabold text-emerald-600">₹{app.package_lpa} LPA</span>
                                    <p className="text-[10px] text-slate-400">Applied on {app.applied_at ? app.applied_at.split(' ')[0] : 'Recently'}</p>
                                </div>
                            </div>

                            {/* Status Stepper Tracker */}
                            <div className="py-5">
                                <p className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Hiring Stage:</p>
                                {isRejected ? (
                                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                                        ❌ Application Status: Regret to inform that this candidate was not shortlisted.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {statusSteps.map((step, idx) => {
                                            const isPassed = currentIdx >= idx;
                                            const isCurrent = currentIdx === idx;
                                            return (
                                                <div
                                                    key={step}
                                                    className={`p-2.5 rounded-xl border text-center transition-all ${
                                                        isCurrent
                                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                                                            : isPassed
                                                            ? 'bg-indigo-50 text-indigo-900 border-indigo-100 font-semibold'
                                                            : 'bg-slate-50 text-slate-400 border-slate-100 text-xs'
                                                    }`}
                                                >
                                                    <span className="text-[10px] block opacity-80">Stage {idx + 1}</span>
                                                    <span className="text-xs font-bold truncate block">{step}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* T&P Cell Feedback */}
                            {app.feedback && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                                    <span className="font-bold text-slate-900">T&P Officer Note: </span>
                                    <span>{app.feedback}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function AdminApplicantsView({ drives, selectedDriveId, setSelectedDriveId, driveData, onUpdateStatus, onRefresh }) {
    const [deptFilter, setDeptFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    if (!driveData) {
        return (
            <div className="text-center py-12 text-slate-500">Loading drive applicants...</div>
        );
    }

    const applicants = (driveData.applicants || []).filter(a => {
        const matchDept = deptFilter === 'All' || a.department === deptFilter;
        const matchStatus = statusFilter === 'All' || a.status === statusFilter;
        return matchDept && matchStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header with Drive Selector and CSV Download */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Admin Review Console</span>
                    <h2 className="text-xl font-black text-slate-900">Manage Drive Applicants</h2>
                    <p className="text-xs text-slate-500">Screen candidates, schedule interviews, and update corporate hiring outcomes</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Drive Selector */}
                    <select
                        value={selectedDriveId}
                        onChange={(e) => setSelectedDriveId(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 py-2 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    >
                        {drives.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.company_name} - {d.role}
                            </option>
                        ))}
                    </select>

                    {/* CSV Export */}
                    <a
                        href="/api/export/csv"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center space-x-1.5 transition-colors shadow-xs"
                    >
                        <Icons.Download />
                        <span>Export CSV Report</span>
                    </a>
                </div>
            </div>

            {/* Drive Overview Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Applicants</span>
                    <h4 className="text-2xl font-black text-slate-900 mt-1">{driveData.applicants ? driveData.applicants.length : 0}</h4>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Shortlisted</span>
                    <h4 className="text-2xl font-black text-indigo-600 mt-1">
                        {driveData.applicants ? driveData.applicants.filter(a => a.status === 'Shortlisted').length : 0}
                    </h4>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Interviews Scheduled</span>
                    <h4 className="text-2xl font-black text-amber-600 mt-1">
                        {driveData.applicants ? driveData.applicants.filter(a => a.status === 'Interview Scheduled').length : 0}
                    </h4>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Offers Extended</span>
                    <h4 className="text-2xl font-black text-emerald-600 mt-1">
                        {driveData.applicants ? driveData.applicants.filter(a => a.status === 'Offer Extended').length : 0}
                    </h4>
                </div>
            </div>

            {/* Applicant Roster Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
                    <h3 className="text-sm font-bold text-slate-800">
                        Candidate Roster for {driveData.company_name}
                    </h3>
                    {/* Filters */}
                    <div className="flex items-center space-x-2 text-xs">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-50 border border-slate-300 py-1.5 px-2 rounded-lg"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Offer Extended">Offer Extended</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-5 py-3">Roll No</th>
                                <th className="px-5 py-3">Student Name</th>
                                <th className="px-5 py-3">Department</th>
                                <th className="px-5 py-3">CGPA / Backlogs</th>
                                <th className="px-5 py-3">Skills & Profile</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 text-right">Officer Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {applicants.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-slate-400">
                                        No candidates match the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                applicants.map(app => (
                                    <tr key={app.application_id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-slate-900">{app.roll_no}</td>
                                        <td className="px-5 py-3.5">
                                            <div className="font-bold text-slate-900">{app.name}</div>
                                            <div className="text-[10px] text-slate-400">{app.email}</div>
                                        </td>
                                        <td className="px-5 py-3.5 font-medium text-slate-700">{app.department}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="font-extrabold text-indigo-700">{app.cgpa}</span>
                                            <span className="text-[10px] text-slate-400 block">{app.active_backlogs} backlogs</span>
                                        </td>
                                        <td className="px-5 py-3.5 max-w-xs truncate text-[11px] text-slate-600">
                                            {app.skills}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                app.status === 'Offer Extended' ? 'bg-emerald-100 text-emerald-800' :
                                                app.status === 'Shortlisted' ? 'bg-indigo-100 text-indigo-800' :
                                                app.status === 'Interview Scheduled' ? 'bg-amber-100 text-amber-800' :
                                                app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right space-x-1">
                                            <select
                                                value={app.status}
                                                onChange={(e) => onUpdateStatus(app.application_id, e.target.value)}
                                                className="bg-white border border-slate-300 rounded-lg text-xs py-1 px-2 font-medium focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                            >
                                                <option value="Applied">Applied</option>
                                                <option value="Under Review">Under Review</option>
                                                <option value="Shortlisted">Shortlist</option>
                                                <option value="Interview Scheduled">Interview</option>
                                                <option value="Offer Extended">Offer Extended</option>
                                                <option value="Rejected">Reject</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function PostDriveView({ onSuccess }) {
    const [formData, setFormData] = useState({
        company_name: '',
        role: '',
        job_type: 'Full-Time',
        package_lpa: '',
        location: 'Bengaluru / Hybrid',
        min_cgpa: '7.0',
        max_backlogs: '0',
        eligible_branches: 'Computer Science, Information Tech, Electronics & Comm, AI & Data Science',
        deadline: '2026-11-30',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/drives', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                onSuccess();
            } else {
                alert('Failed to post drive');
            }
        } catch (err) {
            alert('Server error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="border-b border-slate-100 pb-4 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">T&P Officer Portal</span>
                <h2 className="text-xl font-black text-slate-900">Post New Campus Recruitment Drive</h2>
                <p className="text-xs text-slate-500">Configure corporate eligibility criteria, CTC package, and student branch requirements.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Cisco Systems, Oracle, Infosys"
                            value={formData.company_name}
                            onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Job Role *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Associate Software Engineer"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Job Type</label>
                        <select
                            value={formData.job_type}
                            onChange={e => setFormData({ ...formData, job_type: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Full-Time">Full-Time</option>
                            <option value="Internship">Internship</option>
                            <option value="Intern + Full-Time">Intern + Full-Time</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Annual CTC (₹ LPA) *</label>
                        <input
                            type="number"
                            step="0.1"
                            required
                            placeholder="e.g. 12.5"
                            value={formData.package_lpa}
                            onChange={e => setFormData({ ...formData, package_lpa: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Eligibility criteria config */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <div>
                        <label className="block font-bold text-indigo-950 mb-1">Minimum CGPA (out of 10.0)</label>
                        <input
                            type="number"
                            step="0.1"
                            max="10"
                            min="0"
                            required
                            value={formData.min_cgpa}
                            onChange={e => setFormData({ ...formData, min_cgpa: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block font-bold text-indigo-950 mb-1">Max Active Backlogs Allowed</label>
                        <input
                            type="number"
                            min="0"
                            required
                            value={formData.max_backlogs}
                            onChange={e => setFormData({ ...formData, max_backlogs: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block font-bold text-indigo-950 mb-1">Application Deadline</label>
                        <input
                            type="date"
                            required
                            value={formData.deadline}
                            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-bold text-slate-700 mb-1">Eligible Engineering Branches (Comma-separated)</label>
                    <input
                        type="text"
                        required
                        value={formData.eligible_branches}
                        onChange={e => setFormData({ ...formData, eligible_branches: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Hint: Type "All Branches" or comma-separated branch names like "Computer Science, Electronics & Comm"</p>
                </div>

                <div>
                    <label className="block font-bold text-slate-700 mb-1">Job Description & Skill Requirements</label>
                    <textarea
                        rows="4"
                        placeholder="Detail key responsibilities, interview rounds, and required technical skills..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-brand-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-colors shadow-sm text-xs"
                    >
                        {submitting ? 'Publishing Drive...' : 'Publish Campus Drive'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function StudentProfileView({ student, onUpdateStudent, drives, evaluateEligibility }) {
    const [profile, setProfile] = useState({ ...student });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setProfile({ ...student });
    }, [student]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onUpdateStudent(profile);
        setSaving(false);
    };

    // Calculate how many drives student is eligible for
    const eligibleDrivesCount = useMemo(() => {
        return drives.filter(d => evaluateEligibility(d, profile).isEligible).length;
    }, [drives, profile]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5 mb-6">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-black text-slate-900">{profile.name}</h2>
                            <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-md">
                                {profile.roll_no}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{profile.department} • Graduating Class of 2026</p>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-center">
                        <span className="text-[10px] uppercase font-bold block">Eligibility Score</span>
                        <span className="text-lg font-black">{eligibleDrivesCount} / {drives.length}</span>
                        <span className="text-[10px] block font-medium">Eligible Drives</span>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Roll Number / Student ID</label>
                            <input
                                type="text"
                                disabled
                                value={profile.roll_no}
                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">College Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                value={profile.phone}
                                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div>
                            <label className="block font-bold text-slate-900 mb-1">Department / Branch</label>
                            <select
                                value={profile.department}
                                onChange={e => setProfile({ ...profile, department: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Tech">Information Tech</option>
                                <option value="Electronics & Comm">Electronics & Comm</option>
                                <option value="Mechanical Eng">Mechanical Eng</option>
                                <option value="AI & Data Science">AI & Data Science</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold text-slate-900 mb-1">Cumulative CGPA (out of 10.0)</label>
                            <input
                                type="number"
                                step="0.01"
                                max="10"
                                min="0"
                                value={profile.cgpa}
                                onChange={e => setProfile({ ...profile, cgpa: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-extrabold text-indigo-700 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-slate-900 mb-1">Active Backlogs</label>
                            <input
                                type="number"
                                min="0"
                                value={profile.active_backlogs}
                                onChange={e => setProfile({ ...profile, active_backlogs: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Technical Skills & Certifications</label>
                        <input
                            type="text"
                            value={profile.skills || ''}
                            onChange={e => setProfile({ ...profile, skills: e.target.value })}
                            placeholder="e.g. React, Python, Data Structures, AWS, Docker"
                            className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Resume / Portfolio Link</label>
                        <input
                            type="text"
                            value={profile.resume_url || ''}
                            onChange={e => setProfile({ ...profile, resume_url: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-brand-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
                        >
                            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DriveDetailModal({ drive, student, role, eligibility, application, onClose, onApply }) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
                >
                    ✕
                </button>

                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    <span>{drive.job_type} Drive</span>
                    <span>•</span>
                    <span className="text-slate-400">Deadline: {drive.deadline}</span>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mt-2">{drive.company_name}</h2>
                <p className="text-sm font-bold text-indigo-600">{drive.role} • {drive.location}</p>

                {/* Package Highlight */}
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex justify-between items-center">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block">Annual Compensation Package</span>
                        <span className="text-2xl font-black text-emerald-900">₹{drive.package_lpa} LPA</span>
                    </div>
                    <span className="text-xs bg-white text-emerald-800 font-bold px-3 py-1 rounded-xl shadow-xs">
                        Direct Campus Hiring
                    </span>
                </div>

                {/* Job Description */}
                <div className="mt-6 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Role & Responsibilities</h3>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {drive.description}
                    </p>
                </div>

                {/* Eligibility Criteria Breakdown */}
                <div className="mt-6 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Eligibility Criteria Requirements</h3>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block">Minimum CGPA</span>
                            <span className="font-extrabold text-slate-800">{drive.min_cgpa} / 10.0</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block">Allowed Backlogs</span>
                            <span className="font-extrabold text-slate-800">Max {drive.max_backlogs}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block">Status</span>
                            <span className="font-extrabold text-indigo-700">{drive.status}</span>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1">
                        <strong>Eligible Branches: </strong>{drive.eligible_branches}
                    </p>
                </div>

                {/* Student Eligibility Evaluation */}
                {role === 'student' && student && (
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        {eligibility.isEligible ? (
                            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center space-x-2 font-bold">
                                <Icons.Check />
                                <span>You satisfy all criteria (CGPA: {student.cgpa}, Backlogs: {student.active_backlogs}, Branch: {student.department})</span>
                            </div>
                        ) : (
                            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs">
                                <div className="font-bold mb-1">Criteria Not Met:</div>
                                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                                    {eligibility.reasons.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                    >
                        Close
                    </button>

                    {role === 'student' && (
                        application ? (
                            <div className="px-5 py-2 bg-indigo-50 text-indigo-800 font-bold text-xs rounded-xl border border-indigo-200">
                                Current Status: {application.status}
                            </div>
                        ) : (
                            <button
                                onClick={onApply}
                                disabled={!eligibility.isEligible || drive.status !== 'Active'}
                                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                                    eligibility.isEligible && drive.status === 'Active'
                                        ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Confirm Application
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

// Mount React Root
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
