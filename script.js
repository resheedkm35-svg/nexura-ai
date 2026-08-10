// --- ഇമേജ് ബാക്ക്ഗ്രൗണ്ട് റിമൂവൽ ലോജിക് ---
const imageUpload = document.getElementById('image-upload');
const removeBgBtn = document.getElementById('remove-bg-btn');
const imagePreview = document.getElementById('image-preview');
const processedImage = document.getElementById('processed-image');
const statusMessage = document.getElementById('status-message');

imageUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            imagePreview.src = reader.result;
            imagePreview.style.display = 'block';
            processedImage.style.display = 'none';
            removeBgBtn.disabled = false;
            statusMessage.textContent = 'ഇമേജ് അപ്‌ലോഡ് ചെയ്തു. ബാക്ക്ഗ്രൗണ്ട് റിമൂവ് ചെയ്യാൻ ബട്ടൺ അമർത്തുക.';
        });
        reader.readAsDataURL(file);
    }
});

removeBgBtn.addEventListener('click', async function() {
    const fileInput = document.getElementById('image-upload');
    const file = fileInput.files[0];

    if (!file) return;

    statusMessage.textContent = 'ബാക്ക്ഗ്രൗണ്ട് റിമൂവ് ചെയ്യുന്നു...';
    removeBgBtn.disabled = true;

    // നിങ്ങളുടെ remove.bg API കീ താഴെ നൽകുക
    const apiKey = 'നിങ്ങളുടെ_API_കീ_ഇവിടെ_നൽകുക'; 

    if (apiKey === 'നിങ്ങളുടെ_API_കീ_ഇവിടെ_നൽകുക') {
        statusMessage.textContent = 'എറർ: script.js ഫയലിൽ API കീ നൽകുക.';
        removeBgBtn.disabled = false;
        return;
    }

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: { 'X-Api-Key': apiKey },
            body: formData,
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            processedImage.src = url;
            processedImage.style.display = 'block';
            statusMessage.textContent = 'ബാക്ക്ഗ്രൗണ്ട് വിജയകരമായി റിമൂവ് ചെയ്തു!';
        } else {
            statusMessage.textContent = 'എറർ: ബാക്ക്ഗ്രൗണ്ട് റിമൂവ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.';
        }
    } catch (error) {
        statusMessage.textContent = 'എറർ: നെറ്റ്‌വർക്ക് തടസ്സം.';
    } finally {
        removeBgBtn.disabled = false;
    }
});

// --- വോയിസ് (ടെക്സ്റ്റ്-ടു-സ്പീച്ച്) ലോജിക് ---
const speakBtn = document.getElementById('speak-btn');
const voiceText = document.getElementById('voice-text');

speakBtn.addEventListener('click', function() {
    const text = voiceText.value;
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ml-IN'; 
        speechSynthesis.speak(utterance);
    }
});
