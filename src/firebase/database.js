// src/firebase/database.js
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  increment,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

const BLOG_COLLECTION = 'blogPosts';

// Create a new blog post
export const createBlogPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
      ...postData,
      publishDate: serverTimestamp(),
      lastModified: serverTimestamp(),
      viewCount: 0,
      likeCount: 0,
      isPublished: postData.isPublished || false,
      isMandatoryReading: postData.isMandatoryReading || false,
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Update a blog post
export const updateBlogPost = async (postId, updateData) => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    await updateDoc(docRef, {
      ...updateData,
      lastModified: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a blog post
export const deleteBlogPost = async (postId) => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    await deleteDoc(docRef);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get a single blog post
export const getBlogPost = async (postId) => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        post: { id: docSnap.id, ...docSnap.data() }, 
        error: null 
      };
    } else {
      return { post: null, error: 'Post not found' };
    }
  } catch (error) {
    return { post: null, error: error.message };
  }
};

// Get all published blog posts
export const getAllBlogPosts = async () => {
  try {
    console.log('Starting getAllBlogPosts query...');
    
    // Simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, BLOG_COLLECTION),
      where('isPublished', '==', true)
    );
    
    console.log('Executing query...');
    const querySnapshot = await getDocs(q);
    
    console.log('Query completed. Document count:', querySnapshot.size);
    
    let posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Post data:', { id: doc.id, ...data });
      return {
        id: doc.id,
        ...data
      };
    });
    
    // Sort in JavaScript instead of Firestore
    posts = posts.sort((a, b) => {
      const dateA = a.publishDate?.toDate() || new Date(0);
      const dateB = b.publishDate?.toDate() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log('Final sorted posts:', posts);
    
    return { posts, error: null };
  } catch (error) {
    console.error('Error in getAllBlogPosts:', error);
    return { posts: [], error: error.message };
  }
};


// Get recent blog posts
export const getRecentBlogPosts = async (limitCount = 5) => {
  try {
    // Simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, BLOG_COLLECTION),
      where('isPublished', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    let posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort and limit in JavaScript
    posts = posts
      .sort((a, b) => {
        const dateA = a.publishDate?.toDate() || new Date(0);
        const dateB = b.publishDate?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limitCount);
    
    return { posts, error: null };
  } catch (error) {
    return { posts: [], error: error.message };
  }
};

// Get mandatory reading posts
export const getMandatoryReadingPosts = async () => {
  try {
    // Get all published posts first, then filter for mandatory reading
    const q = query(
      collection(db, BLOG_COLLECTION),
      where('isPublished', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    let posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filter for mandatory reading and sort in JavaScript
    posts = posts
      .filter(post => post.isMandatoryReading === true)
      .sort((a, b) => {
        const dateA = a.publishDate?.toDate() || new Date(0);
        const dateB = b.publishDate?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    
    return { posts, error: null };
  } catch (error) {
    return { posts: [], error: error.message };
  }
};

// Get posts by category
export const getPostsByCategory = async (category) => {
  try {
    // Simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, BLOG_COLLECTION),
      where('isPublished', '==', true),
      where('tags', 'array-contains', category)
    );
    
    const querySnapshot = await getDocs(q);
    let posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort in JavaScript
    posts = posts.sort((a, b) => {
      const dateA = a.publishDate?.toDate() || new Date(0);
      const dateB = b.publishDate?.toDate() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return { posts, error: null };
  } catch (error) {
    return { posts: [], error: error.message };
  }
};

// Get all unique categories
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, BLOG_COLLECTION), where('isPublished', '==', true))
    );
    
    const allTags = [];
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.tags) {
        allTags.push(...data.tags);
      }
    });
    
    // Remove duplicates and sort
    const uniqueTags = [...new Set(allTags)].sort();
    
    return { categories: uniqueTags, error: null };
  } catch (error) {
    return { categories: [], error: error.message };
  }
};

// Increment view count
export const incrementViewCount = async (postId) => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    await updateDoc(docRef, {
      viewCount: increment(1)
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Increment like count
export const incrementLikeCount = async (postId) => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    await updateDoc(docRef, {
      likeCount: increment(1)
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all blog posts (including unpublished) - FOR ADMIN USE ONLY
export const getAllBlogPostsAdmin = async () => {
  try {
    console.log('Starting getAllBlogPostsAdmin query...');
    
    // Get ALL posts regardless of publish status
    const q = query(
      collection(db, BLOG_COLLECTION)
    );
    
    console.log('Executing admin query...');
    const querySnapshot = await getDocs(q);
    
    console.log('Admin query completed. Document count:', querySnapshot.size);
    
    let posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Admin post data:', { id: doc.id, ...data });
      return {
        id: doc.id,
        ...data
      };
    });
    
    // Sort by last modified date in JavaScript
    posts = posts.sort((a, b) => {
      const dateA = a.lastModified?.toDate() || new Date(0);
      const dateB = b.lastModified?.toDate() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log('Final admin posts:', posts);
    
    return { posts, error: null };
  } catch (error) {
    console.error('Error in getAllBlogPostsAdmin:', error);
    return { posts: [], error: error.message };
  }
};

// Get featured post for hero section (most recent published post)
export const getFeaturedPost = async () => {
  try {
    console.log('Getting featured post...');
    
    // Get all published posts and sort in JavaScript to avoid index issues
    const q = query(
      collection(db, BLOG_COLLECTION),
      where('isPublished', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { post: null, error: null };
    }
    
    // Get all posts and sort by publish date
    let posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort by publish date and get the most recent
    posts = posts.sort((a, b) => {
      const dateA = a.publishDate?.toDate() || new Date(0);
      const dateB = b.publishDate?.toDate() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    const post = posts[0]; // Get the most recent post
    
    console.log('Featured post:', post);
    
    return { post, error: null };
  } catch (error) {
    console.error('Error getting featured post:', error);
    return { post: null, error: error.message };
  }
};

// Convert Firestore timestamp to Date
export const timestampToDate = (timestamp) => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date();
};