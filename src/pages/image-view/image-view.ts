import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { InterfaceProvider } from '../../providers/interface/interface';
import { FirebaseImageServiceProvider } from '../../providers/firebase-image-service/firebase-image-service';

import {AngularFireDatabase}  from 'angularfire2/database-deprecated';
import firebase from 'firebase';



@IonicPage()
@Component({
  selector: 'page-image-view',
  templateUrl: 'image-view.html',
})
export class ImageViewPage {

  imageUrl ='assets/icon/avatar.png';
  tempUrl  ='assets/icon/avatar.png';
  uploadImage=false;
  user ={} as User;


  constructor(public navCtrl: NavController, public navParams: NavParams,
               public interfac: InterfaceProvider,private afDatabase:AngularFireDatabase,private fireImageService : FirebaseImageServiceProvider) {

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



  
async saveImage() {
  let loader= this.interfac.presentLoadingDefault();
  loader.present();

  const filename = this.user.uId;

  let uploadImage=await this.fireImageService.saveImage(filename,'profile_images/',this.imageUrl);
 
      this.afDatabase.object('profile/'+this.user.uId).update({userPhotoURL:uploadImage});
      loader.dismiss();
      this.closePage();
  
}




closePage(){

  this.navCtrl.pop();

}


}
