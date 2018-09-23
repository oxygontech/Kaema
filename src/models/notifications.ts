
import { Post } from '../models/post';
import { Profile } from '../models/profile';
export interface Notifications{
    
    
    title:string;
    message:string;
    notificationImageUrl:string;
    notificationType:string;
    post :Post;
    userId :string;
    date :string;
    readStatus:string;
    notify_status:string;

}