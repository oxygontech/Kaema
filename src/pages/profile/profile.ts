import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


import { LoginPage } from '../login/login';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { InterfaceProvider } from '../../providers/interface/interface';
import { ViewPostPage } from '../view-post/view-post';


import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';


import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';

import { ProfileDetailsPage } from '../profile-details/profile-details';
import { MorePage } from '../more/more';
import { ProfileStats } from '../../models/profile_stats';
import { Notifications } from '../../models/notifications';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';
import { ViewRatingPage } from '../view-rating/view-rating';

import { PopoverController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})


export class ProfilePage {

  profileData :FirebaseObjectObservable<Profile>;
  profile ={} as Profile;
  user ={} as User;
  profile_stat={} as ProfileStats;

  profileSubscription :any;
  profileStatSub :any;

  mypost =[];
  myRequest=[];
  pendingRequest=[];
  sharedItems=[];
  receivedItems =[];



  view=true;
  viewImage=true;
  tempUrl='assets/icon/avatar.png';
  captureDataUrl: string;
  profileDetails:any;
  batch=100;
  userRating : number; 
  

 /**
  * 
  * ***********************HCI ISSUES************************
  * 1.Screen has too many functionalities -Resolved (Moved the profile editing to another screen which has a link from this screen)
  * 2.When data load increases loading the page gets slow -Resolved (
  *    a.Saved user statistics to seperate node in firebase so that all data is not required to 
  *       load in order to get the statistic data
  *    b.Implemented infinite scroll to prevent loading all the data at once,instead loading small batches at a time
  * )
  * 3.No proper way for user to recognise new items added any of the list provied-Pending (Feature to implemneted to show 
  *   new entries an list to be implemneted in a future iteration)
  * 
  * 4.Data in list's provided get unordered when data is updated-Resolved (Removed realtime link from firebase and instead provided
  *    a referesh option which makes sure the list ordering is in place)
  * 
  * 
  */

  constructor(public navCtrl: NavController, public navParams: NavParams,
       private afDatabase : AngularFireDatabase ,private afAuth:AngularFireAuth,public interfac: InterfaceProvider,
      public camera :Camera,private storage: Storage,private alertCtrl:AlertController,
      private eventLogger :EventLoggerProvider,public popoverCtrl: PopoverController) {

        
        let loader= this.interfac.presentLoadingDefault();
        loader.present();

        this.profileDetails='myPost';
        this.profile.userPhotoURL=this.tempUrl;
//checking user authetication
        this.afAuth.authState.subscribe(result=>{
          console.log('Auther');
              if(result.uid){
                
                //console.log('profile/'+result.uid);
//getting profile statistics
                this.user.uId=result.uid;
                this.profileData=this.afDatabase.object('profile/'+this.user.uId);
                this.profileData.subscribe(profileResult=> {


                   this.profile=profileResult;
                   console.log('this is the profile : '+profileResult);

                   
                  this.afDatabase.object('profile_stats/'+this.user.uId).subscribe(profileStat=> {
                     this.profile_stat=profileStat;
                   });
//loading user related Post,shares,request
                   this.loadPostList ();
                   //this.loadRequestList ();
                   //this.loadPendingRequestList ();
                   this.loadSharedList ();
                   this.loadReceivedList ().then(()=>{
                   this.getUserRating();
                    loader.dismiss()
                   })
                  
                  
                  }
              
              );
            }else{
                this.navCtrl.setRoot(LoginPage);
              }
              
            });


 
  }

//this section will be excuted everytime the user enter's the screen
  ionViewDidEnter(){

    this.eventLogger.pageViewLogger('profile_page');//analaytic data collection
    
    let loader= this.interfac.presentLoadingDefault();
    loader.present();

    this.loadPostList ();
    //this.loadRequestList ();
    //this.loadPendingRequestList ();
    this.loadSharedList ();
    this.loadReceivedList ().then(()=>{
     loader.dismiss()
    })

  }

  getUserRating(){
    console.log('ratings_user/'+this.user.uId);
    this.afDatabase.object('ratings_user/'+this.user.uId).subscribe(ratingResult=>{
      console.log(ratingResult);
      if(ratingResult.length != 0 && ratingResult.ratings!=null){
        this.userRating=(Math.round((ratingResult.stars/ratingResult.ratings)*10))/10;//getting result to once decimal place
       
       //this.userRating=ratingResult.stars/ratingResult.ratings;
      }else{
        this.userRating=0.0;
      }
           
    })

  }

  showRating(){
    this.navCtrl.push(ViewRatingPage,{postUser:this.user.uId});;
    //this.navCtrl.push(UserRatingPage,{postUser:this.post.userId,postId:this.post.postId});
  }
  //loading user related List


  async loadPostList() {

    
  let PostSubcription=  this.afDatabase.list('post',{
      query :{
       orderByChild:'userId',
        equalTo:this.user.uId,
        limitToLast:this.batch
     
        
      }
    }).subscribe(postResult=>{

     this.mypost =postResult.reverse();
     PostSubcription.unsubscribe();

    })

  }

  async loadRequestList (){

    let requestSubcription=this.afDatabase.list('request',{
      query :{
       orderByChild:'requestedUser',
        equalTo:this.user.uId,
        limitToLast:this.batch
        
        //orderByKey:true                      
        
      }
    }).subscribe(requestResult=>{

     this.myRequest =requestResult.reverse();
     requestSubcription.unsubscribe();
    })
  }


  async loadPendingRequestList(){

    let requestSubcription=  this.afDatabase.list('request',{
    query :{
     orderByChild:'postedUser',
      equalTo:this.user.uId,
      limitToLast:this.batch
      
      //orderByKey:true                      
      
    }
  }).subscribe(requestResult=>{

   this.pendingRequest =requestResult.reverse();
   //console.log(this.myRequest);
   requestSubcription.unsubscribe();

  })
}

  async loadSharedList(){

  let sharedSubcription=  this.afDatabase.list('shared',{
      query :{
        orderByChild:'sharedUser',
        equalTo:this.user.uId,
        limitToLast:this.batch
        
        //orderByKey:true                      
        
      }
    }).subscribe(requestResult=>{

     this.sharedItems =requestResult.reverse();
     sharedSubcription.unsubscribe();
    })


  }

  async loadReceivedList (){


    let receivedSubcription=this.afDatabase.list('shared',{
      query :{
        orderByChild:'receivedUser',
        equalTo:this.user.uId,
        limitToLast:this.batch
        
        //orderByKey:true                      
        
      }
    }).subscribe(requestResult=>{

     this.receivedItems =requestResult.reverse();
     receivedSubcription.unsubscribe

    })


  }

  //refreshh function which reload the list's when invoked
  refresh(refresher){
   
         this.eventLogger.pageRefreshLogger('profile_page');//analaytic data collection

          let loader=this.interfac.presentLoadingDefault();
          loader.present();

                   this.loadPostList ();
                   //this.loadRequestList ();
                  // this.loadPendingRequestList ();
                   this.loadSharedList ();
                   this.loadReceivedList ().then(()=>{
                    refresher.complete();
                    loader.dismiss()
                   });
  

  }
viewPost(selectedPost){
  this.navCtrl.push(ViewPostPage,{post:selectedPost});
  }

editProfile(){
  this.eventLogger.buttonClickLogger('profile_edit');//analaytic data collection
  this.navCtrl.push(ProfileDetailsPage);
}


//logging out fuction 
async logout(){
    
  this.eventLogger.buttonClickLogger('logout');

 this.navCtrl.setRoot(LoginPage);
 await this.afAuth.auth.signOut();
//remove user data from device storage
 this.storage.set('status',false);
 this.storage.set('email', null);
 await this.storage.set('password', null);

 
 window.location.reload();
 //signout the user

// this.navCtrl.setRoot(LoginPage);
}

//logout confirmation before actually loging out the user
logoutConfirm(){

let confirm = this.alertCtrl.create({
  title: 'Confirm Logout',
  message: 'Are you sure you want to logout ?',
  buttons: [
    {
      text: 'Yes',
      handler: () => {
        this.logout();
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

//opening the settings page
settings(){
this.navCtrl.push(MorePage);
}


//option provided to accept or decline a perticular request

approveOrDecline(requestObj,updateStatus){

  let notification={} as Notifications;

  let loader= this.interfac.presentLoadingDefault();
  loader.present();
//updating firebase on the approval status
  this.afDatabase.object('request/'+requestObj.requestedUser+'_'+requestObj.post.postId).update({status:updateStatus}).then(result=>{
  

  if(updateStatus=='Y'){
  //saving a notification for user requested User
        notification.title='Food Request ';

        notification.message='Your request has been Approved by  '+requestObj.post.userProfile.firstName;

        notification.notificationType='share';
        notification.notificationImageUrl=requestObj.post.imageURL;
        notification.readStatus='N';
        notification.userId=requestObj.requestedUser;
        notification.date=(new Date()).toDateString();

        this.afDatabase.list('notifications/'+notification.userId).push(notification).then(()=>{
        this.loadPendingRequestList ();
           
          loader.dismiss();
          this.interfac.presentToast('Request accepted successfully');
          });

       
  }else{
       notification.title='Food Request ';

        notification.message='Your request has been Declined by  '+requestObj.post.userProfile.firstName;

        notification.notificationType='share';
        notification.notificationImageUrl=requestObj.post.imageURL;
        notification.readStatus='N';
        notification.userId=requestObj.requestedUser;
        notification.date=(new Date()).toDateString();
        
        this.afDatabase.list('notifications/'+notification.userId).push(notification).then(()=>{
        this.loadPendingRequestList ();
          loader.dismiss();
          this.interfac.presentToast('Request declined successfully');
          });

       
  }

  })

}

presentPopover(myEvent,post) {
  let popover = this.popoverCtrl.create(PopoverPage,{post:post,parent:this});
  popover.present({
    ev: myEvent
  });
}


}


@Component({
  template: `
    <ion-list>
      <ion-list-header>Post Options</ion-list-header>
      <button ion-item (click)="delete()">Delete</button>
      <button ion-item (click)="activate()">Activate</button>
    </ion-list>
  `
})
export class PopoverPage {

  post :any;
  parentPage :any;
  constructor(public viewCtrl: ViewController,public navParams: NavParams,
              private afDatabase : AngularFireDatabase,public interfac: InterfaceProvider,
              private socialSharing: SocialSharing) {

    if(this.navParams.get('post')!=null){
       this.post=this.navParams.get('post');
      
    }

    if( this.navParams.get('parent')!=null ){
      this.parentPage=this.navParams.get('parent')
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  delete() {
    if(this.post!=null && this.post.status=='Y'){
      this.afDatabase.object('post/'+this.post.postId).update({status:'D'});

      if( this.parentPage!=null )
      this.parentPage.loadPostList();

      this.interfac.presentToast('The post has been deleted');
      this.viewCtrl.dismiss();
    }else if(this.post!=null && this.post.status!='Y'){
      this.interfac.presentToast('The post cannot be deleted because it is not active');
      this.viewCtrl.dismiss();
    }else{
      this.interfac.presentToast('An error occured');
      this.viewCtrl.dismiss();
    }
    
  }


  activate() {
    if(this.post!=null && this.post.status=='D'){
      this.afDatabase.object('post/'+this.post.postId).update({status:'Y'});

      if( this.parentPage!=null )
      this.parentPage.loadPostList();

      this.interfac.presentToast('The post has been activated');
      this.viewCtrl.dismiss();
    }else if(this.post!=null && this.post.status=='F'){
      this.interfac.presentToast('The post cannot be activated,because there are no servings left');
      this.viewCtrl.dismiss();
    }else if(this.post!=null && this.post.status!='D'){
      this.interfac.presentToast('The post cannot be activated,because it\'s already active');
      this.viewCtrl.dismiss();
    }else{
      this.interfac.presentToast('An error occured');
      this.viewCtrl.dismiss();
    }
    
  }

    shareSheetShare() {
      this.socialSharing.share(this.post.subject, this.post.description, this.post.imageURL, "").then(() => {
        console.log("shareSheetShare: Success");
      }).catch(error => {
        console.error(error);
      });
    }
  }