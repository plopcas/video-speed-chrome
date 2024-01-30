(function() {
    // Variables to store the video element and overlay element
    let video, overlay, hideOverlayTimeout;

    // Retrieves the video and overlay elements, creating the overlay if it doesn't exist
    function getVideoAndOverlay() {
        if (!video) video = document.querySelector('video');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'playbackRateOverlay';
            document.body.appendChild(overlay);
            styleOverlay();
        }
        return { video, overlay };
    }

    // Debounce function to limit the rate at which a function can fire
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const later = () => {
                clearTimeout(timeout);
                func();
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Event listener for keydown events to control video playback
    document.addEventListener('keydown', function(event) {
        const { video, overlay } = getVideoAndOverlay();
        if (!video) return;

        // Object mapping keys to their corresponding actions
        const keyActions = {
            'D': () => adjustPlaybackRate(0.10),
            'd': () => adjustPlaybackRate(0.10),
            'S': () => adjustPlaybackRate(-0.10),
            's': () => adjustPlaybackRate(-0.10),
            'X': () => adjustCurrentTime(10),
            'x': () => adjustCurrentTime(10),
            'Z': () => adjustCurrentTime(-10),
            'z': () => adjustCurrentTime(-10),
            'A': () => resetPlaybackRate(), // Reset on 'A'
            'a': () => resetPlaybackRate()  // Reset on 'a'
        };

        // Execute the action associated with the pressed key
        if (keyActions[event.key]) {
            keyActions[event.key]();
        }
    });

    // Adjusts the playback rate of the video
    function adjustPlaybackRate(delta) {
        const { video, overlay } = getVideoAndOverlay();
        video.playbackRate = Math.max(0.1, Math.round((video.playbackRate + delta) * 100) / 100);
        overlay.textContent = `${video.playbackRate}x`;
        showAndAutoHideOverlay();
    }

    // Resets the playback rate to normal speed
    function resetPlaybackRate() {
        const { video, overlay } = getVideoAndOverlay();
        video.playbackRate = 1;
        overlay.textContent = `${video.playbackRate}x`;
        showAndAutoHideOverlay();
    }

    // Adjusts the current playback time of the video
    function adjustCurrentTime(delta) {
        const { video } = getVideoAndOverlay();
        video.currentTime += delta;
    }

    // Styles the overlay that displays playback rate
    function styleOverlay() {
        overlay.style.position = 'fixed';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        overlay.style.color = 'rgba(255, 255, 255, 0.7)';
        overlay.style.padding = '5px';
        overlay.style.margin = '5px';
        overlay.style.borderRadius = '5px';
        overlay.style.fontSize = '16px';
        overlay.style.zIndex = '1000';
        updateOverlayPosition();
    }

    // Updates the position of the overlay relative to the video element
    function updateOverlayPosition() {
        const { video } = getVideoAndOverlay();
        const rect = video.getBoundingClientRect();
        overlay.style.top = rect.top + 'px';
        overlay.style.left = rect.left + 'px';
    }

    // Shows the overlay briefly and then automatically hides it
    function showAndAutoHideOverlay() {
        overlay.style.display = 'block';
        clearTimeout(hideOverlayTimeout);
        hideOverlayTimeout = setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);
    }

    // Optimize resize and fullscreen change events using debounce
    const optimizedResize = debounce(() => {
        updateOverlayPosition();
    }, 250);

    // Add event listeners for window resize and fullscreen changes
    window.addEventListener('resize', optimizedResize);
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => {
        document.addEventListener(event, optimizedResize);
    });
})();
