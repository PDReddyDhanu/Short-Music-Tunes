## Connect with Me
- **GitHub:** [PDReddyDhanu](https://github.com/PDReddyDhanu)
- **LinkedIn:** [Dhanunjay Reddy Palakolanu](https://www.linkedin.com/in/dhanunjay-reddy-palakolanu-pdr/)
- **Instagram:** [p.d.reddy_dhanu04_08](https://www.instagram.com/p.d.reddy_dhanu04_08/)

# Short Music Tunes Player

## Overview
The Shot Music Tunes Player is a web-based music streaming application that allows users to search, play, and control songs with ease. It leverages the iTunes API to provide song previews, artist details, and album artwork. The player is designed with an intuitive user interface, multiple playback modes, and responsive design.

## Features
- **Dark Mode:** Toggle a dark theme for a better viewing experience, reducing eye strain in low-light environments.
- **Search Functionality:** Search for songs, artists, or albums using the iTunes API, with a dynamic placeholder suggesting popular artists.
- **Shuffle Mode:** Randomly play songs for a varied listening experience, automatically selecting and playing the next song when a track ends.
- **Stereo Mode:** Sets the volume to maximum for an immersive experience, ideal for high-fidelity listening.
- **Ambient Mode:** Lowers the volume for background listening, perfect for a relaxed environment.
- **Audio Visualizer:** A real-time bar visualizer animates during playback, adding a visual element to the listening experience.
- **Keyboard Shortcuts:** Press the spacebar to play or pause the current song, enhancing ease of use.
- **Responsive Design:** The layout adapts to different screen sizes, ensuring a seamless experience across desktop, tablet, and mobile devices.
- **Automatic Pause:** Automatically pauses the song when the browser tab loses focus, ensuring the user doesn't miss any part of the music.

## Technologies Used
- **HTML5:** Semantic structure for the web page, ensuring accessibility and search engine optimization.
- **CSS3:** Styling with modern techniques, including CSS variables for theme customization and media queries for responsive design.
- **JavaScript (ES6):** Core functionality for the player, including event handling, dynamic content updates, and API calls.
- **Font Awesome:** Icon library for buttons and controls, ensuring a visually appealing interface.
- **iTunes API:** Provides access to song previews, album artwork, and artist information for a rich music streaming experience.
- **Custom CSS Variables:** Used for theme management, allowing quick toggling between light and dark modes.

## Installation & Setup
1. **Clone the repository:**
   ```bash
       git clone https://github.com/your-username/Short-Music-Tunes.git
   ```

## How to Use
1. **Search:** Enter a term (e.g., artist or song title) and click the search button to fetch and display matching results.
2. **Playback Controls:**
   - Click the play button to start playback.
   - Use the pause button to stop playback.
   - Adjust the volume with the slider control.
   - Skip to a specific part of the song by clicking the progress bar.
3. **Theme Control:** Use the Dark Mode button to toggle between light and dark themes.
4. **Mode Buttons:**
   - **Stereo Mode:** Sets the volume to full.
   - **Ambient Mode:** Lowers the volume to 20%.
5. **Shuffle:** Click the shuffle button to enable or disable random playback order.

## Code Structure
### HTML
- **Header Section:** Contains the navigation bar, logo, and search bar.
- **Main Section:** Displays song cards with album artwork, song information, and controls.

### CSS
- **Theming:** Uses CSS variables for primary and secondary colors, background colors, and text colors.
- **Grid Layout:** Implements a flexible grid for displaying songs.
- **Responsive Design:** Media queries adjust the layout for different screen sizes.

### JavaScript
- **Search Function:** Fetches songs from the iTunes API and dynamically generates song cards.
- **Audio Controls:** Manages playback, volume adjustment, progress tracking, and shuffle functionality.
- **Dark Mode:** Toggles between light and dark themes by applying CSS classes.
- **Visualizer:** Animates bars to simulate audio waves during playback.

## Future Enhancements
- **Playlist Creation:** Allow users to create and manage custom playlists.
- **User Authentication:** Enable user accounts for saving preferences and playlists.
- **Extended API Support:** Integrate additional music APIs to expand the song library.
- **Lyrics Display:** Show synchronized song lyrics during playback.



## Acknowledgments
- **Apple iTunes API:** For providing song previews and metadata.
- **Font Awesome:** For the icons used in the player.



---
Thank you for using the Advanced Music Player! Feel free to share feedback or report issues via GitHub.

