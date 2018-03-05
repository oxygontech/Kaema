import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { LoginPage } from '../login/login';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { InterfaceProvider } from '../../providers/interface/interface';
import {ImageViewPage} from '../image-view/image-view';
import { ViewPostPage } from '../view-post/view-post';


import { Camera,CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';


import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';

import { ProfileDetailsPage } from '../profile-details/profile-details';
import { MorePage } from '../more/more';


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

  

 

  constructor(public navCtrl: NavController, public navParams: NavParams,
       private afDatabase : AngularFireDatabase ,private afAuth:AngularFireAuth,public interfac: InterfaceProvider,
      public camera :Camera,private storage: Storage,private alertCtrl:AlertController) {

        
        let loader= this.interfac.presentLoadingDefault();
        loader.present();

        this.profileDetails='myPost';
        this.profile.userPhotoURL=this.tempUrl;

        this.afAuth.authState.subscribe(result=>{
          console.log('Auther');
              if(result.uid){
                
                console.log('profile/'+result.uid);

                this.user.uId=result.uid;
                this.profileData=this.afDatabase.object('profile/'+this.user.uId);
                this.profileData.subscribe(profileResult=> {


                   this.profile=profileResult;


                   this.afDatabase.list('post',{
                     query :{
                      orderByChild:'userId',
                       equalTo:this.user.uId,
                       limitToLast:10
                    
                       
                     }
                   }).subscribe(postResult=>{

                    this.mypost =postResult.reverse();

                   })


                   this.afDatabase.list('request',{
                    query :{
                     orderByChild:'requestedUser',
                      equalTo:this.user.uId,
                      limitToLast:10
                      
                      //orderByKey:true                      
                      
                    }
                  }).subscribe(requestResult=>{

                   this.myRequest =requestResult.reverse();
                  
                  })


                  this.afDatabase.list('request',{
                    query :{
                     orderByChild:'postedUser',
                      equalTo:this.user.uId,
                      limitToLast:10
                      
                      //orderByKey:true                      
                      
                    }
                  }).subscribe(requestResult=>{

                   this.pendingRequest =requestResult.reverse();
                   console.log(this.myRequest);
                 

                  })


                  this.afDatabase.list('shared',{
                    query :{
                      orderByChild:'sharedUser',
                      equalTo:this.user.uId,
                      limitToLast:10
                      
                      //orderByKey:true                      
                      
                    }
                  }).subscribe(requestResult=>{

                   this.sharedItems =requestResult.reverse();

                  })


                  this.afDatabase.list('shared',{
                    query :{
                      orderByChild:'receivedUser',
                      equalTo:this.user.uId,
                      limitToLast:10
                      
                      //orderByKey:true                      
                      
                    }
                  }).subscribe(requestResult=>{

                   this.receivedItems =requestResult.reverse();
                   loader.dismiss()

                  })
                   
                  }
              
              );
            }else{
                this.navCtrl.setRoot(LoginPage);
              }
          });


 
  }


viewPost(selectedPost){
  this.navCtrl.push(ViewPostPage,{post:selectedPost});
  }

editProfile(){
  this.navCtrl.push(ProfileDetailsPage);
}


logout(){
    
  this.navCtrl.setRoot(LoginPage);

 this.storage.set('status',false);
 this.storage.set('email', null);
 this.storage.set('password', null);

 this.afAuth.auth.signOut();

// this.navCtrl.setRoot(LoginPage);
}

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


settings(){
this.navCtrl.push(MorePage);
}


approveOrDecline(requestObj,updateStatus){


  let loader= this.interfac.presentLoadingDefault();
  loader.present();

  this.afDatabase.object('request/'+requestObj.requestedUser+'_'+requestObj.post.postId).update({status:updateStatus}).then(result=>{
   loader.dismiss();

  if(updateStatus=='Y'){
  this.interfac.presentToast('Request accepted successfully');
  }else{
  this.interfac.presentToast('Request declined successfully');
  }

  })

}


}
