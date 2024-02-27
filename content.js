(function() {
    let video, overlay, hideOverlayTimeout;

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

    document.addEventListener('keydown', function(event) {
        const { video, overlay } = getVideoAndOverlay();
        if (!video) return;

        const keyActions = {
            'd': () => adjustPlaybackRate(0.10),
            's': () => adjustPlaybackRate(-0.10),
            'x': () => adjustCurrentTime(10),
            'z': () => adjustCurrentTime(-10),
            'a': () => resetPlaybackRate(),
            'q': () => showCurrentPlaybackRate()
        };

        const action = keyActions[event.key.toLowerCase()];
        if (action) {
            action();
        }
    });

    function adjustPlaybackRate(delta) {
        const { video, overlay } = getVideoAndOverlay();
        video.playbackRate = Math.max(0.1, Math.round((video.playbackRate + delta) * 100) / 100);
        overlay.textContent = `${video.playbackRate}x`;
        showAndAutoHideOverlay();
    }

    function resetPlaybackRate() {
        const { video, overlay } = getVideoAndOverlay();
        video.playbackRate = 1;
        overlay.textContent = `${video.playbackRate}x`;
        showAndAutoHideOverlay();
    }

    function adjustCurrentTime(delta) {
        const { video } = getVideoAndOverlay();
        video.currentTime += delta;
    }

    function showCurrentPlaybackRate() {
        const { video, overlay } = getVideoAndOverlay();
        overlay.textContent = `${video.playbackRate}x`;
        showAndAutoHideOverlay();
    }

    function styleOverlay() {
        overlay.style.position = 'fixed';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        overlay.style.color = 'white';
        overlay.style.margin = '10px';
        overlay.style.padding = '5px 10px';
        overlay.style.borderRadius = '10px';
        overlay.style.fontSize = '16px';
        overlay.style.zIndex = '10000';
        updateOverlayPosition();
    }

    function updateOverlayPosition() {
        const { video } = getVideoAndOverlay();
        if (!video) return;
        const rect = video.getBoundingClientRect();
        overlay.style.top = `${window.scrollY + rect.top}px`;
        overlay.style.left = `${window.scrollX + rect.left}px`;
    }

    function showAndAutoHideOverlay() {
        updateOverlayPosition(); // Recalculate the overlay position before showing it
        overlay.style.display = 'block';
        clearTimeout(hideOverlayTimeout);
        hideOverlayTimeout = setTimeout(() => {
            overlay.style.display = 'none';
        }, 2000); // Increase timeout to 2 seconds for better visibility
    }

    const optimizedResize = debounce(() => {
        updateOverlayPosition();
    }, 250);

    window.addEventListener('resize', optimizedResize);
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => {
        document.addEventListener(event, optimizedResize);
    });

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'VIDEO') {
                        video = null; // Reset video variable so it gets re-selected
                        getVideoAndOverlay(); // Re-select video and overlay elements
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeDOMChanges();
})();
