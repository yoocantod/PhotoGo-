

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const captureBtn = document.getElementById("captureBtn");
const finishBtn = document.getElementById("finishBtn");
const countdownEl = document.getElementById("countdown");
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

  captureBtn.disabled = true;
  let count = 3;
  countdownEl.style.display = "block";
  countdownEl.textContent = count;

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(countdownInterval);
      countdownEl.style.display = "none";

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

      captureBtn.disabled = false;
    }
  }, 1000);
});
// RENDER KE GRID
function renderPhotos() {
  slots.forEach((slot, i) => {
    slot.innerHTML = "";
    if (photos[i]) {
      const img = document.createElement("img");
      img.src = photos[i];
      img.classList.add("fade-in");
      slot.appendChild(img);
    }
  });

  finishBtn.disabled = photos.length !== 6;
}
slots.forEach((slot, index) => {
  slot.addEventListener("click", () => {
    if (photos[index]) {
      const img = slot.querySelector("img");
      if (img) {
        img.classList.add("fade-out");
        setTimeout(() => {
          photos.splice(index, 1);
          localStorage.setItem("photos", JSON.stringify(photos));
          renderPhotos();
        }, 500); // 0.5s animation duration
      }
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
