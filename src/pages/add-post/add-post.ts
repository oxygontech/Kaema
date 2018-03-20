import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { InterfaceProvider } from '../../providers/interface/interface';
import { FirebaseImageServiceProvider } from '../../providers/firebase-image-service/firebase-image-service';
import { Post } from '../../models/post';
import { Location } from '../../models/location';
import { LoginPage } from '../login/login';
import { MapViewPage } from '../map-view/map-view';



import {AngularFireDatabase,FirebaseListObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';

import { Camera,CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';




/**
 * Generated class for the AddPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {


  servings_list =[];
  number_of_days= [];
  imageURL='assets/icon/photo_upload.svg';
  isImageUploaded=false;
  post={} as Post;
  location={} as Location;
  locationImage:String;

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
    },{
      text: 'Cancel',
      role: 'cancel',
      icon : 'arrow-down',
     
    }
  ];


  constructor(public navCtrl: NavController, public navParams: NavParams,
                private afDatabase : AngularFireDatabase ,private afAuth:AngularFireAuth,public interfac: InterfaceProvider,
                public camera :Camera,private fireImageService:FirebaseImageServiceProvider,private storage:Storage) {

                  let loader= this.interfac.presentLoadingDefault();
                  loader.present();

                  this.post.daysAvailable='1';
                  this.post.servings=1;
                  this.post.postType='share';

                  this.afAuth.authState.subscribe(result=>{
                      if(result.uid){
                         this.post.userId=result.uid;
                         this.afDatabase.object('profile/'+result.uid).subscribe(result=>{
                            
                              this.post.userProfile=result;
                         });
                         
                      }else{

                        this.navCtrl.setRoot(LoginPage);
                      }

                  });


                
                  var i=1;

                 while(i<30){
                  this.number_of_days.push(i);
                  i++;
                 }

                 var j=1;

                 while(j<=5){
                   let item={key:j,value:j}
                   this.servings_list.push(item);
                   j++;
                 }


                 this.servings_list.push({key:6,value:'More'});

                 loader.dismiss();

/*this.afDatabase.object('admin_data/Servings').subscribe(result=>{


                  for(let item of Object.keys(result)){

                    this.servings_list.push(result[item])
                  }
                 console.log(this.servings_list)
                 loader.dismiss();
                // console.log(result.1)
                 })*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPostPage');
  }



  ionViewWillEnter(){
   
    this.storage.get('myLat').then((lat) => {
      if(lat){
        this.location.latitude=lat;
        this.storage.set('myLat',null)
      }

      this.storage.get('myLng').then((lng) => {
        if(lng){
          this.location.longitude=lng;
          this.storage.set('myLng',null)


          this.post.location=this.location;
          
          this.locationImage='https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=600x300&maptype=roadmap'+
          '&markers=color:red%7Clabel:C%7C'+this.location.latitude+','+this.location.longitude+
          '&key=AIzaSyBQP6abQtIy-p2SGetONO3L1-XVwxOZP-g';

          console.log(this.locationImage);
        }
       
        
        
      }).catch(function(error){
        this.rootPage= LoginPage;
      });


    }).catch(function(error){
      this.rootPage= LoginPage;
    });
        
      }


 async uploadImage(){
  let actionSheet=await this.interfac.presentActionSheet('Upload Photo',this.uploadImageOptions,);
  actionSheet.present();
 }


  captureImage(imageOption){
    
      let imageType=1;
    
      if(imageOption=='select'){
        imageType=this.camera.PictureSourceType.PHOTOLIBRARY;
      }else{
        imageType=this.camera.PictureSourceType.CAMERA;
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
        this.imageURL = 'data:image/jpeg;base64,' + imageData;
        this.isImageUploaded=true;
        
      }, (err) => {
        // Handle error
      });
    }

    validateInputs(){
   
     
       if(this.post.subject==''||this.post.subject==null){
        this.interfac.presentToast('Please Enter a Title');
        return false;
      
       }else if(this.post.description==''||this.post.description==null){
        this.interfac.presentToast('Please Enter a Description');
        return false;

       }else if(!this.isImageUploaded){
        this.interfac.presentToast('Please upload an Image of the food');
        return false;
         
       }else if(this.locationImage==null){
        this.interfac.presentToast('Location has not been Set');
        return false;
        
      }else if(this.post.pickUpTime==''||this.post.pickUpTime==null){
        this.interfac.presentToast('Please enter Pick up time');
        return false;
        
      }else{
        return true;
      }


    }
    async savePost(){

      console.log((new Date()).toDateString());
  
  

      if(this.validateInputs()){



      let loader= this.interfac.presentLoadingDefault();
      loader.present();

      this.post.entDate=(new Date()).toDateString();
      this.post.status='Y';

      let postList=this.afDatabase.list(`post`);
      let postedRef=postList.push(this.post);
      let postKey=postedRef.key;


      let uploadImage=await this.fireImageService.saveImage(postKey,'post/'+postKey,this.imageURL);
      console.log(uploadImage);
      this.afDatabase.object('post/'+postKey).update({imageURL:uploadImage,postId:postKey})
      

      

      loader.dismiss();
      this.interfac.presentToast('Post Saved Sucessfully');
      this.navCtrl.pop();
    }
     
    }


    setLocation(){
      this.navCtrl.push(MapViewPage);
    }

}
