import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth'
import { MonitorPage } from '../monitor/monitor';
import { TimelinePage } from '../timeline/timeline';
import { MorePage } from '../more/more';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,private afAuth:AngularFireAuth,private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.afAuth.authState.subscribe(result=>{
      
          if(!result.uid){
            this.navCtrl.setRoot(LoginPage);
          }
    
        });
  }




  logout(){
    
   this.storage.set('status',false);
   this.storage.set('email', null);
   this.storage.set('password', null);

   this.afAuth.auth.signOut();
   this.navCtrl.setRoot(LoginPage);
 }

}
