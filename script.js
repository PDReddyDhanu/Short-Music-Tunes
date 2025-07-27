// Minimal, robust search and display logic for iTunes API
let currentAudio = null;
let repeatEnabled = false;

// Dark mode toggle
const darkModeBtn = document.getElementById('darkModeBtn');
darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = darkModeBtn.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// --- Repeat Mode and Lyrics Feature ---
const repeatBtn = document.getElementById('repeatModeBtn');
repeatBtn.addEventListener('click', () => {
    repeatEnabled = !repeatEnabled;
    repeatBtn.style.background = repeatEnabled ? 'linear-gradient(90deg, #ff4081 60%, #6200ea 100%)' : 'var(--secondary-color)';
    repeatBtn.textContent = repeatEnabled ? 'Repeat: ON' : 'Repeat: OFF';
});

function setMainCentering(isCentered) {
    const main = document.getElementById('songs');
    if (isCentered) {
        main.classList.add('center-content');
    } else {
        main.classList.remove('center-content');
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function createVisualizer(container) {
    const bars = 20;
    for (let i = 0; i < bars; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.setProperty('--i', i);
        container.appendChild(bar);
    }
}

function updateVisualizer(container, audio) {
    if (!audio.paused && !audio.ended) {
        const bars = container.children;
        for (let i = 0; i < bars.length; i++) {
            const height = Math.random() * 30 + 10;
            bars[i].style.height = `${height}px`;
        }
    }
}

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

    // Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.title = 'Download preview';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
    downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = result.previewUrl;
        a.download = `${result.artistName} - ${result.trackName}.m4a`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Visualizer
    const visualizerContainer = document.createElement('div');
    visualizerContainer.className = 'visualizer-container';
    createVisualizer(visualizerContainer);
    let visualizerInterval = null;

    // Volume control (slider and mute)
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
    const muteBtn = document.createElement('button');
    muteBtn.title = 'Mute/Unmute';
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    let lastVolume = 1;

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
        lastVolume = audio.volume;
        if (audio.volume == 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (audio.volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    });
    muteBtn.addEventListener('click', () => {
        if (audio.muted) {
            audio.muted = false;
            volumeSlider.value = lastVolume;
            audio.volume = lastVolume;
        } else {
            audio.muted = true;
            volumeSlider.value = 0;
        }
    });

    volumeControl.appendChild(volumeIcon);
    volumeControl.appendChild(volumeSlider);
    volumeControl.appendChild(muteBtn);

    // Event listeners
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                if (currentAudio._visualizerInterval) {
                    clearInterval(currentAudio._visualizerInterval);
                }
            }
            audio.play();
            currentAudio = audio;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            visualizerInterval = setInterval(() => updateVisualizer(visualizerContainer, audio), 120);
            audio._visualizerInterval = visualizerInterval;
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            if (visualizerInterval) clearInterval(visualizerInterval);
        }
    });

    audio.addEventListener('pause', () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (visualizerInterval) clearInterval(visualizerInterval);
    });
    audio.addEventListener('ended', () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (visualizerInterval) clearInterval(visualizerInterval);
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTime.textContent = formatTime(audio.currentTime);
    });

    progressContainer.addEventListener('click', (e) => {
        const clickPosition = (e.offsetX / progressContainer.offsetWidth);
        audio.currentTime = clickPosition * audio.duration;
    });

    // Append elements
    progressContainer.appendChild(progressBar);
    timeDisplay.appendChild(currentTime);
    timeDisplay.appendChild(duration);

    controls.appendChild(playBtn);
    controls.appendChild(volumeControl);
    controls.appendChild(downloadBtn);

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
const filterSelect = document.getElementById('filterSelect');

const updateTerm = () => {
    const term = document.getElementById('searchTerm').value;
    if (!term || term === '') {
        alert('Please enter a search term');
        return;
    }
    let url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&limit=50`;
    const filter = filterSelect.value;
    if (filter === 'music') {
        url += '&media=music';
    } else if (filter === 'musicVideo') {
        url += '&media=musicVideo';
    } else if (filter === 'album') {
        url += '&entity=album';
    }
    const songContainer = document.getElementById('songs');
    songContainer.innerHTML = '<div class="loading">Searching for songs...</div>';
    setMainCentering(false);
    console.log('Fetching from URL:', url);
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            songContainer.innerHTML = '';
            if (!data.results || data.results.length === 0) {
                songContainer.innerHTML = '<div class="no-results">No songs found. Try a different search term.</div>';
                setMainCentering(true);
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
            setMainCentering(true);
        });
};

filterSelect.addEventListener('change', () => {
    const term = document.getElementById('searchTerm').value;
    if (term && term !== '') {
        updateTerm();
    }
});

document.getElementById('searchTermBtn').addEventListener('click', updateTerm);
document.getElementById('searchTerm').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        updateTerm();
    }
});

// On load, center main section and ensure ambient background is hidden
window.addEventListener('load', () => {
    setMainCentering(true);
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
