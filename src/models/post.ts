import { Location } from '../models/location';
import { Profile } from '../models/profile';

export interface Post{
    
    subject:string;
    description:string;
    userId :string;
    servings  :number;
    shares :number;
    views :number;
    daysAvailable:string;
    imageURL:any;
    location:Location;
    pickUpTime:string;
    postType:string;
    entDate:string;
    status:string;
    userProfile:Profile;
    postId:string;

    
    

}
