const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const captureBtn = document.getElementById("captureBtn");
const finishBtn = document.getElementById("finishBtn");
const slots = document.querySelectorAll(".slot");

let photos = JSON.parse(localStorage.getItem("photos")) || [];
renderPhotos();

// AKSES KAMERA (TIDAK MIRROR)
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" },
  audio: false
}).then(stream => {
  video.srcObject = stream;
}).catch(err => {
  alert("Kamera tidak bisa diakses");
  console.error(err);
});

// CAPTURE FOTO
captureBtn.addEventListener("click", () => {
  if (photos.length >= 6) return;
  if (video.videoWidth === 0) return alert("Kamera belum siap");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
  ctx.restore();

  const imageData = canvas.toDataURL("image/png");
  photos.push(imageData);
  localStorage.setItem("photos", JSON.stringify(photos));
  renderPhotos();
});
// RENDER KE GRID
function renderPhotos() {
  slots.forEach((slot, i) => {
    slot.innerHTML = "";
    if (photos[i]) {
      const img = document.createElement("img");
      img.src = photos[i];
      slot.appendChild(img);
    }
  });

  finishBtn.disabled = photos.length !== 6;
}
slots.forEach((slot, index) => {
  slot.addEventListener("click", () => {
    if (photos[index]) {
      photos.splice(index, 1);
      localStorage.setItem("photos", JSON.stringify(photos));
      renderPhotos();
    }
  });
});


// FINISH
finishBtn.addEventListener("click", () => {
  alert("6 foto selesai!");
  // lanjut ke halaman berikutnya jika mau
});

finishBtn.addEventListener("click", () => {
  window.location.href = "frame.html";
});
