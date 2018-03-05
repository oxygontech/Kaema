
import { Post } from '../models/post';
import { Profile } from '../models/profile';
export interface Shared{
    
    
    sharedUser:string;
    receivedUser:string;
    receivedUserProfile:Profile;
    post:Post;
    

}