import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Page1 } from '../page1/page1';


import {AngularFireAuth} from 'angularfire2/auth';
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

  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams,public interfac: InterfaceProvider ) {
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
		            try{
					  const loginResult=this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password);
					  if(loginResult){

					       this.navCtrl.push(Page1);
					       this.loader.dismiss();
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
