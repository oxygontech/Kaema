import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { Profile } from '../../models/profile';
import { Request } from '../../models/request';
import { Shared } from '../../models/shared';
import { LoginPage } from '../login/login';
import { InterfaceProvider } from '../../providers/interface/interface';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase}  from 'angularfire2/database-deprecated';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { WebServiceProvider } from '../../providers/web-service/web-service';
import { ProfileStats } from '../../models/profile_stats';
import { Notifications } from '../../models/notifications';

import { AlertController } from 'ionic-angular';
import { ChatMessagePage } from '../chat-message/chat-message';

import {MAP_API_KEY} from '../../app/app.config';
import { UserRatingPage } from '../user-rating/user-rating';
import { ViewRatingPage } from '../view-rating/view-rating';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';
/**
 * Generated class for the ViewPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-post',
  templateUrl: 'view-post.html',
})
export class ViewPostPage {

  /**
   * 
   * 
   * ******************HCI ISSUES*****************
   * 1.User's do not have proper idea if the post is still available or not -Resolved (Serving updated to refelect the number
   *    of servings left).
   * 2.User's do have proper way to tell the user who added the post that they want it. -Resolved (Request option implemented so that
   *   user can request for the post and once approved can receive it)
   * 3.Users cannot contact the post user directly which will increase the user's confidence in the app -Pending(User chat wil be 
   *    implemented in a future iteration)
   * 4.User's do not properly understand the process which needs to be followed to share a food item -Pending (User guidance mechanism
   *   will be studied and implemneted in future a iteration)
   * 
   * 
   * ***************SECURITY RISK*************
   * 1.User interface is different for normal users and User who added the post(admin access),Normal users should not admin get access 
   *  (User interface implemneted along with variables to prevent any such occurence)
   * 
   */

  post ={} as Post;
  tempPost={} as Post;
  locationImage:any;
  qrImage:any;
  user ={} as User;
  hiddenText :any;
  request={} as Request;
  shared={} as Shared;
  requestStatus =false;
  profile ={} as Profile;
  servesRemaning=0;
  profile_stats_share={} as ProfileStats;
  profile_stats_receive={} as ProfileStats;
  userRating : number; 

  showQrCode=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase,
              private afAuth:AngularFireAuth,private barcodeScanner: BarcodeScanner,public interfac: InterfaceProvider
              ,private webService : WebServiceProvider,private alertCtrl:AlertController
              ,private eventLogger :EventLoggerProvider) {

                //presenting loader
       let loader=interfac.presentLoadingDefault();
       loader.present();

       //checking user authorization
       this.afAuth.authState.subscribe(userResult=>{
      

        
          if(userResult.uid){
            this.user.uId=userResult.uid;

               //getting the post details from firebase
             this.getPostDetails().then(()=>{

            //getting profile stats of current user

            this.afDatabase.object('profile/'+this.user.uId).subscribe(result=>{

               this.profile=result;

               this.afDatabase.object('profile_stats/'+this.post.userId).subscribe(share_stat=>{
                this.profile_stats_share=share_stat;
                });
      
                this.afDatabase.object('profile_stats/'+this.user.uId).subscribe(receive_stat=>{
                this.profile_stats_receive=receive_stat;
                
                this.getUserRating();//setting user rating value through this functions
                loader.dismiss();
                });
               this.webService.sharePost().then(dataset=>{
                 
                  
               });

            });


            });
          
            
          }else{
            loader.dismiss();
            this.navCtrl.setRoot(LoginPage);
          }
    
        });
  }

  getUserRating(){
    this.afDatabase.object('ratings/'+this.post.userId).subscribe(ratingResult=>{
      if(ratingResult.length != 0 && ratingResult!=null){
        this.userRating=(Math.round((ratingResult.stars/ratingResult.ratings)*10))/10;//getting result to once decimal place
       //this.userRating=ratingResult.stars/ratingResult.ratings;
      }else{
        this.userRating=0.0;
      }
           
    })

  }

  rateUser(){
    this.navCtrl.push(UserRatingPage,{postUser:this.post.userId});
  }

  showRating(){
    this.navCtrl.push(ViewRatingPage,{postUser:this.post.userId});
  }

  ionViewDidEnter() {
   if (this.post!=null){
      try{
        this.postView();
      }catch(err){
        
      }
  }
   
  }

  //getting the post details from firebase
  async getPostDetails(){

    //getting post id from values passed when opening this page
    if(this.navParams.get('post')!=null){
      this.tempPost=this.navParams.get('post');
      

     await this.afDatabase.object('post/'+this.tempPost.postId).subscribe(result=>{
        this.post=result;

        //setting up location image 
        this.locationImage='https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=600x300&maptype=roadmap'+
        '&markers=color:red%7Clabel:C%7C'+this.post.location.latitude+','+this.post.location.longitude+
        '&key='+MAP_API_KEY;
  
        this.qrImage=this.post.postId;
        this.servesRemaning=+this.post.servings-(+this.post.shares);

        //checking if the current user has sent a request for this post
        this.afDatabase.list('request/'+this.user.uId+'_'+this.post.postId).subscribe(result=>{
                   
          

          if(result.length>0){
            this.requestStatus=true;
            
          }
        });
     });


     
      //console.log(this.servesRemaning);
      //console.log(this.post.servings);
      //console.log(this.post.shares);
      }

  }

//implementation qr code scanner
  async scanCode() {
      //initialising the scanner
      let notification ={} as Notifications;
      let receivedNotification ={} as Notifications;
      this.barcodeScanner.scan().then(barcodeData => {
      this.hiddenText = barcodeData.text;

      this.eventLogger.buttonClickLogger('scan_code');//analaytic data collection
      //check if the hidden code is equal to the post Id,if true share allowed
      if(barcodeData.text==this.post.postId){



        let loader= this.interfac.presentLoadingDefault();
        loader.present();
    
        //setting up data reuired for share to take place
        this.shared.receivedUser=this.user.uId;
        this.shared.receivedUserProfile=this.profile;
        this.shared.sharedUser=this.post.userId;
        this.shared.post=this.post;
        this.shared.scoreStatus='N';
        this.post.shares=+this.post.shares+1;
       

        notification.title='Food Shared ';
        notification.message='You shared '+this.post.subject+' with '+this.shared.receivedUserProfile.firstName;
        notification.notificationType='share';
        notification.notificationImageUrl=this.post.imageURL;
        notification.readStatus='N';
        notification.userId=this.post.userId;
        notification.date=(new Date()).toDateString();


        receivedNotification.title='Food Received ';
        receivedNotification.message='You received '+this.post.subject+' from '+this.post.userProfile.firstName;
        receivedNotification.notificationType='receipt';
        receivedNotification.notificationImageUrl=this.post.imageURL;
        receivedNotification.readStatus='N';
        receivedNotification.userId=this.shared.receivedUser;
        receivedNotification.date= (new Date()).toDateString();

            this.afDatabase.list('shared').push(this.shared).then(result=>{//saving the share to firebase

            
            //updating user statistics
             this.afDatabase.object('post/'+this.post.postId).update({shares:+this.post.shares});

              this.profile_stats_share.share++;
              this.afDatabase.object('profile_stats/'+this.post.userId).update({share: this.profile_stats_share.share});
          
              this.profile_stats_receive.receipt++;
              this.afDatabase.object('profile_stats/'+this.shared.receivedUser).update({receipt:this.profile_stats_receive.receipt}).then(()=>{
                    
              this.afDatabase.list('notifications/'+notification.userId).push(notification).then(()=>{

                  this.afDatabase.list('notifications/'+receivedNotification.userId).push(receivedNotification).then(()=>{
                  loader.dismiss();
                  this.interfac.presentToast('Scan Sucessfull, you  have receipted this Post');
                  this.navCtrl.pop();
                  this.rateUser();//once scan is sucessfull directing user to rating page;
                  });
              });

                
              });

          });//Making Server Aware of a sharing event
         

      }else{
        this.eventLogger.inputRejection('scan_incorrect_code');//analaytic data collection
        this.interfac.presentToast('Scan Un-Sucessfull this is an incorrect Code');
      }
    }, (err) => {
        //console.log('Error: ', err);
        this.eventLogger.inputRejection('scan_error');//analaytic data collection
        this.interfac.presentToast('Scan Un-Sucessfull an error occurred');
    });

  }

//increase view count 
postView (){

  if(this.user.uId!=this.post.userId){
    this.post.views++;
    this.afDatabase.object('post/'+this.post.postId).update({views:+this.post.views});
  }
}
//sending a request for the post
  requestPost(){
  
   


    let notification={} as Notifications;
    let loader= this.interfac.presentLoadingDefault();
    loader.present();

    //setting requets data
    this.request.requestedUser=this.user.uId;
    this.request.requestedUserProfile=this.profile;
    this.request.postedUser=this.post.userId;
    this.request.post=this.post;
    this.request.status='P';

        notification.title='Food Request ';
        notification.message='You have received a food request from '+this.profile.firstName;
        notification.notificationType='request';
        notification.notificationImageUrl=this.post.imageURL;
        notification.readStatus='N';
        notification.userId=this.post.userId;
        notification.date=(new Date()).toDateString();

   //saving request to firebase
    this.afDatabase.object('request/'+this.user.uId+'_'+this.post.postId).set(this.request).then(result=>{

      this.afDatabase.list('notifications/'+notification.userId).push(notification).then(()=>{

        loader.dismiss();
        this.interfac.presentToast('Request has been sent');
        this.requestStatus=true;

                      let confirm = this.alertCtrl.create({
                        title: 'Direct Messaging',
                        message: 'Do you want send a direct message to this Poster ?',
                        buttons: [
                          {
                            text: 'Yes',
                            handler: () => {
                              this.navCtrl.push(ChatMessagePage,{otherUser:this.post.userId});
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
        });
        
     
     
    });
    

  }


  directMessage(){

    let confirm = this.alertCtrl.create({
      title: 'Direct Messaging',
      message: 'Do you want send a direct message to this Poster ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.push(ChatMessagePage,{otherUser:this.post.userId});
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

  showQr (){

    this.eventLogger.buttonClickLogger('show_QR');//analaytic data collection
    if(this.showQrCode==true){
      this.showQrCode=false;
    }else{
      this.showQrCode=true;
    }
  }





}
