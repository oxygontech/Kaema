import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Profile } from '../../models/profile';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database-deprecated';
import { InterfaceProvider } from '../../providers/interface/interface';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

 email="";
 password="";
 loader=null;

 profile = {} as Profile;

  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController, 
    public navParams: NavParams,public interfac: InterfaceProvider,private afDatabase:AngularFireDatabase ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(){
    
    this.loader=await this.interfac.presentLoadingDefault();
   	this.loader.present();

 try{

  	const result= await this.afAuth.auth.createUserWithEmailAndPassword(this.email,this.password);
     if(result){

      this.profile.firstName=this.email;
      this.profile.email=this.email;
      this.profile.bio='';
      this.profile.website='';
      this.profile.userPhotoURL='../../assets/icon/avatar.png';
      
		            try{
					  const loginResult=this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password);
					  if(loginResult){

              this.afAuth.authState.subscribe(result=>{
                    if(result.uid){
                      
                      this.afDatabase.object(`profile/${result.uid}`).set(this.profile)
                      .then(()=>
                    
                      this.navCtrl.push(HomePage),
                      this.loader.dismiss()
                    
                       );
                    }
                });



					       
					    }
					  }catch(e){
              this.loader.dismiss();
					    console.error(e);
					  }
      }
  }catch(e){

     this.loader.dismiss();
     this.interfac.presentToast(e.message);
     console.error(e);
    }
  }




}
