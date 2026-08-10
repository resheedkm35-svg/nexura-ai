import { removeBackground } from "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm";

let currentActiveModule = 'eraser-module';
let rawSubjectImg = null;
let customBgImg = null;
let exportPresetWidth = 3840;

const masterCanvas = document.getElementById('master-canvas');
const ctx = masterCanvas.getContext('2d');
const laserOverlay = document.getElementById('laser-overlay');
const hudPct = document.getElementById('hud-pct');
const placeholderMsg = document.getElementById('placeholder-msg');
const exportDownloadBtn = document.getElementById('export-download-btn');

// Theme Switcher
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Switch Module System
window.switchToolModule = function(moduleId, element) {
    currentActiveModule = moduleId;
    document.querySelectorAll('.tool-select-card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.tool-section-view').forEach(view => view.classList.remove('active-view'));

    element.classList.add('active');
    document.getElementById(moduleId).classList.add('active-view');
    renderMasterCanvas();
};

window.setResolution = function(width, btn) {
    exportPresetWidth = width;
    document.querySelectorAll('.res-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
};

// File Processing via WASM AI Engine with Laser Scanner
async function processBgRemoval(file) {
    laserOverlay.style.display = "block";
    hudPct.innerText = "0%";

    try {
        const blob = await removeBackground(file, {
            progress: (key, current, total) => {
                const pct = Math.round((current / total) * 100);
                if (!isNaN(pct)) {
                    hudPct.innerText = `${pct}%`;
                }
            }
        });

        const img = new Image();
        img.onload = () => {
            rawSubjectImg = img;
            laserOverlay.style.display = "none";
            renderMasterCanvas();
        };
        img.src = URL.createObjectURL(blob);
    } catch (err) {
        console.error(err);
        laserOverlay.style.display = "none";
        alert("AI പ്രോസസ്സിംഗിൽ തടസ്സം നേരിട്ടു.");
    }
}

document.getElementById('upload-eraser-file').onchange = (e) => {
    if(e.target.files[0]) processBgRemoval(e.target.files[0]);
};

document.getElementById('upload-comp-subject').onchange = (e) => {
    if(e.target.files[0]) processBgRemoval(e.target.files[0]);
};

document.getElementById('upload-comp-bg').onchange = (e) => {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                customBgImg = img;
                renderMasterCanvas();
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }
};

document.getElementById('upload-clarity-file').onchange = (e) => {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                rawSubjectImg = img;
                renderMasterCanvas();
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// Full Advanced Master Rendering Engine
function renderMasterCanvas() {
    if(!rawSubjectImg) return;

    masterCanvas.width = rawSubjectImg.naturalWidth;
    masterCanvas.height = rawSubjectImg.naturalHeight;

    ctx.clearRect(0, 0, masterCanvas.width, masterCanvas.height);

    // 1. Draw Background Layer (Compositor Mode)
    if(currentActiveModule === 'compositor-module' && customBgImg) {
        ctx.drawImage(customBgImg, 0, 0, masterCanvas.width, masterCanvas.height);
    }

    // 2. Draw Drop Shadow
    if(currentActiveModule === 'compositor-module') {
        const shadowVal = parseInt(document.getElementById('shadow-range').value);
        if(shadowVal > 0) {
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
            ctx.shadowBlur = shadowVal;
            ctx.shadowOffsetX = shadowVal / 2;
            ctx.shadowOffsetY = shadowVal / 2;
            ctx.drawImage(rawSubjectImg, 0, 0);
            ctx.restore();
        }
    }

    // 3. Subject Drawing & Edge Matting Blur / Filters
    ctx.save();
    if(currentActiveModule === 'compositor-module') {
        const blurVal = parseInt(document.getElementById('edge-blur-range').value);
        if(blurVal > 0) ctx.filter = `blur(${blurVal / 5}px)`;
    }

    if(currentActiveModule === 'clarity-module') {
        const style = document.getElementById('color-style-select').value;
        if(style === 'hollywood') ctx.filter = 'contrast(120%) saturate(110%) hue-rotate(10deg)';
        if(style === 'vivid') ctx.filter = 'saturate(145%) contrast(115%)';
        if(style === 'warm') ctx.filter = 'sepia(20%) brightness(102%)';
        if(style === 'noir') ctx.filter = 'grayscale(100%) contrast(140%)';
    }

    ctx.drawImage(rawSubjectImg, 0, 0);
    ctx.restore();

    // 4. Advanced Light Wrap Engine
    if(currentActiveModule === 'compositor-module' && customBgImg) {
        const wrapVal = parseInt(document.getElementById('light-wrap-range').value);
        if(wrapVal > 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'source-atop';
            ctx.globalAlpha = wrapVal / 100;
            ctx.filter = 'blur(18px)';
            ctx.drawImage(customBgImg, 0, 0, masterCanvas.width, masterCanvas.height);
            ctx.restore();
        }
    }

    // 5. Convolution Sharpness Matrix Engine
    if(currentActiveModule === 'clarity-module') {
        const sharpVal = parseInt(document.getElementById('clarity-range').value);
        if(sharpVal > 0) {
            applyConvolutionSharpen(sharpVal / 100);
        }
    }

    placeholderMsg.style.display = "none";
    masterCanvas.style.display = "block";
    exportDownloadBtn.style.display = "block";
}

// Sharpen Kernel Processing Engine
function applyConvolutionSharpen(amount) {
    const imgData = ctx.getImageData(0, 0, masterCanvas.width, masterCanvas.height);
    const data = imgData.data;
    const w = masterCanvas.width;
    const h = masterCanvas.height;
    const mix = amount;

    const kernel = [
        0, -1 * mix, 0,
        -1 * mix, 1 + (4 * mix), -1 * mix,
        0, -1 * mix, 0
    ];

    const buff = new Uint8ClampedArray(data);

    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * w + (x + kx)) * 4;
                    const weight = kernel[(ky + 1) * 3 + (kx + 1)];
                    r += buff[idx] * weight;
                    g += buff[idx + 1] * weight;
                    b += buff[idx + 2] * weight;
                }
            }
            const idx = (y * w + x) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

// Real-Time Range Listeners
document.getElementById('edge-blur-range').oninput = function() {
    document.getElementById('val-blur').innerText = this.value + 'px';
    renderMasterCanvas();
};

document.getElementById('light-wrap-range').oninput = function() {
    document.getElementById('val-wrap').innerText = this.value + '%';
    renderMasterCanvas();
};

document.getElementById('shadow-range').oninput = function() {
    document.getElementById('val-shadow').innerText = this.value + 'px';
    renderMasterCanvas();
};

document.getElementById('clarity-range').oninput = function() {
    document.getElementById('val-sharp').innerText + '%';
    renderMasterCanvas();
};

document.getElementById('color-style-select').onchange = renderMasterCanvas;

// Lossless Studio Download Engine
exportDownloadBtn.addEventListener('click', () => {
    if(!masterCanvas.width) return;

    const exportCanvas = document.createElement('canvas');
    const ratio = masterCanvas.height / masterCanvas.width;

    exportCanvas.width = exportPresetWidth;
    exportCanvas.height = Math.round(exportPresetWidth * ratio);

    const expCtx = exportCanvas.getContext('2d');
    expCtx.imageSmoothingEnabled, true;
    expCtx.imageSmoothingQuality = 'high';

    expCtx.drawImage(masterCanvas, 0, 0, exportCanvas.width, exportCanvas.height);

    const link = document.createElement('a');
    link.download = `Nexura_Master_Export_${exportPresetWidth}p_${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png', 1.0);
    link.click();
});
