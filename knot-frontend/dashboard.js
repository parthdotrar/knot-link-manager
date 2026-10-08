
const firebaseConfig = {
  apiKey: "AIzaSyAafEN7GjVb19cmGKPZoTVz5vTD_CMico0",
  authDomain: "knot-244e9.firebaseapp.com",
  projectId: "knot-244e9",
  storageBucket: "knot-244e9.firebasestorage.app",
  messagingSenderId: "791319636554",
  appId: "1:791319636554:web:25ea6dd935a014c65dd4b3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const linkForm = document.getElementById('linkForm');
const linkTitleInput = document.getElementById('linkTitle');
const linkUrlInput = document.getElementById('linkUrl');
const linkIconInput = document.getElementById('linkIcon');
const linksList = document.getElementById('linksList');
const logoutBtn = document.getElementById('logoutBtn');

const API_BASE_URL = '/api';

const toggleBtn = document.getElementById('toggleLinkFormBtn');
const formContainer = document.getElementById('linkFormContainer');

if (toggleBtn && formContainer) {
    toggleBtn.addEventListener('click', () => {
        formContainer.classList.toggle('form-visible');
        if (formContainer.classList.contains('form-visible')) {
            toggleBtn.textContent = '- Cancel';
        } else {
            toggleBtn.textContent = '+ Add Link';
        }
    });
}

auth.onAuthStateChanged(async (user) => {
    if (user) {
        
        console.log('User signed in:', user.uid);
        
        // GUARANTEE the user is synced in MongoDB before doing anything else
        try {
            const token = await user.getIdToken();
            await fetch(API_BASE_URL + '/auth/sync', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) {
            console.error("Failed to sync user on dashboard load", e);
        }

        await loadUserProfile();
        await loadLinks();
    } else {
        
        window.location.href = 'login.html'; 
    }
});

async function loadUserProfile() {
    try {
        const user = auth.currentUser;

        document.getElementById('profileName').textContent = user.displayName || 'User';
        document.getElementById('profileBio').textContent = user.email || '';
        if (user.photoURL) {
            document.getElementById('profileImage').src = user.photoURL;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadLinks() {
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(`${API_BASE_URL}/links`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch links');

        const data = await response.json();

        if (data.user && data.user.username) {
            const publicUrl = `public.html?username=${data.user.username}`;
            document.querySelectorAll('#viewPublicPageNav').forEach(el => {
                el.href = publicUrl;
            });
        }

        displayLinks(data.data || []);
    } catch (error) {
        console.error('Error loading links:', error);
        linksList.innerHTML = '<p>Error loading links. Please try again.</p>';
    }
}

function displayLinks(links) {
    linksList.innerHTML = '';

    if (links.length === 0) {
        linksList.innerHTML = '<p>No links yet. Add your first link above!</p>';
        return;
    }

    links.forEach((link, index) => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item fade-in';
        setTimeout(() => linkItem.classList.add('visible'), index * 50); 

        linkItem.innerHTML = `
            <div class="link-content">
                <span class="link-icon">${link.icon}</span>
                <div class="link-details">
                    <span class="link-title">${link.title}</span>
                    <span class="link-url">${link.url}</span>
                </div>
            </div>
            <div class="link-actions">
                <button class="btn btn-outline btn-sm" onclick="editLink('${link._id}')">Edit</button>
                <button class="btn btn-secondary btn-sm delete-link-btn" onclick="deleteLink('${link._id}')">Delete</button>
            </div>
        `;
        linksList.appendChild(linkItem);
    });
}

linkForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = linkTitleInput.value.trim();
    const url = linkUrlInput.value.trim();
    const icon = linkIconInput.value.trim() || '🔗';

    if (!title || !url) {
        alert('Please fill in title and URL');
        return;
    }

    try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(`${API_BASE_URL}/links`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, url, icon })
        });

        if (!response.ok) throw new Error('Failed to add link');

        linkForm.reset();
        linkIconInput.value = '🔗';

        await loadLinks();
    } catch (error) {
        console.error('Error adding link:', error);
        alert('Failed to add link. Please try again.');
    }
});

async function editLink(id) {
    
    const newTitle = prompt('Enter new title for this link:');
    if (!newTitle) return; 
    
    const newUrl = prompt('Enter new URL (must include https://):');
    if (!newUrl) return; 

    try {
        
        const token = await auth.currentUser.getIdToken();

        const response = await fetch(`${API_BASE_URL}/links/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                title: newTitle, 
                url: newUrl 
            }) 
        });

        if (!response.ok) throw new Error('Failed to update link');

        await loadLinks();
        
    } catch (error) {
        console.error('Error updating link:', error);
        alert('Failed to update link. Please try again.');
    }
}

async function deleteLink(id) {
    
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
        
        const token = await auth.currentUser.getIdToken();

        const response = await fetch(`${API_BASE_URL}/links/${id}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) throw new Error('Failed to delete link');

        await loadLinks();
        
    } catch (error) {
        console.error('Error deleting link:', error);
        alert('Failed to delete link. Please try again.');
    }
}

logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
});