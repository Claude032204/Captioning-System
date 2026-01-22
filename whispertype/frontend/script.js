const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");

const previewCard = document.getElementById("previewCard");
const videoPreview = document.getElementById("videoPreview");
const audioPreview = document.getElementById("audioPreview");
const fileMeta = document.getElementById("fileMeta");

const progressCard = document.getElementById("progressCard");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFile = null;

// ===== Helpers =====
function isAllowedFile(file) {
  if (!file) return false;

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const allowedExt = ["mp4", "mp3", "wav"];
  if (!allowedExt.includes(ext)) return false;

  // (optional) file size check
  // const maxBytes = 500 * 1024 * 1024; // 500MB
  // if (file.size > maxBytes) return false;

  return true;
}

function setSelectedFile(file) {
  if (!isAllowedFile(file)) {
    selectedFile = null;
    uploadBtn.disabled = true;
    previewCard.classList.add("hidden");
    alert("Invalid file type. Please upload MP4, MP3, or WAV.");
    return;
  }

  selectedFile = file;
  uploadBtn.disabled = false;

  // Show preview card
  previewCard.classList.remove("hidden");

  // Reset previews
  videoPreview.classList.add("hidden");
  audioPreview.classList.add("hidden");
  videoPreview.src = "";
  audioPreview.src = "";

  // Create preview URL
  const url = URL.createObjectURL(selectedFile);

  // Detect type
  const isVideo = selectedFile.type.startsWith("video/") || selectedFile.name.toLowerCase().endsWith(".mp4");
  const isAudio = selectedFile.type.startsWith("audio/") || selectedFile.name.toLowerCase().endsWith(".mp3") || selectedFile.name.toLowerCase().endsWith(".wav");

  if (isVideo) {
    videoPreview.src = url;
    videoPreview.classList.remove("hidden");
  } else if (isAudio) {
    audioPreview.src = url;
    audioPreview.classList.remove("hidden");
  }

  fileMeta.textContent = `${selectedFile.name} • ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;
}

// ===== Click-to-browse =====
dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

// When user selects via file picker
fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0] || null;
  if (file) setSelectedFile(file);
});

// ===== Drag events =====
["dragenter", "dragover"].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("dragover");
  });
});

// Drop
dropZone.addEventListener("drop", (e) => {
  const file = e.dataTransfer?.files?.[0] || null;
  if (file) setSelectedFile(file);
});

// ===== Process button =====
uploadBtn.addEventListener("click", () => {
  if (!selectedFile) return;

  progressCard.classList.remove("hidden");
  resultText.value = "";
  copyBtn.disabled = true;
  downloadBtn.disabled = true;

  simulateProgress();
});

function simulateProgress() {
  let progress = 0;
  progressFill.style.width = "0%";
  progressText.textContent = "Uploading...";

  const interval = setInterval(() => {
    progress += 10;
    progressFill.style.width = progress + "%";

    if (progress === 30) progressText.textContent = "Extracting audio...";
    if (progress === 60) progressText.textContent = "Transcribing...";
    if (progress === 90) progressText.textContent = "Formatting captions...";

    if (progress >= 100) {
      clearInterval(interval);
      progressText.textContent = "Completed";

      setTimeout(() => {
        resultText.value =
`[Sample Captions Output]

00:00:00.000 --> 00:00:03.000
Hello, everyone. Welcome to the show.

00:00:03.000 --> 00:00:06.000
Today we will discuss the latest updates.

(Replace this with real output when backend is connected.)
`;
        copyBtn.disabled = false;
        downloadBtn.disabled = false;
      }, 400);
    }
  }, 450);
}

// Copy captions
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultText.value);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 900);
  } catch {
    alert("Copy failed. Please copy manually.");
  }
});

// Download captions
downloadBtn.addEventListener("click", () => {
  const text = resultText.value.trim();
  if (!text) return;

  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "captions.txt";
  a.click();
});
// ===== Header text rotation =====
const subtitle = document.getElementById("subtitle");
const tagline = document.getElementById("tagline");

let showSubtitle = true;

setInterval(() => {
  if (showSubtitle) {
    subtitle.classList.remove("active");
    tagline.classList.add("active");
  } else {
    tagline.classList.remove("active");
    subtitle.classList.add("active");
  }
  showSubtitle = !showSubtitle;
}, 3000);
