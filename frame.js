const photos = JSON.parse(localStorage.getItem("photos")) || [];
const imgs = document.querySelectorAll(".grid img");
const canvas = document.getElementById("exportCanvas");
const ctx = canvas.getContext("2d");
let currentFrame = 1;

// inject foto
photos.forEach((src, i) => {
  if (imgs[i]) imgs[i].src = src;
});

// pastikan semua gambar siap
function waitImagesLoaded(callback) {
  let loaded = 0;
  imgs.forEach(img => {
    if (img.complete && img.naturalWidth !== 0) {
      loaded++;
    } else {
      img.onload = () => {
        loaded++;
        if (loaded === imgs.length) callback();
      };
    }
  });
  if (loaded === imgs.length) callback();
}

function setFrame(frameNum) {
  const framePreview = document.getElementById("framePreview");
  framePreview.className = "frame frame-" + frameNum;
  currentFrame = frameNum;
}

document.getElementById("downloadBtn").addEventListener("click", () => {
  waitImagesLoaded(exportFrame);
});

function exportFrame() {
  const firstImg = imgs[0];
  const imgW = firstImg.naturalWidth;
  const imgH = firstImg.naturalHeight;

  canvas.width = imgW * 2;
  canvas.height = imgH * 3;

  // Draw frame background
  const frameImg = new Image();
  frameImg.src = `frame${currentFrame}.jpeg`;
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    drawPhotos();
  };

  function drawPhotos() {
    const margin = 20; // Margin to fit photos into frame's special places
    const photoW = imgW - margin * 2;
    const photoH = imgH - margin * 2;
    imgs.forEach((img, i) => {
      const x = (i % 2) * imgW + margin;
      const y = Math.floor(i / 2) * imgH + margin;
      ctx.drawImage(img, x, y, photoW, photoH);
    });

    const link = document.createElement("a");
    link.download = "photogo-real.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
}

function getGradient(frameNum) {
  switch(frameNum) {
    case 1: return ctx.createLinearGradient(0, 0, canvas.width, canvas.height).addColorStop(0, '#ff9a9e').addColorStop(1, '#fad0c4');
    case 2: return ctx.createLinearGradient(0, 0, canvas.width, canvas.height).addColorStop(0, '#a18cd1').addColorStop(1, '#fbc2eb');
    case 3: return ctx.createLinearGradient(0, 0, canvas.width, canvas.height).addColorStop(0, '#43cea2').addColorStop(1, '#185a9d');
    default: return '#ffffff';
  }
}
