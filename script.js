// Main Dashboard Navigation Logic

function openModule(moduleName) {
    if (moduleName === 'voice') {
        window.location.href = 'voice.html';
    } else if (moduleName === 'image') {
        window.location.href = 'image.html';
    } else if (moduleName === 'video') {
        window.location.href = 'video.html';
    }
}

// Button Click Listener Setup
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.launch-btn:not(.disabled)');
    
    buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (index === 0) openModule('voice');
            if (index === 1) openModule('image');
            if (index === 2) openModule('video');
        });
    });
});
