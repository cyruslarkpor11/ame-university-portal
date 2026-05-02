// Student Dashboard JavaScript
// Handles API calls and dynamic functionality for student portal

const API_BASE = '/api';

// Demo data for student dashboard
const STUDENT_DEMO_DATA = {
    courses: [
        { id: 1, code: 'CS101', name: 'Introduction to Programming', grade: 'A', progress: 75 },
        { id: 2, code: 'MATH201', name: 'Calculus II', grade: 'B+', progress: 60 },
        { id: 3, code: 'ENG105', name: 'English Composition', grade: 'A-', progress: 80 },
        { id: 4, code: 'PHY101', name: 'Physics I', grade: 'B', progress: 65 },
        { id: 5, code: 'HIS102', name: 'World History', grade: 'A', progress: 70 }
    ],
    gpa: 3.75,
    attendance: 87,
    pendingAssignments: 3
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
        return { success: true, data: STUDENT_DEMO_DATA };
    }
}

// Toast notification
function showToast(message, type = 'primary') {
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

// Initialize student dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Student Dashboard loaded on: ' + window.location.href);
    
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
