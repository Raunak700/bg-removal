document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalImage = document.getElementById('originalImage');
    const processedImage = document.getElementById('processedImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const loading = document.getElementById('loading');

    // Check if the library is loaded
    if (typeof window.backgroundRemoval === 'undefined') {
        alert('Error: Background removal library is not loaded. Please refresh the page and try again.');
        return;
    }

    // Handle drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ccc';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ccc';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImage(file);
        } else {
            alert('Please upload a valid image file.');
        }
    });

    // Handle click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                handleImage(file);
            } else {
                alert('Please upload a valid image file.');
            }
        }
    });

    // Handle image processing
    async function handleImage(file) {
        try {
            loading.style.display = 'block';
            dropZone.style.display = 'none';

            // Display original image
            const originalUrl = URL.createObjectURL(file);
            originalImage.src = originalUrl;

            // Convert file to blob URL
            const blob = new Blob([await file.arrayBuffer()], { type: file.type });
            const blobUrl = URL.createObjectURL(blob);

            // Process image using background-removal
            const processedBlob = await window.backgroundRemoval.removeBackground(blobUrl, {
                progress: (key, current, total) => {
                    console.log(`Processing ${key}: ${current} of ${total}`);
                }
            });

            const processedUrl = URL.createObjectURL(processedBlob);
            processedImage.src = processedUrl;

            // Show preview container
            previewContainer.style.display = 'block';

            // Setup download button
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = processedUrl;
                link.download = 'processed-image.png';
                link.click();
            };

        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image. Please make sure the image is valid and try again. Error: ' + error.message);
            // Reset the UI
            loading.style.display = 'none';
            dropZone.style.display = 'block';
            previewContainer.style.display = 'none';
        } finally {
            loading.style.display = 'none';
        }
    }

    // Handle reset button
    resetBtn.addEventListener('click', () => {
        previewContainer.style.display = 'none';
        dropZone.style.display = 'block';
        fileInput.value = '';
        originalImage.src = '';
        processedImage.src = '';
    });
}); 