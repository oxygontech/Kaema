import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ToastController ,LoadingController,ActionSheetController } from 'ionic-angular';

/*
  Generated class for the InterfaceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class InterfaceProvider {

  constructor(public toastCtrl: ToastController,public loadingCtrl: LoadingController,
              public actionSheetCtrl: ActionSheetController) {
   
  }

  //Toast's Go Here

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }


  presentLoadingDefault() {
  let loading = this.loadingCtrl.create({
    spinner:"crescent",
    content: 'Please wait...',
    duration:15000
  });

   return loading;
   }


   //Action Sheets Go Here


   presentActionSheet(titleSet,buttonsList){

    let actionSheet = this.actionSheetCtrl.create({
      title: titleSet,
      buttons: buttonsList
    });

    return actionSheet;

   }
}
