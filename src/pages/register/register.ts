import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Profile } from '../../models/profile';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database-deprecated';
import { InterfaceProvider } from '../../providers/interface/interface';

import { Storage } from '@ionic/storage';
import { LeaderBoard } from '../../models/leader_board';
import { ProfileStats } from '../../models/profile_stats';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';
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


  /*
  * *****************HCI ISSUES*********************
  * 
  * 1.User required to login after registering -Resolved (User is automatically logged in after registration)
  * 2.Incorrect Email or Password exceptions not clear -Resolved (Properly handeled exception at registration and diplayed using a Toast)
  * 3.When app relaoded User was required to sign in even though user was automatically signed in -Resolved (User credentilas saved
  *   to device memory)
  * 
  * ****************SECURITY RISKS************
  * 1.Unauthorised access to section of the application which require user to be authenticated -Users will be redirected to Login
  *  page if the user is not authenticated.
  * 2.Access application by exploiting the password field -Proper hashing has been implemented for passwords and there is no threat
  *   of user exploiting the password field. 
  */



 email="";
 password="";
 repassword="";
 fullname="";
 bio="";
 contactNo="";
 website="";
 agree=false;

 loader=null;

 profile = {} as Profile;
 leader_board={} as LeaderBoard;
 profile_stats={} as ProfileStats;

  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController, 
    public navParams: NavParams,public interfac: InterfaceProvider,
     private afDatabase:AngularFireDatabase,private storage: Storage  ,private eventLogger :EventLoggerProvider) {

               
            
            }

  async ionViewDidLoad() {
     
    /*this.service.getUrls().then(data=>{
     if(data!=null){
      console.log(data) 
     }
    })*/
      
  }


   validate(){

    if(this.fullname ==''){
      this.interfac.presentToast('Please enter name');
      return false;
    }else if (this.password!=this.repassword){
      this.interfac.presentToast('Passwords do not match');
      return false;
    }else{
      return true;
    }
  }
  //registering user
  async register(){
   
    console.log(this.validate());
    this.loader=await this.interfac.presentLoadingDefault();
    this.loader.present();
    this.email=this.email.trim();
    
    if(this.validate()){
   

 try{

  //creating a new user in firebase using email and password
  	const result= await this.afAuth.auth.createUserWithEmailAndPassword(this.email,this.password);
     if(result){

      this.profile.firstName=this.fullname;
      this.profile.email=this.email;
      this.profile.bio='';
      this.profile.website='';
      this.profile.phoneNumber=this.contactNo;
      this.profile.userPhotoURL='assets/icon/avatar.png';
      
      //once user is created automatically sign in User 
		            try{
                  
					  const loginResult=this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password);
					  if(loginResult){

              this.afAuth.authState.subscribe(result=>{
                    if(result.uid){
                      
                      this.afDatabase.object(`profile/${result.uid}`).set(this.profile)
                      .then(()=>{

                        //storing user credentials in device memory
                        this.storage.set('status', true)
                        this.storage.set('email', this.email)
                        this.storage.set('password', this.password)

                        //saving data which will be linked to user within the application
                        this.leader_board.score=0;
                        this.leader_board.userId=result.uid;
                        this.leader_board.userProfile=this.profile;
                      
                        this.afDatabase.object(`leader_board/${result.uid}`).set(this.leader_board).then(()=>{
                        
                          this.profile_stats.userId=result.uid;
                          this.profile_stats.post=0;
                          this.profile_stats.share=0;
                          this.profile_stats.receipt=0;

                            this.afDatabase.object(`profile_stats/${result.uid}`).set(this.profile_stats).then(()=>{
                          
                               this.navCtrl.push(HomePage)
                               this.loader.dismiss();
                            });
                        });

                        

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
//handling exceptions and displaing to user through a toast
this.eventLogger.inputRejection('registration');
     this.loader.dismiss();
     this.interfac.presentToast(e.message);
     console.error(e);
    }
  }else{
    this.loader.dismiss();
  }
}




}
