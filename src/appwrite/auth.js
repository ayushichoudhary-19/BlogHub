import conf from "../conf/conf";
import { Client, Account, ID, Databases} from 'appwrite';

export class AuthService {
    client = new Client()
    account
    users

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        this.account = new Account(this.client)
        this.users = new Databases(this.client)
    }
    async createAccount({email, password, name}){
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            if(userAccount) return this.login({email, password})
            else return userAccount
        } catch (error) {
            throw error
        }
    }

    async login({email, password}){
        try {
            return await this.account.createEmailSession(email, password)
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get()
        } catch (error) {
            console.log("Appwrite :: Get Current User :: Error::", error);
        }
        return null
    }

    async logout(){
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            console.log("Appwrite :: Logout :: Error ::", error);
        }
    }
    async getUserId() {
        const user = await this.getCurrentUser();
        return user ? user.$id: null;
    }
    async getUserDetails() {
        console.log('hi');
        const user = await this.getCurrentUser();
        console.log(user.name);
        return user;
    }
    // async getUserName(userId) {
    //     // to get list of all users in appwrite auth of the app
    //     try {
    //         const user = await this.account.list
    //         return user;
    //     } catch (error) {
    //         console.error("Error fetching user name", error);
    //     }
    // }
}

const authService = new AuthService()

export default authService