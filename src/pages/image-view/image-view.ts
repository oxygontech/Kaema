import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { InterfaceProvider } from '../../providers/interface/interface';


import {AngularFireDatabase}  from 'angularfire2/database-deprecated';
import firebase from 'firebase';



@IonicPage()
@Component({
  selector: 'page-image-view',
  templateUrl: 'image-view.html',
})
export class ImageViewPage {

  imageUrl ='../../assets/icon/avatar.png';
  tempUrl  ='../../assets/icon/avatar.png';
  uploadImage=false;
  user ={} as User;


  constructor(public navCtrl: NavController, public navParams: NavParams,
               public interfac: InterfaceProvider,private afDatabase : AngularFireDatabase) {

    if(navParams.get('imageUrl')!=null){
    this.imageUrl=navParams.get('imageUrl');
    }

    if(navParams.get('uploadCheck')!=null){
      this.uploadImage=navParams.get('uploadCheck');
    }

    if(navParams.get('user')!=null){
      this.user=navParams.get('user');
    }


  }

  ionViewDidLoad() {
    
  }



  
saveImage() {
  let loader= this.interfac.presentLoadingDefault();
  loader.present();

  let storageRef = firebase.storage().ref();
  // Create a timestamp as filename
  const filename = this.user.uId;

  // Create a reference to 'images/todays-date.jpg'
  const imageRef = storageRef.child(`profile_images/${filename}.jpg`);

  imageRef.putString(this.imageUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
   // Do something here when the data is succesfully uploaded!
    this.getImage(`profile_images/${filename}.jpg`).then((result)=>{
      this.afDatabase.object('profile/'+this.user.uId).update({userPhotoURL:result});
      loader.dismiss();
      this.closePage();
  });


   
  });

}

async getImage(imageUrl){

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


closePage(){

  this.navCtrl.pop();

}


}
