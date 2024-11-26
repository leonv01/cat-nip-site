const container = document.getElementById('albums-container');
const loadingMessage = document.createElement('div');
loadingMessage.innerText = 'Loading...';
loadingMessage.classList.add('loading-message');
container.appendChild(loadingMessage);

let albumCovers = {};

function getAlbumCover() {
    loadingMessage.style.display = 'block';

    fetch(`./php/fetch-album-covers.php`)
    .then(response => response.json())
    .then(data => { 
        albumCovers = data.cover_urls;

        container.innerHTML = ''; 

        Object.keys(albumCovers).forEach(albumId => {
            const album = document.createElement('img');
            album.src = albumCovers[albumId];
            album.alt = 'Album cover';
            album.classList.add('album-cover');
            album.addEventListener('click', () => {
                window.open(`https://open.spotify.com/intl-de/album/${albumId}`, '_blank');
            });
            album.loading = 'lazy';
            container.appendChild(album);
        });
    })
    .catch(error => {
        console.error("Error fetching album cover:", error);    
        loadingMessage.innerText = 'Failed to load album covers. Please try again.';
    })
    .finally(() => {
        loadingMessage.style.display = 'none';
    });
}

getAlbumCover();
