import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { userRatingSummary, userReview } from '../../models/user-rating-summary';
import { Profile } from '../../models/profile';

/**
 * Generated class for the ViewRatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-rating',
  templateUrl: 'view-rating.html',
})
export class ViewRatingPage {

  userRating : number; 
  userRatingSummary = {} as userRatingSummary;
  ratingUser :string;
  ratingUserProfile ={} as Profile;
  batch=3;
  dataFinished=false;
  lastKey:any;
  userReviews=[];
  currentDate :String;


  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase) {

    this.currentDate=(new Date()).toDateString();
    this.getUserRating();
  }

 
  async getUserRating(){
    if(this.navParams.get('postUser')!=null){
      this.ratingUser=this.navParams.get('postUser');
    this.afDatabase.object('profile/'+this.ratingUser).subscribe(result=>{

      this.ratingUserProfile=result;

      this.afDatabase.object('ratings_user/'+this.ratingUser).subscribe(ratingResult=>{
        if(ratingResult.length != 0 && ratingResult.ratings!=null){
          this.userRating=(Math.round((ratingResult.stars/ratingResult.ratings)*10))/10;//getting result to once decimal place
          this.userRatingSummary=ratingResult;

          this.loadReviews();
        
        }else{
          this.userRating=0.0;
          this.userRatingSummary.ratings=0;
          this.userRatingSummary.stars=0;
          this.userRatingSummary.star_5=0;
          this.userRatingSummary.star_4=0;
          this.userRatingSummary.star_3=0;
          this.userRatingSummary.star_2=0;
          this.userRatingSummary.star_1=0;
        }
             
      })

    })

    }
  }

//loading reviews entered by other User
  async  loadReviews(){

  
    let  reviewSubscription =  this.afDatabase.list('review_history_user/'+this.ratingUser,{
                         query :{orderByKey:true,
                           limitToLast:this.batch}
                       }).subscribe(reviewResult=>{
 
                       
                       this.lastKey=reviewResult[0].$key;
                       reviewResult.reverse();
 
                       if(reviewResult.length==this.batch){
                         this.dataFinished=false;
                       }else{
                         this.dataFinished=true;
                       }

                      let i=0;

                      for(let item of reviewResult)  {
                        let  profileSubscription =  this.afDatabase.object('profile/'+item.userId).subscribe(profileResult=>{
                             
                               let tempReview ={} as userReview;
                               tempReview.userId=item.userId;
                               tempReview.star=item.star;
                               tempReview.review=item.review;
                               tempReview.userProfile=profileResult;
                               tempReview.reviewDate=item.reviewDate;
                               tempReview.reviewTime=item.reviewTime;

                               this.userReviews.push(tempReview);
                               profileSubscription.unsubscribe();
                               i++;
                        });

                      }
                       reviewSubscription.unsubscribe();//removing realtime link to firebase
                       });
 
   //Removing the realtime link to firebase DB             
 
   }

   async scrollDown(infiniteScroll){

    if(!this.dataFinished) {
      
      
      let  reviewSubscription =  this.afDatabase.list('review_history_user/'+this.ratingUser,{
        query :{
          orderByKey:true,
          limitToLast:(this.batch+1),
          endAt:this.lastKey
          
         }
      }).subscribe(reviewResult=>{
 
                     let i=0;

                       
                      console.log(reviewResult);
                       if(reviewResult[0].$key==this.lastKey){
                        this.dataFinished=true;
                       console.log('Data finish'+reviewResult[0].$key+' Last key '+this.lastKey);
                      }else{

                        
                        this.lastKey=reviewResult[0].$key;
                        reviewResult.reverse();
                        for (let item of reviewResult){
                          if(i!=0){//not the first element,Because first element has already been added to Post List
                           let  profileSubscription =  this.afDatabase.object('profile/'+item.userId).subscribe(profileResult=>{
                                
                             
                             let tempReview ={} as userReview;
                             tempReview.userId=item.userId;
                             tempReview.star=item.star;
                             tempReview.review=item.review;
                             tempReview.userProfile=profileResult;
                             tempReview.reviewDate=item.reviewDate;
                             tempReview.reviewTime=item.reviewTime;
                             
                             this.userReviews.push(tempReview);
                             profileSubscription.unsubscribe();
                             i++;
                         });
                          }else{
                            i++;
                          }
                        }
                        

                      }
                       
                      infiniteScroll.complete();
                      reviewSubscription.unsubscribe(); //removing realtime link to firebase
 
                     
                        
                         });
 
                        
       }else{
         infiniteScroll.complete();
       }
     }
}
