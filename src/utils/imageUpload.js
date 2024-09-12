import { auth, storage } from '@/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

const MAX_WIDTH = 512;
const MAX_HEIGHT = 512;
const MAX_FILE_SIZE_MB = 1;
const WEBP_QUALITY = 0.5;

const convertToWebP = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Unable to get canvas context'));
          return;
        }

        canvas.width = MAX_WIDTH;
        canvas.height = MAX_HEIGHT;
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;

        ctx.drawImage(img, x, y, width, height);

        canvas.toBlob(
          (webpBlob) => {
            if (!webpBlob) {
              reject(new Error('Failed to create WebP Blob'));
              return;
            }
            resolve(webpBlob);
          },
          'image/webp',
          WEBP_QUALITY
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (file) => {
  if (!file) return null;
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated');
  }

  const compressedFile = await imageCompression(file, {
    maxSizeMB: MAX_FILE_SIZE_MB,
    maxWidthOrHeight: Math.max(MAX_WIDTH, MAX_HEIGHT),
    useWebWorker: true,
  });

  const optimizedFile = await convertToWebP(compressedFile);

  const fileName = `${Date.now()}_${file.name.split('.')[0]}.webp`;
  const storageRef = ref(storage, `products/${fileName}`);

  const metadata = {
    contentType: 'image/webp',
    cacheControl: 'public, max-age=31536000',
    customMetadata: {
      optimized: 'true',
      'original-size': `${file.size}`,
      'compressed-size': `${optimizedFile.size}`,
    },
  };

  await uploadBytes(storageRef, optimizedFile, metadata);
  return getDownloadURL(storageRef);
};
