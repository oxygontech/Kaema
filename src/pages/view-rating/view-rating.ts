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


  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase) {

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

    let tempReviewArr=[];
    let  reviewSubscription =  this.afDatabase.list('review_history_user/'+this.ratingUser,{
                         query :{orderByKey:true,
                           limitToLast:this.batch}
                       }).subscribe(reviewResult=>{
 
                       
                       this.lastKey=reviewResult[0].$key;
                       tempReviewArr =reviewResult.reverse();
 
                       if(reviewResult.length==this.batch){
                         this.dataFinished=false;
                       }else{
                         this.dataFinished=true;
                       }

                      let i=0;
                      console.log('initial');
                      console.log(tempReviewArr);
                      for(let item of tempReviewArr)  {
                        let  profileSubscription =  this.afDatabase.object('profile/'+item.userId).subscribe(profileResult=>{
                             
                               let tempReview ={} as userReview;
                               tempReview.userId=item.userId;
                               tempReview.star=item.star;
                               tempReview.review=item.review;
                               tempReview.userProfile=profileResult;

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
      
      let tempReviewArr=[];
      let  reviewSubscription =  this.afDatabase.list('review_history_user/'+this.ratingUser,{
        query :{
          orderByKey:true,
          limitToLast:(this.batch+1),
          endAt:this.lastKey
          
         }
      }).subscribe(reviewResult=>{
 
                     let i=0;

                       
                       tempReviewArr =reviewResult.reverse();
 
                       console.log('scroll');
                       console.log(tempReviewArr);
                     for (let item of tempReviewArr){
                       if(i!=0){//not the first element,Because first element has already been added to Post List
                        let  profileSubscription =  this.afDatabase.object('profile/'+item.userId).subscribe(profileResult=>{
                             
                          
                          let tempReview ={} as userReview;
                          tempReview.userId=item.userId;
                          tempReview.star=item.star;
                          tempReview.review=item.review;
                          tempReview.userProfile=profileResult;

                          
                          this.userReviews.push(tempReview);
                          profileSubscription.unsubscribe();
                          i++;
                      });

                      if(reviewResult[0].$key==this.lastKey){
                        this.dataFinished=true;
                      }else{
                        this.lastKey=reviewResult[0].$key;
                      }


                       }else{
                         i++;
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
