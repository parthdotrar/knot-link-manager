
const urlParams = new URLSearchParams(window.location.search);

const params = new URLSearchParams(window.location.search);
const username = params.get('username');

const API_BASE_URL = '/api'; 

async function loadPublicProfile() {
    if (!username) {
        document.body.innerHTML = '<h1>Profile not found</h1><p>Please provide a username.</p>';
        return;
    }

    try {
        
        const response = await fetch(`${API_BASE_URL}/links/public/${username}`);

        if (!response.ok) {
            if (response.status === 404) {
                document.body.innerHTML = '<h1>Profile not found</h1>';
                return;
            }
            throw new Error('Failed to load profile');
        }

        const data = await response.json();
        renderProfile(data.data || [], data.user || {});
    } catch (error) {
        console.error('Error loading public profile:', error);
        document.body.innerHTML = '<h1>Error loading profile</h1><p>Please try again later.</p>';
    }
}

function renderProfile(links, userData) {
    
    document.getElementById('profileImage').src = userData.profileImage || 'https://api.dicebear.com/7.x/initials/svg?seed=' + userData.name;
    document.getElementById('profileName').textContent = userData.name || 'Anonymous';
    document.getElementById('profileHandle').textContent = '@' + userData.username;
    document.getElementById('profileBio').textContent = userData.bio || 'Check out my links below 👇';

    const linksContainer = document.getElementById('linksContainer');
    linksContainer.innerHTML = '';

    if (links.length === 0) {
        linksContainer.innerHTML = '<p>No links to show.</p>';
        return;
    }

    links.forEach((link, index) => {
        const linkButton = document.createElement('a');
        linkButton.href = link.url;
        linkButton.target = '_blank';
        linkButton.className = 'public-link-btn fade-in';
        
        setTimeout(() => {
            linkButton.classList.add('visible');
        }, index * 100);
        linkButton.innerHTML = `
            <span class="public-link-icon">${link.icon}</span>
            <span class="public-link-text">${link.title}</span>
        `;
        linksContainer.appendChild(linkButton);
    });
}

loadPublicProfile();