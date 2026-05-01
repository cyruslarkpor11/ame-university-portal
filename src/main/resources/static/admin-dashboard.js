// API Base URL
const API_BASE = '/api';

// Modals
let departmentModal, announcementModal, calendarModal;

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

// ==================== DASHBOARD ====================
async function loadDashboardData() {
    try {
        // Load counts
        const [users, departments, announcements, events] = await Promise.all([
            fetch(`${API_BASE}/users`).then(r => r.json()).catch(() => ({ data: [] })),
            fetch(`${API_BASE}/departments`).then(r => r.json()).catch(() => ({ data: [] })),
            fetch(`${API_BASE}/announcements`).then(r => r.json()).catch(() => ({ data: [] })),
            fetch(`${API_BASE}/calendar`).then(r => r.json()).catch(() => ({ data: [] }))
        ]);
        
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
        const response = await fetch(`${API_BASE}/departments`);
        const result = await response.json();
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
        showToast('Failed to load departments', 'danger');
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
        const response = await fetch(`${API_BASE}/announcements`);
        const result = await response.json();
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
        const response = await fetch(`${API_BASE}/calendar`);
        const result = await response.json();
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
        const response = await fetch(`${API_BASE}/users`);
        const result = await response.json();
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
function loadAnalytics() {
    // Role distribution chart
    fetch(`${API_BASE}/users`)
        .then(r => r.json())
        .then(result => {
            const users = result.data || [];
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
        });
    
    // Department chart
    fetch(`${API_BASE}/departments`)
        .then(r => r.json())
        .then(result => {
            const depts = result.data || [];
            
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
        });
}
