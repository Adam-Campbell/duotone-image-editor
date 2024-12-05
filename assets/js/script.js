
const fileInput = document.getElementById('file-input');
const previewCanvas = document.getElementById('preview-canvas');
const previewCtx = previewCanvas.getContext('2d');


// When the user uploads an image, display it on the canvas
fileInput.addEventListener('change', (e) => {
    // Grab the first File object from FileList
    const imageFile = e.target.files[0];
    if (imageFile) {
        const imageURL = URL.createObjectURL(imageFile);
        const img = new Image();
        img.src = imageURL;
        img.onload = () => {
            // todo: instead of using images natural width and height, scale so that max(width, height) is
            // below some threshold.
            previewCanvas.width = img.width;
            previewCanvas.height = img.height;
            previewCtx.drawImage(img, 0, 0);
            // todo: add full size image into offscreen canvas, then call URL.revokeObjectURL(imageURL) to clean up
        };
    }
    
 });



