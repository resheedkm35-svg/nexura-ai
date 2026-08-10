// Nexura.AI - Main Dashboard Navigation Logic

// 1. Dynamic Route Navigation (HTML Onclick & Direct Calls)
function navigateTo(pageUrl) {
    if (pageUrl) {
        window.location.href = pageUrl;
    } else {
        alert("ഈ മോഡ്യൂൾ ഉടൻ തന്നെ ലഭ്യമാകും!");
    }
}

// 2. Legacy Module Opener (Voice, Image, Video)
function openModule(moduleName) {
    const routes = {
        'voice': 'voice.html',
        'image': 'image.html',
        'video': 'video.html',
        'hologram': 'hologram.html',
        'lip-sync': 'lip-sync.html',
        'object-eraser': 'object-eraser.html',
        'resizer': 'resizer-subtitles.html',
        'canvas': 'ai-canvas.html'
    };

    if (routes[moduleName]) {
        window.location.href = routes[moduleName];
    } else {
        alert("റൂട്ട് ലഭ്യമായിട്ടില്ല!");
    }
}

// 3. Automated Event Listener Setup for Dashboard Buttons
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        const btn = card.querySelector('.launch-btn:not(.disabled)');
        const cardNum = card.querySelector('.card-num')?.textContent.trim();

        if (btn) {
            btn.addEventListener('click', (e) => {
                // If inline onclick is already present, let it handle the navigation
                if (btn.hasAttribute('onclick')) return;

                // Index-based fallback for old arrangement
                switch (cardNum) {
                    case '01':
                        openModule('voice');
                        break;
                    case '02':
                        openModule('image');
                        break;
                    case '03':
                        openModule('video');
                        break;
                    case '04':
                        navigateTo('hologram.html');
                        break;
                    case '05':
                        navigateTo('lip-sync.html');
                        break;
                    case '06':
                        navigateTo('object-eraser.html');
                        break;
                    case '07':
                        navigateTo('resizer-subtitles.html');
                        break;
                    case '08':
                        navigateTo('ai-canvas.html');
                        break;
                    default:
                        console.log("No specific route bound for card:", cardNum);
                }
            });
        }
    });
});
