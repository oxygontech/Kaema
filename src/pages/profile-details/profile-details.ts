import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Camera,CameraOptions } from '@ionic-native/camera';


import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { LoginPage } from '../login/login'
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import {ImageViewPage} from '../image-view/image-view';
import { InterfaceProvider } from '../../providers/interface/interface';
import { WebServiceProvider } from '../../providers/web-service/web-service';


/**
 * Generated class for the ProfileDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-details',
  templateUrl: 'profile-details.html',
})
export class ProfileDetailsPage {

  profileData :FirebaseObjectObservable<Profile>;
  profile ={} as Profile;
  user ={} as User;
  post =[];
  view=true;
  viewImage=true;
  loader=null;
  tempUrl='assets/icon/avatar.png';
  captureDataUrl: string;
  profileDetails:any;

  uploadImageOptions = [
                          {
                            text: 'Capture Photo',
                            icon : 'camera',
                            handler: () => {
                              this.captureImage('capture');
                            }
                          }, {
                            text: 'Upload from Gallery',
                            icon : 'md-cloud-upload',
                            handler: () => {
                              this.captureImage('select');
                            }
                          }, {
                            text: 'View Image',
                            icon:'images',
                            handler: () => {
                             this.viewProfileImage();
                            }
                          },{
                            text: 'Cancel',
                            role: 'cancel',
                            icon : 'arrow-down',
                           
                          }
                        ];


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afDatabase : AngularFireDatabase ,private afAuth:AngularFireAuth,public interfac: InterfaceProvider,
              public camera :Camera,private http :Http,private webService : WebServiceProvider) {
 
    this.loader= this.interfac.presentLoadingDefault();
    this.loader.present();
    //this.wakeServer();

    this.profileDetails='post';

    this.profile.userPhotoURL=this.tempUrl;

    this.afAuth.authState.subscribe(result=>{
      console.log('Auther');
          if(result.uid){
            
            console.log('profile/'+result.uid);

            this.user.uId=result.uid;
            this.profileData=this.afDatabase.object('profile/'+this.user.uId);
            this.profileData.subscribe(profileResult=> {
              
               
               this.webService.editProfile(this.user.uId).then(()=>{
                
                this.profile=profileResult;
                this.loader.dismiss();

               });//Making Server Aware of a change
          
               
              }
          
          );
        }else{
            this.navCtrl.setRoot(LoginPage);
            this.loader.dismiss();
          }
      });
  }

  
  async editProfileImage(){

     let actionSheet=await this.interfac.presentActionSheet('Profile Picture',this.uploadImageOptions,);
     actionSheet.present();
   
   
   }


   captureImage(imageOption){

    let imageType=1;
  
    if(imageOption=='select'){
      imageType=this.camera.PictureSourceType.PHOTOLIBRARY;
    }else{
      imageType=this.camera.PictureSourceType.CAMERA;
    }
  
  
     if(this.captureDataUrl!=null){
      this.captureDataUrl=null;
     }
  
     
    const cameraOptions: CameraOptions = {
      quality: 50,
      sourceType: imageType,
      destinationType:  this.camera.DestinationType.DATA_URL,
      encodingType:  this.camera.EncodingType.JPEG,
      mediaType:  this.camera.MediaType.PICTURE,
      correctOrientation :true,
      allowEdit:true,
    };
  
    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.navCtrl.push(ImageViewPage,{imageUrl:this.captureDataUrl,uploadCheck:true,user:this.user});
    }, (err) => {
      // Handle error
    });
  }
  
  
  
  
  viewProfileImage(){
  this.navCtrl.push(ImageViewPage,{imageUrl:this.profile.userPhotoURL,
                                   uploadCheck:false,user:this.user});
  }
  
  
  
  saveProfile(){
    
    this.viewImage=true;
    
    this.afDatabase.object(`profile/${this.user.uId}`).set(this.profile);
    this.interfac.presentToast('Details Saved Sucessfully');
    this.navCtrl.pop();
  
  
  }

  resetPassword(){
    let loader= this.interfac.presentLoadingDefault();
    loader.present();

    this.afAuth.auth.sendPasswordResetEmail(this.profile.email).then(()=>{
      loader.dismiss();
      this.interfac.presentToast('Password reset link has been sent to your email');
      
    }).catch(error=>{
      loader.dismiss();
      this.interfac.presentToast(error);
      
    })
    
  }



}
