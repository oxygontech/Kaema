import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { LoginPage } from '../login/login';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { InterfaceProvider } from '../../providers/interface/interface';
import firebase from 'firebase';

import { Camera,CameraOptions } from '@ionic-native/camera';


import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';


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
  view=true;
  viewImage=true;
  loader=null;
  tempUrl='../../assets/icon/avatar.svg';
  captureDataUrl: string;

 

  constructor(public navCtrl: NavController, public navParams: NavParams,
       private afDatabase : AngularFireDatabase ,private afAuth:AngularFireAuth,public interfac: InterfaceProvider,
      public camera :Camera) {

        this.loader= this.interfac.presentLoadingDefault();
        this.loader.present();

        this.profile.userPhotoURL=this.tempUrl;

        this.afAuth.authState.subscribe(result=>{
          console.log('Auther');
              if(result.uid){
                
                console.log('profile/'+result.uid);

                this.user.uId=result.uid;
                this.profileData=this.afDatabase.object('profile/'+this.user.uId);
                this.profileData.subscribe(x=> {
                  
                   this.profile.firstName=x.firstName;
                   this.profile.email=x.email;
                   this.profile.bio=x.bio;
                   this.profile.website=x.website;
                   /*this.displayImage(x.userPhotoURL).then((result)=>{
                     this.profile.userPhotoURL=result;
                   });*/
                   this.profile.userPhotoURL=x.userPhotoURL;
                   this.loader.dismiss()
                  }
              
              );
            }else{
                this.navCtrl.setRoot(LoginPage);
              }
          });

  }



  ionViewWillLoad() {
    
     
   }


  ionViewDidLoad() {
   
  }


  editProfile(){
    if(this.view){
      this.view=false;
      console.log(this.view);
    }else{

      this.saveProfile();
    }
 
}

editProfileImage(){

  if(this.viewImage){
    this.viewImage=false;
    console.log(this.view);
  }else{

    this.viewImage=true;
  }

}



captureImage(){

   if(this.captureDataUrl!=null){
    this.captureDataUrl=null;
   }

   
  const cameraOptions: CameraOptions = {
    quality: 50,
    destinationType:  this.camera.DestinationType.DATA_URL,
    encodingType:  this.camera.EncodingType.JPEG,
    mediaType:  this.camera.MediaType.PICTURE,
    correctOrientation :true,
  };

  this.camera.getPicture(cameraOptions).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
    this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
  }, (err) => {
    // Handle error
  });
}

uploadImage() {
  this.loader= this.interfac.presentLoadingDefault();
  this.loader.present();

  let storageRef = firebase.storage().ref();
  // Create a timestamp as filename
  const filename = this.user.uId;

  // Create a reference to 'images/todays-date.jpg'
  const imageRef = storageRef.child(`profile_images/${filename}.jpg`);

  imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
   // Do something here when the data is succesfully uploaded!
    this.displayImage(`profile_images/${filename}.jpg`).then((result)=>{
    this.profile.userPhotoURL=result;
    this.saveProfile();
    this.captureDataUrl=null;
    this.loader.dismiss();
  });


   
  });

}

async displayImage(imageUrl){

  let storageRef = firebase.storage().ref();
  let photoUrl='';


  // Create a reference to 'images/todays-date.jpg'
  const imageRef = storageRef.child(imageUrl);

  await imageRef.getDownloadURL().then((snapshot)=> {
   // Do something here when the data is succesfully uploaded!
   photoUrl=snapshot;
  },(err)=>{
    
    console.log(err);
    photoUrl=this.tempUrl;
  });
  return photoUrl;
}


saveProfile(){
  this.view=true;
  this.viewImage=true;
  this.afDatabase.object(`profile/${this.user.uId}`).set(this.profile);
}



}
