let currentAudio = null;
let isShuffleMode = false;

// Dark mode toggle
const darkModeBtn = document.getElementById('darkModeBtn');
darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = darkModeBtn.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Shuffle functionality
const shuffleBtn = document.getElementById('shuffleBtn');
shuffleBtn.addEventListener('click', () => {
    isShuffleMode = !isShuffleMode;
    shuffleBtn.style.background = isShuffleMode ? '#ff79b0' : '#ff4081';
});

// Create audio visualizer
function createVisualizer(container) {
    const bars = 20;
    for (let i = 0; i < bars; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        container.appendChild(bar);
    }
}

// Update visualizer
function updateVisualizer(container, audio) {
    if (!audio.paused) {
        const bars = container.children;
        for (let i = 0; i < bars.length; i++) {
            const height = Math.random() * 30 + 10;
            bars[i].style.height = `${height}px`;
        }
    }
}

// Format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Create song card
function createSongCard(result) {
    const article = document.createElement('div');
    article.className = 'song-card';

    const img = document.createElement('img');
    img.src = result.artworkUrl100.replace('100x100', '300x300');
    img.className = 'song-image';

    const info = document.createElement('div');
    info.className = 'song-info';

    const artist = document.createElement('p');
    artist.className = 'artist-name';
    artist.textContent = result.artistName;

    const song = document.createElement('h3');
    song.className = 'song-title';
    song.textContent = result.trackName;

    const audio = document.createElement('audio');
    audio.src = result.previewUrl;

    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'time-display';
    const currentTime = document.createElement('span');
    currentTime.textContent = '0:00';
    const duration = document.createElement('span');
    duration.textContent = '0:30';

    const controls = document.createElement('div');
    controls.className = 'audio-controls';

    const playBtn = document.createElement('button');
    playBtn.innerHTML = '<i class="fas fa-play"></i>';

    const volumeControl = document.createElement('div');
    volumeControl.className = 'volume-control';
    const volumeIcon = document.createElement('i');
    volumeIcon.className = 'fas fa-volume-up';
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.className = 'volume-slider';
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.1;
    volumeSlider.value = 1;

    const visualizerContainer = document.createElement('div');
    visualizerContainer.className = 'visualizer-container';
    createVisualizer(visualizerContainer);

    // Event listeners
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            audio.play();
            currentAudio = audio;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
        volumeIcon.className = `fas fa-volume-${audio.volume === 0 ? 'mute' : audio.volume < 0.5 ? 'down' : 'up'}`;
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTime.textContent = formatTime(audio.currentTime);
        updateVisualizer(visualizerContainer, audio);
    });

    audio.addEventListener('ended', () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.style.width = '0%';
        currentTime.textContent = '0:00';

        if (isShuffleMode) {
            const songs = document.querySelectorAll('.song-card');
            const randomIndex = Math.floor(Math.random() * songs.length);
            const nextSong = songs[randomIndex].querySelector('audio');
            const nextPlayBtn = songs[randomIndex].querySelector('button');
            nextSong.play();
            nextPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            currentAudio = nextSong;
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const clickPosition = (e.offsetX / progressContainer.offsetWidth);
        audio.currentTime = clickPosition * audio.duration;
    });

    // Append elements
    progressContainer.appendChild(progressBar);
    timeDisplay.appendChild(currentTime);
    timeDisplay.appendChild(duration);
    volumeControl.appendChild(volumeIcon);
    volumeControl.appendChild(volumeSlider);

    controls.appendChild(playBtn);
    controls.appendChild(volumeControl);

    info.appendChild(artist);
    info.appendChild(song);
    info.appendChild(progressContainer);
    info.appendChild(timeDisplay);

    article.appendChild(img);
    article.appendChild(info);
    article.appendChild(controls);
    article.appendChild(visualizerContainer);

    return article;
}

// Search and display songs
const updateTerm = () => {
    const term = document.getElementById('searchTerm').value;
    if (!term || term === '') {
        alert('Please enter a search term');
        return;
    }

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&limit=50`;
    const songContainer = document.getElementById('songs');
    songContainer.innerHTML = '<div class="loading">Searching for songs...</div>';

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            songContainer.innerHTML = '';
            if (data.results.length === 0) {
                songContainer.innerHTML = '<div class="no-results">No songs found. Try a different search term.</div>';
                return;
            }

            data.results.forEach(result => {
                if (result.previewUrl) {
                    const songCard = createSongCard(result);
                    songContainer.appendChild(songCard);
                }
            });
        })
        .catch(error => {
            console.error('Request failed:', error);
            songContainer.innerHTML = '<div class="error">An error occurred while searching. Please try again.</div>';
        });
};

// Audio mode controls
const setVolume = (volume) => {
    const audioElements = document.getElementsByTagName('audio');
    Array.from(audioElements).forEach(audio => {
        audio.volume = volume;
        const volumeSlider = audio.parentElement.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.value = volume;
        }
        const volumeIcon = audio.parentElement.querySelector('.fa-volume-up, .fa-volume-down, .fa-volume-mute');
        if (volumeIcon) {
            volumeIcon.className = `fas fa-volume-${volume === 0 ? 'mute' : volume < 0.5 ? 'down' : 'up'}`;
        }
    });
};

// Event listeners
document.getElementById('searchTermBtn').addEventListener('click', updateTerm);
document.getElementById('searchTerm').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        updateTerm();
    }
});

document.getElementById('stereoModeBtn').addEventListener('click', () => {
    setVolume(1.0);
    document.getElementById('stereoModeBtn').style.background = '#ff4081';
    document.getElementById('ambientModeBtn').style.background = '#ff4081';
});

document.getElementById('ambientModeBtn').addEventListener('click', () => {
    setVolume(0.2);
    document.getElementById('ambientModeBtn').style.background = '#ff79b0';
    document.getElementById('stereoModeBtn').style.background = '#ff4081';
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && currentAudio) {
        e.preventDefault();
        if (currentAudio.paused) {
            currentAudio.play();
        } else {
            currentAudio.pause();
        }
        const playBtn = currentAudio.parentElement.querySelector('button');
        playBtn.innerHTML = `<i class="fas fa-${currentAudio.paused ? 'play' : 'pause'}"></i>`;
    }
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentAudio) {
        currentAudio.pause();
        const playBtn = currentAudio.parentElement.querySelector('button');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Initial search suggestion
window.addEventListener('load', () => {
    const suggestions = [
        'The Beatles',
        'Ed Sheeran',
        'Taylor Swift',
        'Drake',
        'Adele'
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    document.getElementById('searchTerm').placeholder = `Try searching for "${randomSuggestion}"...`;
});