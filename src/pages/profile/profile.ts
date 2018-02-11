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
      public camera :Camera) {

        this.loader= this.interfac.presentLoadingDefault();
        this.loader.present();

        this.profileDetails='post';

        this.profile.userPhotoURL=this.tempUrl;

        this.afAuth.authState.subscribe(result=>{
          console.log('Auther');
              if(result.uid){
                
                console.log('profile/'+result.uid);

                this.user.uId=result.uid;
                this.profileData=this.afDatabase.object('profile/'+this.user.uId);
                this.profileData.subscribe(profileResult=> {
                  
                   /*this.profile.firstName=x.firstName;
                   this.profile.email=x.email;
                   this.profile.bio=x.bio;
                   this.profile.website=x.website;*/

                   this.profile=profileResult;
                   /*this.displayImage(x.userPhotoURL).then((result)=>{
                     this.profile.userPhotoURL=result;
                   });*/

                   //this.profile.userPhotoURL=x.userPhotoURL;

                   this.afDatabase.list('post',{
                     query :{
                      orderByChild:'userId',
                       equalTo:this.user.uId,
                       limitToLast:10
                       
                       //orderByKey:true                      
                       
                     }
                   }).subscribe(postResult=>{

                    this.post =postResult.reverse();
                    console.log(this.post);
                    this.loader.dismiss()

                   })
                   
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


async editProfileImage(){

 /* if(this.viewImage){
    this.viewImage=false;
    console.log(this.view);
  }else{

    this.viewImage=true;
  }*/

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
  this.view=true;
  this.viewImage=true;
  this.afDatabase.object(`profile/${this.user.uId}`).set(this.profile);
  this.interfac.presentToast('Details Saved Sucessfully');
}

viewPost(selectedPost){
  this.navCtrl.push(ViewPostPage,{post:selectedPost});
  }



}
