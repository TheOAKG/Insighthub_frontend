
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://your-actual-web-service-name.onrender.com'; 

function updateNavigation() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authLink = document.querySelector('a[href="auth.html"]');
    
    if (user && authLink) {
        authLink.innerText = `Logout (${user.username})`;
    } else if (authLink) {
        authLink.innerText = "Login / Register";
    }
}

function loadProjects() {

    fetch(`${API_BASE_URL}/api/projects`)
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('project-list');
        if (!container) return;
        container.innerHTML = '';

        data.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';

            card.innerHTML = `
            <h3>${project.title}</h3>
            <p><strong>Student:</strong> ${project.username || 'Anonymous'}</p>
            <p><strong>Dept:</strong> ${project.department}</p>
            <p style="font-size: 14px; color: #555;"> ${project.abstract.substring(0, 100)}...</p>
            <div style="margin-top: 15px;">
                <a href="details.html?id=${project.id}" target="_blank" style="color: #ff4500; font-weight: bold; text-decoration: none;">View Full Details</a>
            </div>
          `;
          container.appendChild(card);
        });
    })
    .catch(error => {
        console.log("Error fetching projects:", error);
    });
}


const regForm = document.getElementById('register-form');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userData = {
            username: document.getElementById('reg-username').value,
            email: document.getElementById('reg-email').value, 
            password: document.getElementById('reg-password').value,
            department: document.getElementById('reg-dept').value
        };

  
        fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert("Account created successfully! Please login.");
                window.location.href = 'auth.html';
            }
        })
        .catch(err => console.log("Error during registration:", err));
    });
}


const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginData = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        };

  
        fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.userId) {
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'index.html';
            } else {
                alert("Invalid email or password");
            }
        })
        .catch(err => console.log("Error during login:", err));
    });
}


const subform = document.getElementById('submission-form');
if (subform) {
    subform.addEventListener('submit', (e) => {
        e.preventDefault();
        const loggedInUser = JSON.parse(localStorage.getItem('user'));

        if (!loggedInUser) {
            alert("Please login first to submit a project.");
            window.location.href = 'auth.html';
            return;
        }

        const projectData = {
            user_id: loggedInUser.userId,
            title: document.getElementById('proj-title').value,
            abstract: document.getElementById('proj-abstract').value,
            department: document.getElementById('proj-dept').value,
            supervisor: document.getElementById('proj-supervisor').value,
            year: document.getElementById('proj-year').value,
            file_url: document.getElementById('proj-file').value,
            demo_link: document.getElementById('proj-demo').value
        };


        fetch(`${API_BASE_URL}/api/projects`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        })
        .then(res => res.json())
        .then(data => {
            alert("Project submitted successfully");
            window.location.href = 'index.html';
        })
        .catch(err => console.log("Error submitting project:", err));
    });
}


const logoutLink = document.querySelector('a[href="auth.html"]');
if (logoutLink && localStorage.getItem('user')) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        alert("You have been logged out.");
        window.location.reload();
    });
}


updateNavigation();
if (document.getElementById('project-list')) {
    loadProjects();
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
   
    if (document.getElementById('project-list')) {
        console.log("Found project-list, calling loadProjects...");
        loadProjects();
    }

 
    updateNavigation();
});