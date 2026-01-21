const photos = JSON.parse(localStorage.getItem("photos")) || [];
const imgs = document.querySelectorAll(".grid img");
const canvas = document.getElementById("exportCanvas");
const ctx = canvas.getContext("2d");

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

document.getElementById("downloadBtn").addEventListener("click", () => {
  waitImagesLoaded(exportFrame);
});

function exportFrame() {
  const firstImg = imgs[0];
  const imgW = firstImg.naturalWidth;
  const imgH = firstImg.naturalHeight;

  canvas.width = imgW * 2;
  canvas.height = imgH * 3;

  imgs.forEach((img, i) => {
    const x = (i % 2) * imgW;
    const y = Math.floor(i / 2) * imgH;
    ctx.drawImage(img, x, y, imgW, imgH);
  });

  const link = document.createElement("a");
  link.download = "photogo-real.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
