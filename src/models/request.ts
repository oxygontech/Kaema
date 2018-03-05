
import { Post } from '../models/post';
import { Profile } from '../models/profile';
export interface Request{
    
    
    postedUser:string;
    requestedUser:string;
    requestedUserProfile:Profile;
    post:Post;
    status:string;
    

}