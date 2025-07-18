// src/firebase/storage.js
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from './config';

// Upload image to Firebase Storage
export const uploadImage = async (file, path = 'blog-images') => {
  try {
    // Create a unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { 
      url: downloadURL, 
      path: snapshot.ref.fullPath,
      error: null 
    };
  } catch (error) {
    return { 
      url: null, 
      path: null,
      error: error.message 
    };
  }
};

// Delete image from Firebase Storage
export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, path = 'blog-images') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, path));
    const results = await Promise.all(uploadPromises);
    
    const successfulUploads = results.filter(result => result.error === null);
    const errors = results.filter(result => result.error !== null);
    
    return {
      uploads: successfulUploads,
      errors: errors,
      success: errors.length === 0
    };
  } catch (error) {
    return {
      uploads: [],
      errors: [{ error: error.message }],
      success: false
    };
  }
};