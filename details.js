const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://your-render-backend-url.onrender.com';

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');


function fetchProjectDetails() {
    fetch(`${API_BASE_URL}/api/projects/${projectId}`)
        .then(res => res.json())
        .then(data => {
            const { project, comments } = data;
            
            document.getElementById('detail-title').innerText = project.title;
            document.getElementById('detail-author').innerText = project.username;
            document.getElementById('detail-dept').innerText = project.department;
            document.getElementById('detail-year').innerText = project.completion_year;
            document.getElementById('detail-supervisor').innerText = project.supervisor;
            document.getElementById('detail-abstract').innerText = project.abstract;
            
            document.getElementById('detail-file').href = project.file_url;
            if (project.demo_link) {
                document.getElementById('detail-demo').href = project.demo_link;
            } else {
                document.getElementById('detail-demo').style.display = 'none';
            }


            const list = document.getElementById('comment-list');
            list.innerHTML = comments.map(c => `
                <li class="comment-item">
                    <strong>${c.username}:</strong> ${c.comment_text}
                </li>
            `).join('');
        })
        .catch(err => console.error("Error:", err));
}


const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        alert("You must be logged in to comment.");
        return;
    }

    const payload = {
        project_id: projectId,
        user_id: user.userId,
        comment_text: document.getElementById('comment-input').value
    };

    fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(() => {
        document.getElementById('comment-input').value = '';
        fetchProjectDetails(); 
    });
});


document.getElementById('bookmark-btn').addEventListener('click', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return alert("Login to bookmark!");

    fetch(`${API_BASE_URL}/api/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.userId, project_id: projectId })
    }).then(() => alert("Project Bookmarked!"));
});


if (projectId) {
    fetchProjectDetails();
}