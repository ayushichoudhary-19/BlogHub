const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteBlogsCollectionId: String(import.meta.env.VITE_APPWRITE_BLOGS_COLLECTION_ID),
    appwriteLikesCollectionId: String(import.meta.env.VITE_APPWRITE_LIKES_COLLECTION_ID),
    appwriteUserProfileCollectionId: String(import.meta.env.VITE_APPWRITE_USERPROFILE_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteLikedPostsCollectionId: String(import.meta.env.VITE_APPWRITE_LIKED_POSTS_COLLECTION_ID),
}

export default conf