/**
 * Image Handler - Handles Base64 image conversion, storage, and loading
 * Works with both admin dashboard and website product display
 */

class ImageHandler {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    }

    /**
     * Convert File to Base64 string
     * @param {File} file - The file to convert
     * @returns {Promise<string>} Base64 string
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            // Validate file size
            if (file.size > this.maxFileSize) {
                reject(new Error('File size exceeds 5MB limit'));
                return;
            }

            // Validate MIME type
            if (!this.validMimeTypes.includes(file.type)) {
                reject(new Error('Invalid file type. Please upload an image (JPG, PNG, WebP, GIF)'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = () => {
                resolve(reader.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * Compress image before storing (optional)
     * @param {string} base64String - Base64 image string
     * @param {number} quality - Compression quality (0-1)
     * @returns {Promise<string>} Compressed Base64 string
     */
    compressImage(base64String, quality = 0.8) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64String;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.drawImage(img, 0, 0);
                
                // Convert to JPEG with specified quality
                const compressed = canvas.toDataURL('image/jpeg', quality);
                resolve(compressed);
            };
            
            // If image fails to load, return original
            img.onerror = () => {
                resolve(base64String);
            };
        });
    }

    /**
     * Get file size in MB
     * @param {string} base64String - Base64 string
     * @returns {number} Size in MB
     */
    getBase64Size(base64String) {
        return (base64String.length * 0.75) / (1024 * 1024);
    }

    /**
     * Validate Base64 image string
     * @param {string} base64String - Base64 string to validate
     * @returns {boolean} True if valid
     */
    isValidBase64Image(base64String) {
        if (!base64String || typeof base64String !== 'string') {
            return false;
        }
        
        // Check if it's a valid data URL
        if (base64String.startsWith('data:image/')) {
            return true;
        }
        
        // Check if it looks like Base64 (though this is less reliable)
        return /^[A-Za-z0-9+/=]+$/.test(base64String);
    }

    /**
     * Load and display image in an img element
     * @param {HTMLImageElement} imgElement - The img element
     * @param {string} imageSrc - Base64 string or URL
     * @param {Function} onSuccess - Callback on success
     * @param {Function} onError - Callback on error
     */
    loadImage(imgElement, imageSrc, onSuccess, onError) {
        if (!imgElement || !imageSrc) {
            if (onError) onError(new Error('Missing image element or source'));
            return;
        }

        imgElement.onload = () => {
            if (onSuccess) onSuccess();
        };

        imgElement.onerror = () => {
            console.warn(`Failed to load image: ${imageSrc.substring(0, 50)}...`);
            if (onError) onError(new Error('Failed to load image'));
        };

        imgElement.src = imageSrc;
    }

    /**
     * Convert Base64 to Blob for download
     * @param {string} base64String - Base64 string
     * @param {string} mimeType - MIME type
     * @returns {Blob}
     */
    base64ToBlob(base64String, mimeType = 'image/jpeg') {
        const bstr = atob(base64String.split(',')[1] || base64String);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }
        
        return new Blob([u8arr], { type: mimeType });
    }

    /**
     * Download Base64 image
     * @param {string} base64String - Base64 string
     * @param {string} filename - Output filename
     */
    downloadImage(base64String, filename = 'image.jpg') {
        const blob = this.base64ToBlob(base64String);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    /**
     * Get image metadata (dimensions, file size, etc.)
     * @param {string} base64String - Base64 string
     * @returns {Promise<Object>} Metadata object
     */
    getImageMetadata(base64String) {
        return new Promise((resolve, reject) => {
            if (!this.isValidBase64Image(base64String)) {
                reject(new Error('Invalid Base64 image'));
                return;
            }

            const img = new Image();
            img.src = base64String;

            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    aspectRatio: img.width / img.height,
                    size: this.getBase64Size(base64String),
                    type: base64String.match(/data:image\/(\w+);/)?.[1] || 'unknown'
                });
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
        });
    }
}

// Create global instance
const imageHandler = new ImageHandler();
