import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { LoginPage } from '../login/login';
import { InterfaceProvider } from '../../providers/interface/interface';

import {AngularFireAuth} from 'angularfire2/auth';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,private afAuth:AngularFireAuth,
              private barcodeScanner: BarcodeScanner,public interfac: InterfaceProvider) {

    this.afAuth.authState.subscribe(result=>{
      
          if(result.uid){
            this.user.uId=result.uid;
            
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
        this.interfac.presentToast('Scan Sucessfull You have receipted this Post');
      }else{
        this.interfac.presentToast('Scan Un-Sucessfull this is an incorrect Code');
      }
    }, (err) => {
        console.log('Error: ', err);
        this.interfac.presentToast('An error occurred');
    });
  }



}
