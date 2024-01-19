const itemsPerPage = 10;
let currentPage = 1;


function fetchData() {
    const username = document.getElementById('username').value;
    const keyword = document.getElementById('searchInput').value;

    // Clear previous user profile and repositories list
    document.getElementById('userProfile').innerHTML = '';
    document.getElementById('reposList').innerHTML = '';
    document.getElementById('pagination').innerHTML = '';

    // Fetch GitHub user information using GitHub API
    const userApiUrl = `https://api.github.com/users/${username}`;
    fetch(userApiUrl)
        .then(response => response.json())
        .then(user => {
            // Display user profile
            document.getElementById('userProfile').innerHTML = `
                <img src="${user.avatar_url}" alt="Profile Photo">
                <h2>${user.name || user.login}</h2>
                <h6>${user.bio || 'No bio available'}</h6>
                ${renderBioLinks(user.bio)}
               
                
              <p>   <a href="${user.html_url}">${user.url}</a> </p>
             <h6>   <b>Twitter:-</b><a href="https://twitter.com/${user.twitter_username}" target="blank" >https://twitter.com/${user.twitter_username}</a> </h6>
                 <h6>Followers: ${user.followers || 0} | Following: ${user.following || 0}</h6>
                 `;

            // Fetch GitHub repositories using GitHub API
            const reposApiUrl = `https://api.github.com/users/${username}/repos`;
            fetch(reposApiUrl)
                .then(response => response.json())
                .then(repos => {
                    const filteredRepos = keyword
                        ? repos.filter(repo => repo.name.toLowerCase().includes(keyword.toLowerCase()))
                        : repos;

                     // Paginate and display repositories
                     const startIndex = (currentPage - 1) * itemsPerPage;
                     const endIndex = startIndex + itemsPerPage;
                     const paginatedRepos = filteredRepos.slice(startIndex, endIndex);

                     paginatedRepos.forEach(repo => {
                         const repoItem = document.createElement('li');
                         repoItem.className = 'repoItem';
                         repoItem.innerHTML = `
                         <h3>  <a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                             <p>${repo.description || 'No description available'}</p>
                             <p><span class="techUsed">Tech Used:</span> ${repo.language || 'Not specified'}</p>
                           
                         `;
                         document.getElementById('reposList').appendChild(repoItem);
                     });

                    // Display pagination
                    renderPagination(filteredRepos.length);
                })
                
                .catch(error => {
                    console.error('Error fetching repositories:', error);
                    alert('Error fetching repositories. Please check the username and try again.');
                });
        })
        .catch(error => {
            console.error('Error fetching user information:', error);
            alert('Error fetching user information. Please check the username and try again.');
        });
}

function renderBioLinks(bio) {
    // Parse bio text to find and render links
    const regex = /https?:\/\/[^\s)]+/g;
    const links = bio.match(regex);

    if (links && links.length > 0) {
        return `
            <p>Links:</p>
            <ul>
                ${links.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('')}
            </ul>
        `;
    }

    return '';
}


function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages > 1) {
        const paginationDiv = document.getElementById('pagination');

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.className = 'pageLink';
            pageLink.textContent = i;
            pageLink.addEventListener('click', () => {
                currentPage = i;
                fetchData();
            });

            paginationDiv.appendChild(pageLink);
        }
    }
}
