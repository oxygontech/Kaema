import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';


import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import {AngularFireAuth} from 'angularfire2/auth';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  showSplash = false;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar,
               public splashScreen: SplashScreen,private storage: Storage,
               private afAuth:AngularFireAuth) {

    // timer(3000).subscribe(() => this.showSplash = false)
    // used for an example of ngFor and navigation

 
    this.storage.get('status').then((val) => {
      if(val){

        this.afAuth.authState.subscribe(result=>{          
          if(result!=null){
           
            this.rootPage= HomePage;
          }else{
          this.storage.set('status',false);
          this.rootPage= LoginPage;
         }
    
      });

      }else{
        this.rootPage= LoginPage;
      }

      this.splashScreen.hide();
    }).catch(function(error){
      this.rootPage= LoginPage;
      this.splashScreen.hide();
    });




  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
