Image Editor (HTML, CSS, JS)

A lightweight, browser-based image editor built with plain HTML, CSS, and JavaScript. Upload images, apply filters, use presets, save edits, and download images — all without frameworks.

Features

Upload images from your device.

Adjust brightness, contrast, saturation, hue rotation, blur, grayscale, sepia, and invert.

Apply presets like vintage, black & white, neon, etc.

Save edited images locally in the browser.

Download current or saved images.

Reset canvas to start fresh.

Responsive gallery for saved images.

Usage

Open index.html in your browser.

Click Choose Image to upload.

Adjust filters with sliders or click a preset.

Click Save to store edits, Download to save the image to your device.

Click saved images in the gallery to download them.

Tech

HTML – Editor UI

CSS – Layout and styling

JavaScript – Canvas rendering, filters, presets, save/download functionality



How It Works

The canvas element is used to render images with applied filters.

Filter values are updated dynamically using range sliders.

Presets apply multiple filter values at once.

Saved images are stored in localStorage for persistence across sessions.

Downloading uses the canvas.toDataURL() method.

Author

Your Name – sahul yadav

