import { Location } from '../models/location';

export interface Post{
    
    subject:string;
    description:string;
    userId :string;
    servings  :string;
    daysAvailable:string;
    imageURL:string;
    location:Location;
    pickUpTime:string;
    postType:string;
    entDate:string;
    status:string;

    
    

}
