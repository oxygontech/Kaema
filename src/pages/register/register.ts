import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Profile } from '../../models/profile';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database-deprecated';
import { InterfaceProvider } from '../../providers/interface/interface';

import { Storage } from '@ionic/storage';
import { LeaderBoard } from '../../models/leader_board';

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
 leader_board={} as LeaderBoard;

  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController, 
    public navParams: NavParams,public interfac: InterfaceProvider,
     private afDatabase:AngularFireDatabase,private storage: Storage ) {
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
                      .then(()=>{

                        this.storage.set('status', true)
                        this.storage.set('email', this.email)
                        this.storage.set('password', this.password)

                        this.leader_board.score=0;
                        this.leader_board.userId=result.uid;
                        this.leader_board.userProfile=this.profile;
                      
                        this.afDatabase.object(`leader_board/${result.uid}`).set(this.leader_board).then(()=>{

                          this.navCtrl.push(HomePage)
                          this.loader.dismiss()

                        })

                        

                      }
                    

                      
                    
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
