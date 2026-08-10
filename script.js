// Nexura.AI - Ecosystem Dashboard Navigation Logic

function navigateTo(pageUrl) {
    if (pageUrl) {
        window.location.href = pageUrl;
    } else {
        alert("ഈ മോഡ്യൂൾ പ്രോസസ്സിംഗിലാണ്, ഉടൻ ലഭ്യമാകും!");
    }
}

// Mobile Scroll & Active State Enhancements
document.addEventListener('DOMContentLoaded', () => {
    console.log("Nexura.AI Ecosystem Online.");
    
    // Optional: Auto-scroll to centered card on mobile view
    const cardGrid = document.querySelector('.card-grid');
    if (cardGrid && window.innerWidth <= 768) {
        cardGrid.scrollLeft = 0;
    }
});
