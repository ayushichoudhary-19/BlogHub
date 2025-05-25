import conf from "../conf/conf";
import { Client, Databases, ID, Query, Storage } from "appwrite";
import authService from "./auth.js";
import { getCache, setCache } from "../utils/cache";

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

  async createPost({
    title,
    slug,
    content,
    // featuredImage,
    status,
    userId,
    author,
    likes = 0,
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBlogsCollectionId,
        slug,
        {
          title,
          content,
          // featuredImage,
          status,
          userId,
          author,
          likes,
        }
      );
    } catch (error) {
      console.log("Appwrite Service :: Create Post :: Error ::", error);
      throw error;
    }
  }

  async updatePost(
    slug,
    {
      title,
      content,
      // featuredImage,
      status,
      author,
      likes,
    }
  ) {
    try {
      sessionStorage.removeItem(`user-about-${userId}`);
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBlogsCollectionId,
        slug,
        {
          title,
          content,
          // featuredImage,
          status,
          author,
        }
      );
    } catch (error) {
      console.log("Appwrite Service :: Update Post :: Error ::", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBlogsCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite Service :: Delete Post :: Error :: ", error);
      return false;
    }
  }

  async getPost(slug) {
    const cacheKey = `post-${slug}`;
    const cached = getCache(cacheKey, 5 * 60 * 1000);
    if (cached) return cached;

    try {
      const post = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBlogsCollectionId,
        slug
      );
      setCache(cacheKey, post);
      return post;
    } catch (error) {
      console.log("Appwrite Service :: Get Post :: Error :: ", error);
      throw error;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    const cacheKey = `posts-active`;
    const cached = getCache(cacheKey, 3 * 60 * 1000);
    if (cached) return cached;

    try {
      const result = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteBlogsCollectionId,
        queries
      );
      setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.log("Appwrite Service :: Get Posts :: Error :: ", error);
      throw error;
    }
  }

  async getLikedPosts(userId) {
    try {
      const query = [Query.equal("userId", userId)];
      const res = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikedPostsCollectionId,
        query
      );
      return res;
    } catch (error) {
      console.log("Appwrite Service :: Get Liked Posts :: Error :: ", error);
      throw error;
    }
  }

  async createLike(postId) {
    const userId = await authService.getUserId();
    const lastFiveChars = userId.slice(-5);
    const likeId = `${lastFiveChars}_${postId}`;
    try {
      const likeExists = await this.getLikesByUserAndPost(userId, postId);
      if (likeExists) {
        return;
      }
      await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        likeId,
        {
          likeId,
          userId,
          postId,
        }
      );

      await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBlogsCollectionId,
        postId,
        { likes: this.databases.increment(1) }
      );

      await this.addPostToUsersLiked(postId, userId);

      return true;
    } catch (error) {
      console.log("Appwrite Service :: Create Like :: Error ::", error);
      throw error;
    }
  }

  async addPostToUsersLiked(postId, userId) {
    try {
      await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikedPostsCollectionId,
        `${userId}_${postId}`,
        {
          userId,
          postId,
        }
      );
    } catch (error) {
      console.log(
        "Appwrite Service :: Add Post To Users Liked :: Error :: ",
        error
      );
    }
  }

  async deleteLike(likeId) {
    try {
      const postId = likeId.split("_")[1];
      const userId = await authService.getUserId();

      await Promise.all([
        this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwriteLikesCollectionId,
          likeId
        ),

        this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteBlogsCollectionId,
          postId,
          { likes: this.databases.decrement(1) }
        ),

        this.removePostFromUsersLiked(postId, userId),
      ]);

      return true;
    } catch (error) {
      console.log("Appwrite Service :: Delete Like :: Error :: ", error);
      throw error;
    }
  }

  async removePostFromUsersLiked(postId, userId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikedPostsCollectionId,
        `${userId}_${postId}`
      );
    } catch (error) {
      console.log(
        "Appwrite Service :: Remove Post From Users Liked :: Error :: ",
        error
      );
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

      const newLikesCount = Math.max(currentLikes - 1, 0);

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

  async displaylikes(postId) {
    console.log(postId);
    try {
      const query = [Query.equal("postId", postId)];

      const result = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        query
      );

      return result.documents.map((user) => user.userId);
    } catch (error) {
      console.log("Error showing usernames");
    }
  }

  async getLikesByUserAndPost(userId, postId) {
    try {
      const query = [
        Query.equal("userId", userId),
        Query.equal("postId", postId),
      ];
      const result = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        query
      );

      if (result.documents.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(
        "Appwrite Service :: Get Likes By User And Post :: Error :: ",
        error
      );
      throw error;
    }
  }

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite Service :: Upload File :: Error :: ", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite Service :: Delete File :: Error :: ", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
  }

  async getUserAbouts(userId) {
    const cacheKey = `user-about-${userId}`;
    const cached = getCache(cacheKey, 10 * 60 * 1000);
    if (cached) return cached;

    try {
      const data = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserProfileCollectionId,
        userId
      );
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.log("Appwrite Service :: Get User Profile :: Error :: ", error);
      throw error;
    }
  }

  async createUserAbouts(userId, location, aboutMe) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserProfileCollectionId,
        userId,
        {
          userId: userId,
          location: location,
          About: aboutMe,
        }
      );
    } catch (error) {
      console.log(
        "Appwrite Service :: Create User Profile :: Error :: ",
        error
      );
      throw error;
    }
  }

  async updateUserAbouts(userId, location, aboutMe) {
    try {
      const document = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserProfileCollectionId,
        userId
      );

      if (document) {
        document.About = aboutMe;
        document.location = location;
        console.log("Updating", document);
        sessionStorage.removeItem(`post-${slug}`);
        await this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteUserProfileCollectionId,
          userId,
          {
            About: aboutMe,
            location: location,
          }
        );
      } else {
        console.log("Document not found for the user ID:", userId);
      }
    } catch (error) {
      console.log("Appwrite Service :: Update Post :: Error ::", error);
    }
  }
}
const service = new Service();
export default service;
