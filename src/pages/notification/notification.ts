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

  notifyList = [];
  listLoaded=false;
  userId:string;
  dateObj=new Date();
  currentDate=this.dateObj.toDateString();

  
  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase ,
              private afAuth:AngularFireAuth,public interfac: InterfaceProvider) {

       
                this.afAuth.authState.subscribe(result=>{
                  console.log('Auther');
                      if(result.uid){
            
                       //console.log('profile/'+result.uid);
                       this.userId=result.uid;
                       this.loadNotifications(result.uid);
            
            
                    }else{
                        this.navCtrl.setRoot(LoginPage);
                      }
                  });
  }


//this section will be excuted everytime the user enter's the screen
  ionViewDidEnter (){
    this.loadNotifications(this.userId); 
  }

  async loadNotifications(currentUserId){

    let loader= this.interfac.presentLoadingDefault();
    loader.present();
    let notifySubcription=  this.afDatabase.list('notifications',{
      query :{
        orderByChild:'userId',
        equalTo:currentUserId
        
        //orderByKey:true                      
        
      }
    }).subscribe(requestResult=>{

     this.notifyList =requestResult.reverse();
     notifySubcription.unsubscribe();
     loader.dismiss();
     console.log(this.notifyList);


    })


  }


  refresh(refresher){

    this.loadNotifications(this.userId).then(()=>{
      refresher.complete();
    });

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NotificationPage');
  }

}
