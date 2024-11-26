/*
async function fetchCurrentSong() {
    try {
        const response = await fetch('./php/current-song.php');
        const data = await response.json();
        const songInfoDiv = document.getElementById('song-info');

        if (data.song !== 'No song is currently playing') {
            songInfoDiv.innerHTML = `
            <div id="song-information">
                <p>${data.song}</p>
                <p>by ${data.artist}</p>
                <p>Album: ${data.album}</p>
            </div>
            <div>
                <img src="${data.albumArt}" alt="Album Art" id="album-cover">
            </div>
            `;

            const songEvent = new CustomEvent('songChange', {
                detail: {
                    song: data.song,
                    artist: data.artist,
                    album: data.album,
                    albumArt: data.albumArt
                }
            });

            document.dispatchEvent(songEvent);
        } else {
            songInfoDiv.innerHTML = `<p>${data.song}</p>`;
        }
    } catch (error) {
        console.error('Error fetching the current song:', error);
    }
}

// Fetch the current song immediately and then every 30 seconds
fetchCurrentSong();
setInterval(fetchCurrentSong, 30000);
*/