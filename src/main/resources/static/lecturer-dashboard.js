// Lecturer Dashboard JavaScript
// Handles API calls and dynamic functionality for lecturer portal

const API_BASE = '/api';

// Demo data for lecturer dashboard
const LECTURER_DEMO_DATA = {
    courses: [
        { id: 1, code: 'CS101', name: 'Introduction to Programming', students: 45, progress: 75 },
        { id: 2, code: 'CS202', name: 'Data Structures', students: 38, progress: 60 },
        { id: 3, code: 'CS305', name: 'Algorithms', students: 32, progress: 45 },
        { id: 4, code: 'CS401', name: 'Software Engineering', students: 28, progress: 30 }
    ],
    students: 156,
    pendingAssignments: 12,
    weeklyHours: 24
};

// API call helper with demo fallback
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(API_BASE + endpoint, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.log('API call failed, using demo data:', error);
        return { success: true, data: LECTURER_DEMO_DATA };
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    document.querySelector('.toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Initialize lecturer dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lecturer Dashboard loaded on: ' + window.location.href);
    
    // Set current date
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
    }
    
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
});

// Show section
function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('d-none'));
    const sectionElement = document.getElementById(section + '-section');
    if (sectionElement) {
        sectionElement.classList.remove('d-none');
    }
    
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' ');
    }
}
