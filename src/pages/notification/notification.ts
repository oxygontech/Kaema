import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';
import { InterfaceProvider } from '../../providers/interface/interface';
import { LoginPage } from '../login/login';


/**
 * Generated class for the NotificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  notifications = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase ,
              private afAuth:AngularFireAuth,public interfac: InterfaceProvider) {

        this.afAuth.authState.subscribe(result=>{
          console.log('Auther');
              if(result.uid){

               //console.log('profile/'+result.uid);
              //this.loadNotifications();


            }else{
                this.navCtrl.setRoot(LoginPage);
              }
          });
  }
  async loadNotifications(){
    let loader= this.interfac.presentLoadingDefault();
    loader.present();
    this.afDatabase.list('notifications',{
      query :{
        orderByChild:'date',
      //  limitToLast:this.batch
        //orderByKey:true
      }
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

}
