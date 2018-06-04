import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

/*
  Generated class for the EventLoggerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventLoggerProvider {

  constructor(private firebaseAnalytics: FirebaseAnalytics) {
   
  }


  pageViewLogger(pageName){
    try{
    this.firebaseAnalytics.logEvent('page_view', {page: pageName})
       .then((res: any) => {console.log(res)})
       .catch((error: any) => {console.error(error)});
    }catch(error){

      console.log(error);
    }

  }

  buttonClickLogger(buttonName){

    try{
    this.firebaseAnalytics.logEvent('button_click', {button: buttonName})
       .then((res: any) => {console.log(res)})
       .catch((error: any) => {console.error(error)});
      }catch(error){

        console.log(error);
      }
  }

  pageRefreshLogger(pageName){
    try{
    this.firebaseAnalytics.logEvent('page_refresh', {page: pageName})
       .then((res: any) => {console.log(res)})
       .catch((error: any) => {console.error(error)});
      }catch(error){

        console.log(error);
      }

  }
}
