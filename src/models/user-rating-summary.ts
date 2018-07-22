import { Profile } from "./profile";

export interface userRatingSummary{
    
    
   stars   : number;
   ratings : number;
   star_5  : number;
   star_4  : number;
   star_3  : number;
   star_2  : number;
   star_1  : number;
    

}

export interface userReview{
    
    review :string;
    star   :number;
    userId : string;
    userProfile :Profile
    reviewDate :String;
    reviewTime :String;
     
 
 }



