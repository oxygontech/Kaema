import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { LoginPage } from '../login/login';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { InterfaceProvider } from '../../providers/interface/interface';



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
  view=true;
  loader=null;
  tempUrl='../../assets/icon/avatar.svg';

 

  constructor(public navCtrl: NavController, public navParams: NavParams,
       private afDatabase : AngularFireDatabase ,private afAuth:AngularFireAuth,public interfac: InterfaceProvider) {

        this.loader= this.interfac.presentLoadingDefault();
        this.loader.present();

        this.profile.userPhotoURL=this.tempUrl;

        this.afAuth.authState.subscribe(result=>{
          console.log('Auther');
              if(result.uid){
                
                console.log('profile/'+result.uid);

                this.user.uId=result.uid;
                this.profileData=this.afDatabase.object('profile/'+this.user.uId);
                this.profileData.subscribe(x=> {
                  
                   this.profile.firstName=x.firstName;
                   this.profile.email=x.email;
                   this.profile.bio=x.bio;
                   this.profile.website=x.website;
                   this.profile.userPhotoURL=x.userPhotoURL;
                   this.loader.dismiss()
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

saveProfile(){
  this.view=true;
  this.afDatabase.object(`profile/${this.user.uId}`).set(this.profile);
}



}
