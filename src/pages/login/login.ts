import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Page1 } from '../page1/page1';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';

import {AngularFireAuth} from 'angularfire2/auth';
import { MenuController } from 'ionic-angular';
import { InterfaceProvider } from '../../providers/interface/interface';
import firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
import { User } from '../../models/user';


/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


 email="";
 password="";
 provider=null;

 loader=null;
 user ={} as User;
 

  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams,
             public interfac: InterfaceProvider,public menuCtrl: MenuController,private storage: Storage ) {
  }

 /* ionViewWillEnter() {
       this.menuCtrl.swipeEnable( false );
      // this.login();
       }
    
       ionViewDidLeave() {
         this.menuCtrl.swipeEnable( true )
       }*/


  register(){this.navCtrl.push(RegisterPage); }




async social_login(socialType){

  if(socialType=='google'){
    this.provider=new firebase.auth.GoogleAuthProvider();
  }else if (socialType=='facebook'){
    this.provider=new firebase.auth.FacebookAuthProvider
  }


  //console.log('Reached here after redirect');
  
 this.afAuth.auth.signInWithRedirect(this.provider).then(()=>{
  console.log('Reached here after redirect');
  this.afAuth.auth.getRedirectResult().then(result =>{
    // This gives you a Google Access Token. You can use it to access the Google API.
   // var token = result.credential.accessToken;
    // The signed-in user info.
   // var user = result.user;
    console.log(result);
    this.navCtrl.push(Page1);
    
  }).catch(function(error) {
    // Handle Errors here.
   /* var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;*/
    console.error(error);
   
  });


 }).catch(function(error) {
  // Handle Errors here.
  /*var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;*/
  console.error(error);
 
});

}



 async  login (){
 
  let message='';


  this.loader=await this.interfac.presentLoadingDefault();
  this.loader.present();
  try{
  
  
  const result=await this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password);
 
  if(result){

       this.storage.set('status', true);
       this.storage.set('email', this.email);
       this.storage.set('password', this.password);


       this.navCtrl.setRoot(HomePage);
       this.loader.dismiss();
    }
  }catch(e){
    
    this.loader.dismiss();

    if(e.code=='auth/user-not-found')
       message='Invalid User Credentials,Please retry';
    else
       message=e.message;


    this.interfac.presentToast(message);
    console.error(e);
  }
 }


 


}
