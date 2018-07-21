import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { InterfaceProvider } from '../../providers/interface/interface';
import { LoginPage } from '../login/login';
import { userRatingSummary,userReview } from '../../models/user-rating-summary';
import { AlertController } from 'ionic-angular';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';
/**
 * Generated class for the UserRatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-rating',
  templateUrl: 'user-rating.html',
})
export class UserRatingPage {

  postUserProfile = {} as Profile;
  userProfile= {} as Profile;
  user ={} as User;
  review : string;
  rate   :any;
  userRatingSummary = {} as userRatingSummary;
  postRatingSummary = {} as userRatingSummary;
  userReview = {} as userReview;
  postUser : string;
  postId : string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afDatabase : AngularFireDatabase,private afAuth:AngularFireAuth
              ,public interfac: InterfaceProvider,private alertCtrl:AlertController
              ,private eventLogger :EventLoggerProvider) {


     //presenting loader
     let loader=interfac.presentLoadingDefault();
     loader.present();
     
     if(this.navParams.get('postId')!=null){
       this.postId=this.navParams.get('postId');
     }
     this.userRatingSummary.ratings=0;
     this.userRatingSummary.stars=0;
     this.userRatingSummary.star_5=0;
     this.userRatingSummary.star_4=0;
     this.userRatingSummary.star_3=0;
     this.userRatingSummary.star_2=0;
     this.userRatingSummary.star_1=0;


     this.postRatingSummary.ratings=0;
     this.postRatingSummary.stars=0;
     this.postRatingSummary.star_5=0;
     this.postRatingSummary.star_4=0;
     this.postRatingSummary.star_3=0;
     this.postRatingSummary.star_2=0;
     this.postRatingSummary.star_1=0;
    
     console.log(this.navParams.get('postUser'));

    this.afAuth.authState.subscribe(userResult=>{
      
      if(userResult.uid){
        this.user.uId=userResult.uid;

        this.afDatabase.object('profile/'+this.user.uId).subscribe(result=>{
          this.userProfile=result;        
        });
        this.getPostUserProfile().then(()=>{
          loader.dismiss();
        })
      }else{
        loader.dismiss();
        this.navCtrl.setRoot(LoginPage);
      }
      
    })
  }


//getting the post enetered user's profile data and rating summary
  async  getPostUserProfile () {
        if(this.navParams.get('postUser')!=null){
          this.postUser=this.navParams.get('postUser');

          this.afDatabase.object('profile/'+this.postUser).subscribe(result=>{

            this.postUserProfile=result;
            this.afDatabase.object('ratings_user/'+this.postUser).subscribe(ratingResult=>{

              //console.log(ratingResult.star);

              if(ratingResult.length != 0 && ratingResult.stars>0){
                this.userRatingSummary=ratingResult;
                    this.afDatabase.object('ratings_post/'+this.postUser).subscribe(postRatingResult=>{
                      if(postRatingResult.length != 0 && postRatingResult.stars>0){
                        this.postRatingSummary=postRatingResult;
                      }
                     })
              }
                   
            })
          });

         
      }
    }

    //skipping the rating process
    skipRating(){
      this.eventLogger.buttonClickLogger('skip_rating');//analaytic data collection
      this.navCtrl.pop();
    }

    //validating the review details
   validateInputs(){

   
    if(this.review==''||this.review==null){
      this.interfac.presentToast('Please Enter a review');
      return false;
    
     }else if(this.rate==0||this.rate==null){
      this.interfac.presentToast('Please Enter a rating');
      return false;

     }else{
      return true;
    }

    }

    //saving the rating details

    saveRating(){
      if(this.validateInputs()){//validating data before proceeding with the save
       this.confirmSave();
      }else{
        this.eventLogger.inputRejection('post_review');//analaytic data collection
      }
    }


    confirmSave(){

      let confirm = this.alertCtrl.create({
        title: 'Confirm Review',
        message: 'Are you sure you want the post this review ? this cannot be removed later ',
        buttons: [
          {
            text: 'Yes',
            handler: () => {

              let loader=this.interfac.presentLoadingDefault();
              loader.present();

              this.userRatingSummary.stars=this.userRatingSummary.stars+this.rate;
              this.userRatingSummary.ratings++;

              this.postRatingSummary.stars=this.postRatingSummary.stars+this.rate;
              this.postRatingSummary.ratings++;

               if(this.rate==1){
                 this.userRatingSummary.star_1++;
                 this.postRatingSummary.star_1++;
               }else if(this.rate==2){
                this.userRatingSummary.star_2++;
                this.postRatingSummary.star_2++;
               }else if(this.rate==3){
                this.userRatingSummary.star_3++;
                this.postRatingSummary.star_3++;
               }else if(this.rate==4){
                this.userRatingSummary.star_4++;
                this.postRatingSummary.star_4++;
              }else if(this.rate==5){
                this.userRatingSummary.star_5++;
                this.postRatingSummary.star_5++;
              }
      
              this.userReview.review=this.review;
              this.userReview.star=this.rate;
              this.userReview.userId=this.user.uId;
              
      
              console.log(this.userRatingSummary);
            this.afDatabase.object('ratings_user/'+this.postUser).set(this.userRatingSummary).then(()=>{
                this.afDatabase.object('ratings_post/'+this.postId).set(this.postRatingSummary).then(()=>{
                    this.afDatabase.list('review_history_user/'+this.postUser).push(this.userReview).then(()=>{
                        this.afDatabase.list('review_history_post/'+this.postUser).push(this.userReview).then(()=>{
                        loader.dismiss();
                        this.interfac.presentToast('Review has been posted');
                        this.navCtrl.pop();
                      })
                    })
                  });
              });

            }
          },
          {
            text: 'No',
            handler: () => {
             
            }
          }
        ]
      });
      confirm.present();
      
      
      }
    
}
