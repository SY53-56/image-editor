/* =========================
   STATE
========================= */
const initialFilters = {
  brightness: { value: 100, min: 0, max: 200, unit: "%" },
  contrast: { value: 100, min: 0, max: 200, unit: "%" },
  saturation: { value: 100, min: 0, max: 200, unit: "%" },
  hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
  blur: { value: 0, min: 0, max: 300, unit: "px" },
  grayscale: { value: 0, min: 0, max: 100, unit: "%" },
  sepia: { value: 0, min: 0, max: 100, unit: "%" },
  invert: { value: 0, min: 0, max: 100, unit: "%" }
};

const state = {
  image: null,
  filters: structuredClone(initialFilters)
};

/* =========================
   DOM ELEMENTS
========================= */
const filterContainer = document.querySelector(".filters");
const presetContainer = document.querySelector(".preset");
const canvas = document.querySelector("#img-canvas");
const ctx = canvas.getContext("2d");
const imageInput = document.querySelector("#image");
const saveBtn = document.querySelector("#save");
const resetBtn = document.querySelector("#reset");
const saveImg = document.querySelector(".saveImg");
const placeholder = document.querySelector(".placeholder");
const downloadsBtn = document.querySelector("#download")
/* =========================
   PRESETS
========================= */
const PRESETS = {
  normal: { brightness: 100, contrast: 100, saturation: 100, hueRotation: 0, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
  vintage: { brightness: 110, contrast: 120, saturation: 90, hueRotation: 10, blur: 1, grayscale: 10, sepia: 30, invert: 0 },
  bw: { brightness: 120, contrast: 140, saturation: 0, hueRotation: 0, blur: 0, grayscale: 100, sepia: 0, invert: 0 },
  cold: { brightness: 95, contrast: 110, saturation: 80, hueRotation: 200, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
  warm: { brightness: 105, contrast: 110, saturation: 120, hueRotation: 20, blur: 0, grayscale: 0, sepia: 10, invert: 0 },
  dramatic: { brightness: 90, contrast: 150, saturation: 130, hueRotation: 0, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
  faded: { brightness: 115, contrast: 80, saturation: 70, hueRotation: 0, blur: 0, grayscale: 0, sepia: 20, invert: 0 },
  soft: { brightness: 110, contrast: 95, saturation: 90, hueRotation: 0, blur: 2, grayscale: 0, sepia: 0, invert: 0 },
  neon: { brightness: 105, contrast: 160, saturation: 200, hueRotation: 90, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
  invertColors: { brightness: 100, contrast: 100, saturation: 100, hueRotation: 0, blur: 0, grayscale: 0, sepia: 0, invert: 100 }
};

/* =========================
   RENDER FUNCTION
========================= */
function render() {
  if (!state.image) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.filter = `
    brightness(${state.filters.brightness.value}%)
    contrast(${state.filters.contrast.value}%)
    saturate(${state.filters.saturation.value}%)
    blur(${state.filters.blur.value}px)
    grayscale(${state.filters.grayscale.value}%)
    sepia(${state.filters.sepia.value}%)
    invert(${state.filters.invert.value}%)
    hue-rotate(${state.filters.hueRotation.value}deg)
  `;
  ctx.drawImage(state.image, 0, 0);
}

/* =========================
   FILTER UI
========================= */
function createFilter(name, config) {
  const div = document.createElement("div");
  div.className = "filter";

  const label = document.createElement("p");
  label.textContent = name;

  const input = document.createElement("input");
  input.type = "range";
  input.min = config.min;
  input.max = config.max;
  input.value = config.value;
  input.name = name;

  const value = document.createElement("span");
  value.textContent = `${config.value}${config.unit}`;

  input.addEventListener("input", () => {
    state.filters[name].value = Number(input.value);
    value.textContent = `${input.value}${config.unit}`;
    render();
  });

  div.append(label, input, value);
  return div;
}

Object.keys(state.filters).forEach(name => {
  filterContainer.appendChild(createFilter(name, state.filters[name]));
});

/* =========================
   PRESET BUTTONS
========================= */
Object.keys(PRESETS).forEach(name => {
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = name;
  btn.dataset.preset = name;
  presetContainer.appendChild(btn);
});

presetContainer.addEventListener("click", e => {
  const preset = PRESETS[e.target.dataset.preset];
  if (!preset) return;

  Object.keys(preset).forEach(key => {
    state.filters[key].value = preset[key];
  });

  syncUI();
  render();
});

/* =========================
   SYNC UI
========================= */
function syncUI() {
  document.querySelectorAll(".filter input").forEach(input => {
    const name = input.name;
    input.value = state.filters[name].value;
    input.nextSibling.textContent = `${state.filters[name].value}${state.filters[name].unit}`;
  });
}

/* =========================
   PLACEHOLDER CONTROL
========================= */
function updatePlaceholder() {
  if (state.image) {
    placeholder.style.display = "none";
    canvas.style.display = "block";
  } else {
    placeholder.style.display = "flex";
    canvas.style.display = "none";
  }
}

/* =========================
   IMAGE INPUT
========================= */
imageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    state.image = img;
    canvas.width = img.width;
    canvas.height = img.height;
    render();
    updatePlaceholder();
    URL.revokeObjectURL(img.src);
  };
});

let imgArr = [];

// Show all saved images
function showSavedImages() {
  saveImg.innerHTML = "";

  imgArr.forEach((item, index) => {
    const img = new Image();
    img.src = item.image;
    img.classList.add("img-show")
   
    // Optional: click to reload image into editor
    img.addEventListener("click", () => loadImageFromGallery(index));

    saveImg.appendChild(img);
  });
}


function saveState() {
  if (!state.image) return;

  const dataURL = canvas.toDataURL("image/png");
  const payload = {
    image: dataURL,
    filters: state.filters
  };

  // Load existing array from localStorage
  imgArr = JSON.parse(localStorage.getItem("editorArray")) || [];
  imgArr.push(payload);
  localStorage.setItem("editorArray", JSON.stringify(imgArr));

  // Clear editor
  state.image = null;
  state.filters = structuredClone(initialFilters);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  syncUI();
  updatePlaceholder();

  showSavedImages();
}

// Load saved array on page load
function loadState() {
  imgArr = JSON.parse(localStorage.getItem("editorArray")) || [];
  showSavedImages();
}

// Reload image from gallery
function loadImageFromGallery(index) {
  const item = imgArr[index];
  if (!item) return;

  const img = new Image();
  img.src = item.image;

}
downloadsBtn.addEventListener("click",()=>{
  if(!state.image) return
  const a= document.createElement('a')
 a.download= "edited-image.png";
  a.href = canvas.toDataURL("image/png"); // Correct method
 a.click()
})


loadState();

saveBtn.addEventListener("click", saveState);

resetBtn.addEventListener("click", () => {
  state.image = null;
  state.filters = structuredClone(initialFilters);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  syncUI();
  updatePlaceholder();
});

loadState();
updatePlaceholder();
