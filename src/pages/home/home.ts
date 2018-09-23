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
import { PostPage } from '../post/post';

import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import { ChatPage } from '../chat/chat';
import { User } from '../../models/user';
import { CloudMessagingProvider } from '../../providers/cloud-messaging/cloud-messaging';
import { InterfaceProvider } from '../../providers/interface/interface';



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
  post=PostPage;
  chat=ChatPage;
  undreadChat=0;
  


  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase ,
              private afAuth:AngularFireAuth,private storage: Storage,private alertCtrl:AlertController,
              private messageProvider:CloudMessagingProvider,public interfac: InterfaceProvider) {

                try{this.afAuth.authState.subscribe(result=>{
                  if(!result.uid){
                    this.navCtrl.setRoot(LoginPage);
                  }  
                })
              }catch(error){
                this.navCtrl.setRoot(LoginPage);
              }

           /*   this.messageProvider.getToken().then(()=>{
                // Listen to incoming messages
                this.messageProvider.listenToNotifications().subscribe(msg => {
                  // show a toast
                this.interfac.presentToast(msg.body)
                })
      
          }).catch(error=>{
            interfac.presentToast(error.message);
          })*/
     
      }





}

