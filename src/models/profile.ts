import { Location } from '../models/location';

export interface Profile{
    
    username:string;
    email:string;
    firstName :string;
    lastName  :string;
    userPhotoURL:string;
    bio:string;
    website:string;
    phoneNumber:string;
    location:Location;
    

}



