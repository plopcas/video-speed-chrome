(function() {
    let hideOverlayTimeout; // Variable to keep track of the timeout

    document.addEventListener('keydown', function(event) {
        const video = document.querySelector('video');
        if (!video) return;

        let overlay = document.querySelector('.playbackRateOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'playbackRateOverlay';
            styleOverlay(overlay, video);
            document.body.appendChild(overlay);
        } else {
            clearTimeout(hideOverlayTimeout);
        }

        const keyActions = {
            'D': () => adjustPlaybackRate(video, 0.10, overlay),
            'd': () => adjustPlaybackRate(video, 0.10, overlay),
            'S': () => adjustPlaybackRate(video, -0.10, overlay),
            's': () => adjustPlaybackRate(video, -0.10, overlay),
            'X': () => adjustCurrentTime(video, 10),
            'x': () => adjustCurrentTime(video, 10),
            'Z': () => adjustCurrentTime(video, -10),
            'z': () => adjustCurrentTime(video, -10),
            'A': () => resetPlaybackRate(video, overlay), // Reset on 'A'
            'a': () => resetPlaybackRate(video, overlay), // Reset on 'a'
        };

        if (keyActions[event.key]) {
            keyActions[event.key]();
        }
    });

    function adjustPlaybackRate(video, delta, overlay) {
        video.playbackRate = Math.max(0.1, Math.round((video.playbackRate + delta) * 100) / 100);
        overlay.textContent = `${video.playbackRate}x`;
        showAndAutoHideOverlay(overlay);
    }

    function resetPlaybackRate(video, overlay) {
        video.playbackRate = 1;
        overlay.textContent = `${video.playbackRate}x`;
        showAndAutoHideOverlay(overlay);
    }

    function adjustCurrentTime(video, delta) {
        video.currentTime += delta;
    }

    function styleOverlay(overlay, video) {
        overlay.style.position = 'fixed';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; // Background transparency
        overlay.style.color = 'rgba(255, 255, 255, 0.7)'; // More transparent white
        overlay.style.padding = '5px';
        overlay.style.margin = '5px';
        overlay.style.borderRadius = '5px';
        overlay.style.fontSize = '16px';
        overlay.style.zIndex = '1000';
        updateOverlayPosition(overlay, video);
    }

    function updateOverlayPosition(overlay, video) {
        const rect = video.getBoundingClientRect();
        overlay.style.top = rect.top + 'px';
        overlay.style.left = rect.left + 'px';
    }

    function showAndAutoHideOverlay(overlay) {
        overlay.style.display = 'block';
        hideOverlayTimeout = setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);
    }

    window.addEventListener('resize', function() {
        const overlay = document.querySelector('.playbackRateOverlay');
        const video = document.querySelector('video');
        if (overlay && video) {
            updateOverlayPosition(overlay, video);
        }
    });

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => {
        document.addEventListener(event, function() {
            const overlay = document.querySelector('.playbackRateOverlay');
            const video = document.querySelector('video');
            if (overlay && video) {
                updateOverlayPosition(overlay, video);
            }
        });
    });
})();

