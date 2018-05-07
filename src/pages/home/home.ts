import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';

import { MonitorPage } from '../monitor/monitor';
import { TimelinePage } from '../timeline/timeline';
import { MorePage } from '../more/more';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { AddPostPage } from '../add-post/add-post';
import { LeaderboardPage } from '../leaderboard/leaderboard';

import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  timeline=TimelinePage;
  monitor=MonitorPage;
  more=MorePage;
  profile=ProfilePage;
  leaderBoard=LeaderboardPage;

  undreadNotification=0;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase ,
              private afAuth:AngularFireAuth,private storage: Storage,private alertCtrl:AlertController) {

                this.loadNotifications();
  }

  ionViewDidEnter() {
    
  }


loadNotifications(){

  
  this.afAuth.authState.subscribe(result=>{
      
    if(!result.uid){
      this.navCtrl.setRoot(LoginPage);
    }else{


      this.afDatabase.list('notifications',{
        query :{
          orderByChild:'userId',
          equalTo:result.uid
        }
      }).subscribe(requestResult=>{
  
       let notifyList =requestResult.reverse();
       this.undreadNotification=0;
       for (let item of notifyList){
            if(item.readStatus=="Y"){
              continue;
            }
            this.undreadNotification++;
          }
      })
    }

  });
}


  logout(){
    
    this.navCtrl.setRoot(LoginPage);

   this.storage.set('status',false);
   this.storage.set('email', null);
   this.storage.set('password', null);

   this.afAuth.auth.signOut();
  
  // this.navCtrl.setRoot(LoginPage);
 }

logoutConfirm(){

  let confirm = this.alertCtrl.create({
    title: 'Confirm Logout',
    message: 'Are you sure you want to logout ?',
    buttons: [
      {
        text: 'Yes',
        handler: () => {
          this.logout();
        }
      },
      {
        text: 'No',
        handler: () => {
         
        }
      }
    ]
  });
  confirm.present();


}
 

 settings(){
 this.navCtrl.push(MorePage);
}

 viewProfile(){
  
  this.navCtrl.push(ProfilePage);

  }

addPost(){

  this.navCtrl.push(AddPostPage);
  
  }

}

