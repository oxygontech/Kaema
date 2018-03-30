/*
import { Injectable } from '@angular/core';
//import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import {AngularFireDatabase}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';
/*
  Generated class for the CloudMessagingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
/*
@Injectable()
export class CloudMessagingProvider {

  constructor( public firebaseNative: Firebase,
    private afDatabase : AngularFireDatabase,private afAuth:AngularFireAuth,
    private platform: Platform)
    
    {
    console.log('Hello CloudMessagingProvider Provider');
  }


  // Get permission from the user
  async getToken() { 

    let token;
    console.log('Platform '+this.platform.is('android'));
    await this.firebaseNative.grantPermission();
  
    if (this.platform.is('android')) {

      await this.firebaseNative.getToken().then(tokenResult=>{
        token=tokenResult;
     }).catch(error=>console.log('token error'+error))
      
    } 
    else if (this.platform.is('ios')) {

      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    } else{

      await this.firebaseNative.getToken().then(tokenResult=>{
        token=tokenResult;
     }).catch(error=>console.log('token error '+error))

    }
  
      console.log('Token '+token);
      return  this.saveTokenToFirebase(token)
  }

  // Save the token to firestore
  private async saveTokenToFirebase(token) {

    if (!token) return;
    let deviceRef=this.afDatabase.list(`device`);

   await this.afAuth.authState.subscribe(userResult=>{
      if(userResult.uid){
        console.log('Message Provider '+userResult.uid);
        const deviceData = { 
          token,
          userId: userResult.uid,
         }
        console.log(deviceData);
        return deviceRef.push(deviceData);
            
          }
      });
  
    

 


  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    
    return this.firebaseNative.onNotificationOpen()
  }

}*/
