import conf from "../conf/conf";
import { Client, Databases, ID, Query, Storage } from "appwrite";
import authService from './auth.js'; 

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId, author, likes = 0}) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBlogsCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
          author,
          likes
        }
      );
    } catch (error) {
      console.log("Appwrite Service :: Create Post :: Error ::", error);
      throw error
    }
  }

  async updatePost(slug, {title,  content, featuredImage, status, author, likes}){
    try {
        return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteBlogsCollectionId,
            slug,
            {
                title,
                content,
                featuredImage,
                status,
                author 
            }
        )
    } catch (error) {
        console.log("Appwrite Service :: Update Post :: Error ::", error);
    }
  }

  async deletePost(slug){
    try {
        await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteBlogsCollectionId, slug)
        return true
    } catch (error) {
        console.log("Appwrite Service :: Delete Post :: Error :: ", error);
        return false
    }
  }

  async getPost(slug){
    try {
        return await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteBlogsCollectionId,
            slug
        )
    } catch (error) {
        console.log("Appwrite Service :: Get Post :: Error :: ", error);
        throw error;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]){
    try {
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteBlogsCollectionId,
            queries
        )
    } catch (error) {
        console.log("Appwrite Service :: Get Posts :: Error :: ", error);
        throw error;
    }
  }
  async createLike(postId) {
    const userId = await authService.getUserId();
    //taking last 5 characters of the userId and adding it to the postId to create a unique likeId
    const lastFiveChars = userId.slice(-5);
    const likeId = `${lastFiveChars}_${postId}`;
    try {
        // Check if the like already exists
        const likeExists = await this.getLikesByUserAndPost(userId, postId);
        if (likeExists) {
            return;
        } else {
            // Like doesn't exist, proceed to create it
            await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                likeId,
                {
                    likeId,
                    userId,
                    postId
                }
            );
            
            // Increment likes count in the blog post document
            const post = await this.getPost(postId);
            const currentLikes = post.likes || 0;
            const newLikesCount = currentLikes + 1;
            await this.databases.updateDocument(
              conf.appwriteDatabaseId,
              conf.appwriteBlogsCollectionId,
              postId,
              { likes: newLikesCount}
               
          );
        }
    } catch (error) {
        console.log("Appwrite Service :: Create Like :: Error ::", error);
        throw error;
    }
}


async deleteLike(likeId) {
    try {
        await this.databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteLikesCollectionId,
            likeId
        );
        const postId = likeId.split("_")[1];
        const post = await this.getPost(postId);
        const currentLikes = post.likes || 0;

        // Decrement likes count by 1
        const newLikesCount = Math.max(currentLikes - 1, 0);

        // Update likes count in the blog post document
        await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteBlogsCollectionId,
            postId,
            { likes: newLikesCount } 
        );
    } catch (error) {
        console.log("Appwrite Service :: Delete Like :: Error :: ", error);
        throw error;
    }
}

async getLikesByUserAndPost(userId, postId) {
  try {
      const query = [
          Query.equal("userId", userId),
          Query.equal("postId", postId)
      ];
      const result = await this.databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteLikesCollectionId,
          query
      );

      // Check if any likes were found
      if (result.documents.length > 0) {
          return true; // Return true if likes exist for the given user and post
      } else {
          return false; // Return false if no likes were found
      }
  } catch (error) {
      console.log("Appwrite Service :: Get Likes By User And Post :: Error :: ", error);
      throw error; 
  }
}

  // upload file
  async uploadFile(file){
    try {
        return await this.bucket.createFile(
            conf.appwriteBucketId,
            ID.unique(),
            file
        )
    } catch (error) {
        console.log("Appwrite Service :: Upload File :: Error :: ", error);
        return false
    }
  }

  async deleteFile(fileId){
    try {
        await this.bucket.deleteFile(
            conf.appwriteBucketId,
            fileId
        )
        return true
    } catch (error) {
        console.log("Appwrite Service :: Delete File :: Error :: ", error);
        return false
    }
  }

  getFilePreview(fileId){
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId)
  }

  
}
const service = new Service();
export default service;
