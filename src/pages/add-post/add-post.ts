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
import { ProfileStats } from '../../models/profile_stats';




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

  profile_stats={} as ProfileStats;

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

  /**
   * *******************HCI ISSUES************************
   * 
   * 1. Not clear what needs to be enter -Resolved (User's are helped with placeholder to better understand what needs to filled)
   * 2. User not aware of what data is madetory -Resolved (User's will alerted if they have missed any mandotory fields)
   * 
   * 
   * ***********************SECURITY RISKS*********
   * 1. Unauthourized user adding a Post -(Application controls implemented preventing any unathourized access of this screen)
   * 
   * 
   * 
  */


  constructor(public navCtrl: NavController, public navParams: NavParams,
                private afDatabase : AngularFireDatabase ,private afAuth:AngularFireAuth,public interfac: InterfaceProvider,
                public camera :Camera,private fireImageService:FirebaseImageServiceProvider,private storage:Storage) {

                  //diplaying loading
                  let loader= this.interfac.presentLoadingDefault();
                  loader.present();

                  //setting up default parameters required by page
                  this.post.daysAvailable='1';
                  this.post.servings=1;
                  this.post.postType='share';

                  //checking user authorization
                  this.afAuth.authState.subscribe(result=>{
                      if(result.uid){
                         this.post.userId=result.uid;

                        //getting user statistics and data from firebase
                         this.afDatabase.object('profile_stats/'+result.uid).subscribe(profileStat=>{
                          this.profile_stats=profileStat;
                          });


                         this.afDatabase.object('profile/'+result.uid).subscribe(result=>{
                            
                              this.post.userProfile=result;
                         });
                         
                      }else{

                        this.navCtrl.setRoot(LoginPage);
                      }

                  });


                //intialising drop down values for Number of Days and Number of Servings
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

         
        }
       
        
        
      }).catch(function(error){
        this.rootPage= LoginPage;
      });


    }).catch(function(error){
      this.rootPage= LoginPage;
    });
        
      }

//Display option available to upload an image
 async uploadImage(){
  let actionSheet=await this.interfac.presentActionSheet('Upload Photo',this.uploadImageOptions,);
  actionSheet.present();
 }

//using camera/gallery to upload image
  captureImage(imageOption){
    
      let imageType=1;
    
      //based on options selected camera or gallery variable is selceted
      if(imageOption=='select'){
        imageType=this.camera.PictureSourceType.PHOTOLIBRARY;
      }else{
        imageType=this.camera.PictureSourceType.CAMERA;
      }
    
    
       
    
       //opening camera or gallery based on above condition
      const cameraOptions: CameraOptions = {
        quality: 50,
        sourceType: imageType,
        destinationType:  this.camera.DestinationType.DATA_URL,
        encodingType:  this.camera.EncodingType.JPEG,
        mediaType:  this.camera.MediaType.PICTURE,
        correctOrientation :true,
        allowEdit:true,
      };
    //handeling the image returned 
      this.camera.getPicture(cameraOptions).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.imageURL = 'data:image/jpeg;base64,' + imageData;
        this.isImageUploaded=true;
        
      }, (err) => {
        // Handle error
      });
    }

    //validating inputs before saving data to firebase
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

    //saving the post data to firebase
    async savePost(){

      
  
  

      if(this.validateInputs()){//check validity of inputs


//present the loader
      let loader= this.interfac.presentLoadingDefault();
      loader.present();

      //assigning data which have not been binded to inputs
      this.post.entDate=(new Date()).toDateString();
      this.post.status='Y';
      this.post.shares=0;
      this.post.views=0;

      //getting the reference on where to add the post
      let postList=this.afDatabase.list(`post`);
      let postedRef=postList.push(this.post);//adding post to firebase,unique key is generated by firebase when push method is invoked
      let postKey=postedRef.key;//getting the unique key generated

      //uploading image to firebase using provider firebase service
      let uploadImage=await this.fireImageService.saveImage(postKey,'post/'+postKey,this.imageURL);
      this.afDatabase.object('post/'+postKey).update({imageURL:uploadImage,postId:postKey})
      

      //updating user statistics
      this.profile_stats.post++;
      this.afDatabase.object('profile_stats/'+this.post.userId).update({post:this.profile_stats.post}).then(()=>{
     
        loader.dismiss();
        this.interfac.presentToast('Post Saved Sucessfully');
        this.navCtrl.pop();
     
      });

    
    }
     
    }

//loading maps page so that user can select the location
    setLocation(){
      this.navCtrl.push(MapViewPage);
    }

}
