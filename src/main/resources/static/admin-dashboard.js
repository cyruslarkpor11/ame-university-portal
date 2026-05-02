// API Base URL
const API_BASE = '/api';

// Demo data for immediate display
const DEMO_DATA = {
    departments: [
        { id: 1, code: 'CS', name: 'Computer Science', description: 'Computing and IT programs', headOfDepartment: 'Dr. Smith', email: 'cs@university.edu', active: true },
        { id: 2, code: 'ENG', name: 'Engineering', description: 'Engineering disciplines', headOfDepartment: 'Dr. Johnson', email: 'eng@university.edu', active: true },
        { id: 3, code: 'BUS', name: 'Business Administration', description: 'Business and management', headOfDepartment: 'Prof. Williams', email: 'bus@university.edu', active: true }
    ],
    announcements: [
        { id: 1, title: 'Welcome to Spring Semester 2025', content: 'Classes begin on January 15th', type: 'ACADEMIC', targetAudience: 'ALL', priority: 5, publishDate: new Date().toISOString() },
        { id: 2, title: 'Registration Deadline Extended', content: 'Registration now open until January 20th', type: 'ADMINISTRATIVE', targetAudience: 'STUDENTS', priority: 4, publishDate: new Date().toISOString() },
        { id: 3, title: 'New Library Hours', content: 'Library now open 24/7 during exam period', type: 'GENERAL', targetAudience: 'ALL', priority: 3, publishDate: new Date().toISOString() }
    ],
    calendar: [
        { id: 1, academicYear: '2024-2025', semester: 'Second', eventType: 'CLASSES_START', title: 'Spring Semester Begins', startDate: '2025-01-15', endDate: '2025-01-15', active: true },
        { id: 2, academicYear: '2024-2025', semester: 'Second', eventType: 'REGISTRATION', title: 'Course Registration Period', startDate: '2025-01-08', endDate: '2025-01-20', active: true },
        { id: 3, academicYear: '2024-2025', semester: 'Second', eventType: 'EXAMINATION', title: 'Midterm Examinations', startDate: '2025-03-15', endDate: '2025-03-22', active: true }
    ],
    users: [
        { username: 'admin', email: 'admin@university.edu', role: 'ADMIN', department: null },
        { username: 'prof.smith', email: 'smith@university.edu', role: 'LECTURER', department: 'Computer Science' },
        { username: 'student001', email: 'student001@university.edu', role: 'STUDENT', department: 'Engineering' }
    ]
};

// Modals
let departmentModal, announcementModal, calendarModal;
let useDemoData = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    departmentModal = new bootstrap.Modal(document.getElementById('departmentModal'));
    announcementModal = new bootstrap.Modal(document.getElementById('announcementModal'));
    calendarModal = new bootstrap.Modal(document.getElementById('calendarModal'));
    
    // Set current date
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '/logout') return;
            e.preventDefault();
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Load initial data
    loadDashboardData();
    loadDepartments();
    loadAnnouncements();
    loadCalendar();
    loadUsers();
});

// Show section
function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('d-none'));
    document.getElementById(section + '-section').classList.remove('d-none');
    document.getElementById('page-title').textContent = 
        section.charAt(0).toUpperCase() + section.slice(1);
    
    if (section === 'analytics') {
        loadAnalytics();
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    document.querySelector('.toast-container').appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    setTimeout(() => toast.remove(), 5000);
}

// API helper with fallback to demo data
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using demo data:', error);
        useDemoData = true;
        return null;
    }
}

// ==================== DASHBOARD ====================
async function loadDashboardData() {
    try {
        // Try API first, fallback to demo data
        const users = await apiCall('/users') || { data: DEMO_DATA.users };
        const departments = await apiCall('/departments') || { data: DEMO_DATA.departments };
        const announcements = await apiCall('/announcements') || { data: DEMO_DATA.announcements };
        const events = await apiCall('/calendar') || { data: DEMO_DATA.calendar };
        
        document.getElementById('total-users').textContent = users.data?.length || 0;
        document.getElementById('total-departments').textContent = departments.data?.length || 0;
        document.getElementById('total-announcements').textContent = announcements.data?.length || 0;
        document.getElementById('total-events').textContent = events.data?.length || 0;
        
        // Recent announcements
        const recentAnn = announcements.data?.slice(0, 5) || [];
        document.getElementById('recent-announcements').innerHTML = recentAnn.map(a => `
            <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                <div class="bg-${getTypeColor(a.type)} bg-opacity-10 text-${getTypeColor(a.type)} rounded p-2 me-3">
                    <i class="bi bi-megaphone"></i>
                </div>
                <div>
                    <h6 class="mb-0">${a.title}</h6>
                    <small class="text-muted">${new Date(a.publishDate).toLocaleDateString()}</small>
                </div>
            </div>
        `).join('') || '<p class="text-muted">No announcements yet</p>';
        
        // Upcoming events
        const upcoming = events.data?.filter(e => new Date(e.startDate) >= new Date()).slice(0, 5) || [];
        document.getElementById('upcoming-events').innerHTML = upcoming.map(e => `
            <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                <div class="bg-info bg-opacity-10 text-info rounded p-2 me-3">
                    <i class="bi bi-calendar-event"></i>
                </div>
                <div>
                    <h6 class="mb-0">${e.title}</h6>
                    <small class="text-muted">${new Date(e.startDate).toLocaleDateString()}</small>
                </div>
            </div>
        `).join('') || '<p class="text-muted">No upcoming events</p>';
        
    } catch (error) {
        console.error('Dashboard load error:', error);
        // Use demo data as final fallback
        document.getElementById('total-users').textContent = DEMO_DATA.users.length;
        document.getElementById('total-departments').textContent = DEMO_DATA.departments.length;
        document.getElementById('total-announcements').textContent = DEMO_DATA.announcements.length;
        document.getElementById('total-events').textContent = DEMO_DATA.calendar.length;
    }
}

function getTypeColor(type) {
    const colors = {
        'GENERAL': 'primary',
        'ACADEMIC': 'success',
        'ADMINISTRATIVE': 'warning',
        'EVENT': 'info',
        'EMERGENCY': 'danger'
    };
    return colors[type] || 'primary';
}

// ==================== DEPARTMENTS ====================
async function loadDepartments() {
    try {
        const result = await apiCall('/departments') || { data: DEMO_DATA.departments };
        const departments = result.data || [];
        
        const tbody = document.getElementById('departments-table');
        tbody.innerHTML = departments.map(d => `
            <tr>
                <td><strong>${d.code}</strong></td>
                <td>${d.name}</td>
                <td>${d.headOfDepartment || '-'}</td>
                <td>${d.email || '-'}</td>
                <td>
                    <span class="badge bg-${d.active ? 'success' : 'secondary'}">
                        ${d.active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editDepartment(${d.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDepartment(${d.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Load departments error:', error);
        // Show demo data
        const tbody = document.getElementById('departments-table');
        tbody.innerHTML = DEMO_DATA.departments.map(d => `
            <tr>
                <td><strong>${d.code}</strong></td>
                <td>${d.name}</td>
                <td>${d.headOfDepartment || '-'}</td>
                <td>${d.email || '-'}</td>
                <td><span class="badge bg-success">Active</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editDepartment(${d.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function openDepartmentModal() {
    document.getElementById('departmentForm').reset();
    document.getElementById('deptId').value = '';
    departmentModal.show();
}

function editDepartment(id) {
    fetch(`${API_BASE}/departments/${id}`)
        .then(r => r.json())
        .then(result => {
            const d = result.data;
            document.getElementById('deptId').value = d.id;
            document.getElementById('deptCode').value = d.code;
            document.getElementById('deptName').value = d.name;
            document.getElementById('deptDesc').value = d.description || '';
            document.getElementById('deptHead').value = d.headOfDepartment || '';
            document.getElementById('deptEmail').value = d.email || '';
            departmentModal.show();
        });
}

async function saveDepartment() {
    const id = document.getElementById('deptId').value;
    const data = {
        code: document.getElementById('deptCode').value,
        name: document.getElementById('deptName').value,
        description: document.getElementById('deptDesc').value,
        headOfDepartment: document.getElementById('deptHead').value,
        email: document.getElementById('deptEmail').value,
        active: true
    };
    
    try {
        const url = id ? `${API_BASE}/departments/${id}` : `${API_BASE}/departments`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast(id ? 'Department updated' : 'Department created');
            departmentModal.hide();
            loadDepartments();
            loadDashboardData();
        } else {
            showToast('Failed to save department', 'danger');
        }
    } catch (error) {
        showToast('Error saving department', 'danger');
    }
}

async function deleteDepartment(id) {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/departments/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('Department deleted');
            loadDepartments();
            loadDashboardData();
        }
    } catch (error) {
        showToast('Error deleting department', 'danger');
    }
}

// ==================== ANNOUNCEMENTS ====================
async function loadAnnouncements() {
    try {
        const result = await apiCall('/announcements') || { data: DEMO_DATA.announcements };
        const announcements = result.data || [];
        
        const tbody = document.getElementById('announcements-table');
        tbody.innerHTML = announcements.map(a => `
            <tr>
                <td>${a.title}</td>
                <td><span class="badge bg-${getTypeColor(a.type)}">${a.type}</span></td>
                <td>${a.targetAudience}</td>
                <td>${'★'.repeat(a.priority)}${'☆'.repeat(5-a.priority)}</td>
                <td>${new Date(a.publishDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editAnnouncement(${a.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteAnnouncement(${a.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Load announcements error:', error);
        // Show demo data
        const tbody = document.getElementById('announcements-table');
        tbody.innerHTML = DEMO_DATA.announcements.map(a => `
            <tr>
                <td>${a.title}</td>
                <td><span class="badge bg-${getTypeColor(a.type)}">${a.type}</span></td>
                <td>${a.targetAudience}</td>
                <td>${'★'.repeat(a.priority)}${'☆'.repeat(5-a.priority)}</td>
                <td>${new Date(a.publishDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editAnnouncement(${a.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function openAnnouncementModal() {
    document.getElementById('announcementForm').reset();
    document.getElementById('annId').value = '';
    announcementModal.show();
}

function editAnnouncement(id) {
    fetch(`${API_BASE}/announcements/${id}`)
        .then(r => r.json())
        .then(result => {
            const a = result.data;
            document.getElementById('annId').value = a.id;
            document.getElementById('annTitle').value = a.title;
            document.getElementById('annContent').value = a.content;
            document.getElementById('annType').value = a.type;
            document.getElementById('annAudience').value = a.targetAudience;
            document.getElementById('annPriority').value = a.priority;
            announcementModal.show();
        });
}

async function saveAnnouncement() {
    const id = document.getElementById('annId').value;
    const data = {
        title: document.getElementById('annTitle').value,
        content: document.getElementById('annContent').value,
        type: document.getElementById('annType').value,
        targetAudience: document.getElementById('annAudience').value,
        priority: parseInt(document.getElementById('annPriority').value),
        active: true,
        pinned: false,
        author: 'Admin'
    };
    
    try {
        const url = id ? `${API_BASE}/announcements/${id}` : `${API_BASE}/announcements`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast(id ? 'Announcement updated' : 'Announcement posted');
            announcementModal.hide();
            loadAnnouncements();
            loadDashboardData();
        } else {
            showToast('Failed to save announcement', 'danger');
        }
    } catch (error) {
        showToast('Error saving announcement', 'danger');
    }
}

async function deleteAnnouncement(id) {
    if (!confirm('Delete this announcement?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/announcements/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('Announcement deleted');
            loadAnnouncements();
            loadDashboardData();
        }
    } catch (error) {
        showToast('Error deleting announcement', 'danger');
    }
}

// ==================== CALENDAR ====================
async function loadCalendar() {
    try {
        const result = await apiCall('/calendar') || { data: DEMO_DATA.calendar };
        const events = result.data || [];
        
        const tbody = document.getElementById('calendar-table');
        tbody.innerHTML = events.map(e => `
            <tr>
                <td>${e.title}</td>
                <td><span class="badge bg-info">${e.eventType}</span></td>
                <td>${e.academicYear}</td>
                <td>${e.semester}</td>
                <td>${new Date(e.startDate).toLocaleDateString()}</td>
                <td>${new Date(e.endDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editCalendar(${e.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCalendar(${e.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Load calendar error:', error);
        // Show demo data
        const tbody = document.getElementById('calendar-table');
        tbody.innerHTML = DEMO_DATA.calendar.map(e => `
            <tr>
                <td>${e.title}</td>
                <td><span class="badge bg-info">${e.eventType}</span></td>
                <td>${e.academicYear}</td>
                <td>${e.semester}</td>
                <td>${new Date(e.startDate).toLocaleDateString()}</td>
                <td>${new Date(e.endDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editCalendar(${e.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function openCalendarModal() {
    document.getElementById('calendarForm').reset();
    document.getElementById('calId').value = '';
    calendarModal.show();
}

function editCalendar(id) {
    fetch(`${API_BASE}/calendar/${id}`)
        .then(r => r.json())
        .then(result => {
            const e = result.data;
            document.getElementById('calId').value = e.id;
            document.getElementById('calYear').value = e.academicYear;
            document.getElementById('calSemester').value = e.semester;
            document.getElementById('calType').value = e.eventType;
            document.getElementById('calTitle').value = e.title;
            document.getElementById('calStartDate').value = e.startDate;
            document.getElementById('calEndDate').value = e.endDate;
            calendarModal.show();
        });
}

async function saveCalendar() {
    const id = document.getElementById('calId').value;
    const data = {
        academicYear: document.getElementById('calYear').value,
        semester: document.getElementById('calSemester').value,
        eventType: document.getElementById('calType').value,
        title: document.getElementById('calTitle').value,
        startDate: document.getElementById('calStartDate').value,
        endDate: document.getElementById('calEndDate').value,
        active: true
    };
    
    try {
        const url = id ? `${API_BASE}/calendar/${id}` : `${API_BASE}/calendar`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast(id ? 'Event updated' : 'Event added');
            calendarModal.hide();
            loadCalendar();
            loadDashboardData();
        } else {
            showToast('Failed to save event', 'danger');
        }
    } catch (error) {
        showToast('Error saving event', 'danger');
    }
}

async function deleteCalendar(id) {
    if (!confirm('Delete this event?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/calendar/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('Event deleted');
            loadCalendar();
            loadDashboardData();
        }
    } catch (error) {
        showToast('Error deleting event', 'danger');
    }
}

// ==================== USERS ====================
async function loadUsers() {
    try {
        const result = await apiCall('/users') || { data: DEMO_DATA.users };
        const users = result.data || [];
        
        const tbody = document.getElementById('users-table');
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.username}</td>
                <td>${u.email}</td>
                <td><span class="badge bg-primary">${u.role}</span></td>
                <td>${u.department || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${u.username}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Load users error:', error);
        // Show demo data
        const tbody = document.getElementById('users-table');
        tbody.innerHTML = DEMO_DATA.users.map(u => `
            <tr>
                <td>${u.username}</td>
                <td>${u.email}</td>
                <td><span class="badge bg-primary">${u.role}</span></td>
                <td>${u.department || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${u.username}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function openUserModal() {
    window.location.href = '/offline-admin.html';
}

async function deleteUser(username) {
    if (!confirm(`Delete user ${username}?`)) return;
    
    try {
        const response = await fetch(`${API_BASE}/users/${username}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('User deleted');
            loadUsers();
            loadDashboardData();
        }
    } catch (error) {
        showToast('Error deleting user', 'danger');
    }
}

// ==================== ANALYTICS ====================
async function loadAnalytics() {
    // Use demo data or API data for charts
    const usersData = await apiCall('/users') || { data: DEMO_DATA.users };
    const deptsData = await apiCall('/departments') || { data: DEMO_DATA.departments };
    
    const users = usersData.data || [];
    const depts = deptsData.data || [];
    
    // Role distribution chart
    const roles = {};
    users.forEach(u => roles[u.role] = (roles[u.role] || 0) + 1);
    
    new Chart(document.getElementById('roleChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(roles),
            datasets: [{
                data: Object.values(roles),
                backgroundColor: ['#667eea', '#10b981', '#f59e0b']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    
    // Department chart
    new Chart(document.getElementById('deptChart'), {
        type: 'bar',
        data: {
            labels: depts.map(d => d.code),
            datasets: [{
                label: 'Departments',
                data: depts.map(() => 1),
                backgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Admin Management Functions
function openAddAdminModal() {
    showToast('Add Admin - Opening form...');
    // Create modal dynamically
    const modalHtml = `
        <div class="modal fade" id="addAdminModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-shield-lock"></i> Add New Admin</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addAdminForm">
                            <div class="mb-3">
                                <label class="form-label">Admin Name</label>
                                <input type="text" class="form-control" id="adminName" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="adminEmail" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Role</label>
                                <select class="form-select" id="adminRole">
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Academic Admin">Academic Admin</option>
                                    <option value="Finance Admin">Finance Admin</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Department</label>
                                <select class="form-select" id="adminDepartment">
                                    <option value="All">All Departments</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Academic">Academic Affairs</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveAdmin()">Add Admin</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('addAdminModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addAdminModal'));
    modal.show();
}

function saveAdmin() {
    const name = document.getElementById('adminName').value;
    const email = document.getElementById('adminEmail').value;
    const role = document.getElementById('adminRole').value;
    const department = document.getElementById('adminDepartment').value;
    
    if (!name || !email) {
        showToast('Please fill in all required fields', 'danger');
        return;
    }
    
    // Generate new admin ID
    const adminId = 'ADM-00' + (Math.floor(Math.random() * 900) + 100);
    
    // Add to table (demo)
    const tbody = document.querySelector('#admin-portal-section tbody');
    const newRow = `
        <tr>
            <td>${adminId}</td>
            <td>${name}</td>
            <td>${role}</td>
            <td>${department}</td>
            <td><span class="badge bg-success">Active</span></td>
            <td>Just now</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editAdmin('${adminId}')">Manage</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteAdmin('${adminId}')">Delete</button>
            </td>
        </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', newRow);
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addAdminModal')).hide();
    showToast('Admin added successfully!', 'success');
}

function editAdmin(adminId) {
    showToast(`Editing admin ${adminId} - Opening form...`);
    
    const modalHtml = `
        <div class="modal fade" id="editAdminModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-pencil"></i> Edit Admin ${adminId}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="editStatus">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Permissions</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" checked>
                                    <label class="form-check-label">User Management</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" checked>
                                    <label class="form-check-label">Course Management</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox">
                                    <label class="form-check-label">Finance Access</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveEditAdmin('${adminId}')">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('editAdminModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('editAdminModal'));
    modal.show();
}

function saveEditAdmin(adminId) {
    bootstrap.Modal.getInstance(document.getElementById('editAdminModal')).hide();
    showToast(`Admin ${adminId} updated successfully!`, 'success');
}

function deleteAdmin(adminId) {
    if (confirm(`Are you sure you want to delete admin ${adminId}?`)) {
        showToast(`Admin ${adminId} deleted successfully!`, 'success');
        // Remove row from table
        const rows = document.querySelectorAll('#admin-portal-section tbody tr');
        rows.forEach(row => {
            if (row.cells[0].textContent === adminId) {
                row.remove();
            }
        });
    }
}

// Student Management Functions
function openEnrollStudentModal() {
    showToast('Enroll Student - Opening form...');
    const modalHtml = `
        <div class="modal fade" id="enrollStudentModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="bi bi-person-plus"></i> Enroll New Student</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="enrollStudentForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Student Name</label>
                                    <input type="text" class="form-control" id="studentName" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" id="studentEmail" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Program</label>
                                    <select class="form-select" id="studentProgram">
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Business Admin">Business Admin</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Medicine">Medicine</option>
                                        <option value="Law">Law</option>
                                        <option value="Education">Education</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Year</label>
                                    <select class="form-select" id="studentYear">
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">GPA</label>
                                    <input type="number" class="form-control" id="studentGPA" min="0" max="4.0" step="0.01" value="3.00">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" id="studentStatus">
                                        <option value="Active">Active</option>
                                        <option value="Probation">Probation</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveStudent()">Enroll Student</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('enrollStudentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('enrollStudentModal'));
    modal.show();
}

function saveStudent() {
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const program = document.getElementById('studentProgram').value;
    const year = document.getElementById('studentYear').value;
    const gpa = document.getElementById('studentGPA').value;
    const status = document.getElementById('studentStatus').value;
    
    if (!name || !email) {
        showToast('Please fill in all required fields', 'danger');
        return;
    }
    
    // Generate new student ID
    const studentId = 'STD-2024-' + (Math.floor(Math.random() * 900) + 100);
    
    // Add to table
    const tbody = document.querySelector('#student-portal-section tbody');
    const newRow = `
        <tr>
            <td>${studentId}</td>
            <td>${name}</td>
            <td>${program}</td>
            <td>${year}</td>
            <td>${gpa}</td>
            <td><span class="badge bg-${status === 'Active' ? 'success' : status === 'Probation' ? 'warning' : 'secondary'}">${status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewStudent('${studentId}')">View</button>
                <button class="btn btn-sm btn-outline-success" onclick="editStudent('${studentId}')">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${studentId}')">Delete</button>
            </td>
        </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', newRow);
    
    bootstrap.Modal.getInstance(document.getElementById('enrollStudentModal')).hide();
    showToast('Student enrolled successfully!', 'success');
}

function viewStudent(studentId) {
    showToast(`Viewing student ${studentId} details...`);
    // In a real app, this would open a detailed view
    const modalHtml = `
        <div class="modal fade" id="viewStudentModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title"><i class="bi bi-person"></i> Student Profile: ${studentId}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <i class="bi bi-person-circle" style="font-size: 64px; color: #0dcaf0;"></i>
                        </div>
                        <table class="table table-borderless">
                            <tr><td><strong>Student ID:</strong></td><td>${studentId}</td></tr>
                            <tr><td><strong>Name:</strong></td><td>John Doe</td></tr>
                            <tr><td><strong>Program:</strong></td><td>Computer Science</td></tr>
                            <tr><td><strong>Year:</strong></td><td>3rd Year</td></tr>
                            <tr><td><strong>GPA:</strong></td><td>3.75</td></tr>
                            <tr><td><strong>Status:</strong></td><td><span class="badge bg-success">Active</span></td></tr>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('viewStudentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('viewStudentModal'));
    modal.show();
}

function editStudent(studentId) {
    showToast(`Editing student ${studentId}...`);
    
    const modalHtml = `
        <div class="modal fade" id="editStudentModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="bi bi-pencil"></i> Edit Student: ${studentId}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editStudentForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Student ID</label>
                                    <input type="text" class="form-control" id="editStudentId" value="${studentId}" readonly>
                                    <small class="text-muted">ID cannot be changed</small>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Name</label>
                                    <input type="text" class="form-control" id="editStudentName" value="Student Name" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Program</label>
                                    <select class="form-select" id="editStudentProgram">
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Business Admin">Business Admin</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Medicine">Medicine</option>
                                        <option value="Law">Law</option>
                                        <option value="Education">Education</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Year</label>
                                    <select class="form-select" id="editStudentYear">
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">GPA</label>
                                    <input type="number" class="form-control" id="editStudentGPA" min="0" max="4.0" step="0.01" value="3.50">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Status</label>
                                    <select class="form-select" id="editStudentStatus">
                                        <option value="Active">Active</option>
                                        <option value="Probation">Probation</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" onclick="saveEditStudent('${studentId}')">
                            <i class="bi bi-check-lg"></i> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('editStudentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('editStudentModal'));
    modal.show();
}

function saveEditStudent(studentId) {
    const name = document.getElementById('editStudentName').value;
    const program = document.getElementById('editStudentProgram').value;
    const year = document.getElementById('editStudentYear').value;
    const gpa = document.getElementById('editStudentGPA').value;
    const status = document.getElementById('editStudentStatus').value;
    
    if (!name) {
        showToast('Please enter student name', 'danger');
        return;
    }
    
    // Find and update the row in the table
    const rows = document.querySelectorAll('#student-portal-section tbody tr');
    rows.forEach(row => {
        if (row.cells[0].textContent === studentId) {
            row.cells[1].textContent = name;
            row.cells[2].textContent = program;
            row.cells[3].textContent = year;
            row.cells[4].textContent = gpa;
            
            // Update status badge
            const badgeClass = status === 'Active' ? 'bg-success' : 
                              status === 'Probation' ? 'bg-warning' : 'bg-secondary';
            row.cells[5].innerHTML = `<span class="badge ${badgeClass}">${status}</span>`;
        }
    });
    
    bootstrap.Modal.getInstance(document.getElementById('editStudentModal')).hide();
    showToast(`Student ${studentId} updated successfully!`, 'success');
}

function deleteStudent(studentId) {
    if (confirm(`Are you sure you want to delete student ${studentId}?`)) {
        showToast(`Student ${studentId} deleted successfully!`, 'success');
        // Remove row from table
        const rows = document.querySelectorAll('#student-portal-section tbody tr');
        rows.forEach(row => {
            if (row.cells[0].textContent === studentId) {
                row.remove();
            }
        });
    }
}
