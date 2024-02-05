import conf from "../conf/conf";
import { Client, Databases, ID, Query, Storage } from "appwrite";




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

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("Appwrite Service :: Create Post :: Error ::", error);
      throw error
    }
  }

  async updatePost(slug, {title,  content, featuredImage, status}){
    try {
        return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,
            {
                title,
                content,
                featuredImage,
                status,
            }
        )
    } catch (error) {
        console.log("Appwrite Service :: Update Post :: Error ::", error);
    }
  }

  async deletePost(slug){
    try {
        await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
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
            conf.appwriteCollectionId,
            slug
        )
    } catch (error) {
        console.log("Appwrite Service :: Get Post :: Error :: ", error);
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]){
    try {
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            queries
        )
    } catch (error) {
        console.log("Appwrite Service :: Get Posts :: Error :: ", error);
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
