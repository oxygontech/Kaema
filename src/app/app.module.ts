import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import { IonicStorageModule } from '@ionic/storage';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import {TimelinePage} from '../pages/timeline/timeline';
import {MonitorPage} from '../pages/monitor/monitor';
import {MorePage} from '../pages/more/more';
import {BlogPage  } from "../pages/blog/blog";
import {PostPage  } from "../pages/post/post";
import {NotificationPage} from "../pages/notification/notification";


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FIREBASE_CONFIG} from './app.firebase.config';
import { InterfaceProvider } from '../providers/interface/interface';
import { SuperTabsModule } from "ionic2-super-tabs";


@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    RegisterPage,
    HomePage,
    TimelinePage,
    MonitorPage,
    MorePage,
    BlogPage,
    PostPage,
    NotificationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, { links: [] }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    RegisterPage,
    HomePage,
    TimelinePage,
    MonitorPage,
    MorePage,
    BlogPage,
    PostPage,
    NotificationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    InterfaceProvider
  ]
})
export class AppModule { }
