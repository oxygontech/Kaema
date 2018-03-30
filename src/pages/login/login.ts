import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
 

 /*
  * *****************HCI ISSUES*********************
  * 
  * 1.Prompting Email and Password everytime the app is loaded -Resolved (User credentials will be saved on the device keeping
  *   the user logged in even when the app reloaded).
  * 2.Incorrect Email or Password exceptions not clear -Resolved (Properly handeled exception at login and diplayed using a Toast)
  * 3.Social login not Functioning on mobile -Pending (Will be fixed in a future iteration)
  * 
  * ****************SECURITY RISKS************
  * 1.Unauthorised access to section of the application which require user to be authenticated -Users will be redirected to Login
  *  page if the user is not authenticated.
  * 2.Access application by exploiting the password field -Proper hashing has been implemented for passwords and there is no threat
  *   of user exploiting the password field. 
  */

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

//Open registration Page
  register(){this.navCtrl.push(RegisterPage); }



//Social Login functionality,Currently does not work on Mobile device
async social_login(socialType){

  if(socialType=='google'){
    this.provider=new firebase.auth.GoogleAuthProvider();
  }else if (socialType=='facebook'){
    this.provider=new firebase.auth.FacebookAuthProvider
  }


  
  
 this.afAuth.auth.signInWithRedirect(this.provider).then(()=>{
  console.log('Reached here after redirect');
  this.afAuth.auth.getRedirectResult().then(result =>{
    // This gives you a Google Access Token. You can use it to access the Google API.
   // var token = result.credential.accessToken;
    // The signed-in user info.
   // var user = result.user;
    console.log(result);
    this.navCtrl.push(HomePage);
    
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


//Email login functonality
 async  login (){
 
  let message='';

//display loader
  this.loader=await this.interfac.presentLoadingDefault();
  this.loader.present();
  try{
  
  //get autharisation from firebase
  const result=await this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password);
 
  if(result){
  //if user is authorized ,store the authorisation parameters in mobile storage
       this.storage.set('status', true);
       this.storage.set('email', this.email);
       this.storage.set('password', this.password);


       this.navCtrl.setRoot(HomePage);
       this.loader.dismiss();
    }
  }catch(e){
  //handeling exception in authorization  
    this.loader.dismiss();

    if(e.code=='auth/user-not-found')
       message='Invalid User Credentials,Please retry';
    else
       message=e.message;

//Displaying exception using a toast
    this.interfac.presentToast(message);
    console.error(e);
  }
 }


 


}
