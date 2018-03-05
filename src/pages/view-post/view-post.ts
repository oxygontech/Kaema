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

  post ={} as Post;
  locationImage:any;
  qrImage:any;
  user ={} as User;
  hiddenText :any;
  request={} as Request;
  shared={} as Shared;
  requestStatus =false;
  profile ={} as Profile;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase,
              private afAuth:AngularFireAuth,private barcodeScanner: BarcodeScanner,public interfac: InterfaceProvider) {

    this.afAuth.authState.subscribe(userResult=>{
      
          if(userResult.uid){
            this.user.uId=userResult.uid;

            this.afDatabase.list('request/'+this.user.uId+'_'+this.post.postId).subscribe(result=>{
                   
              console.log(result.length);

              if(result.length>0){
                this.requestStatus=true;
                
              }
            });


            this.afDatabase.object('profile/'+this.user.uId).subscribe(result=>{

               this.profile=result;

            });
            
          }else{
            this.navCtrl.setRoot(LoginPage);
          }
    
        });


    if(navParams.get('post')!=null){
      this.post=navParams.get('post');
      this.locationImage='https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=600x300&maptype=roadmap'+
      '&markers=color:red%7Clabel:C%7C'+this.post.location.latitude+','+this.post.location.longitude+
      '&key=AIzaSyBQP6abQtIy-p2SGetONO3L1-XVwxOZP-g';

      this.qrImage=this.post.postId;
      }

    
  }

  ionViewDidLoad() {
    
  }


  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.hiddenText = barcodeData.text;

      if(barcodeData.text==this.post.postId){



        let loader= this.interfac.presentLoadingDefault();
        loader.present();
    
        this.shared.receivedUser=this.user.uId;
        this.shared.receivedUserProfile=this.profile;
        this.shared.sharedUser=this.post.userId;
        this.shared.post=this.post;
    
    
        this.afDatabase.object('shared/'+this.user.uId+'_'+this.post.postId).set(this.shared).then(result=>{
          loader.dismiss();
          this.interfac.presentToast('Scan Sucessfull, you  have receipted this Post');
         
        });
        


      }else{
        this.interfac.presentToast('Scan Un-Sucessfull this is an incorrect Code');
      }
    }, (err) => {
        console.log('Error: ', err);
        this.interfac.presentToast('An error occurred');
    });
  }


  requestPost(){
  
   


    let loader= this.interfac.presentLoadingDefault();
    loader.present();

    this.request.requestedUser=this.user.uId;
    this.request.requestedUserProfile=this.profile;
    this.request.postedUser=this.post.userId;
    this.request.post=this.post;
    this.request.status='P';


    this.afDatabase.object('request/'+this.user.uId+'_'+this.post.postId).set(this.request).then(result=>{
      loader.dismiss();
      this.interfac.presentToast('Request has been sent');
      this.requestStatus=true;
    });
    

  }



}
