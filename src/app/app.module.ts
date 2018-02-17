import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database-deprecated';
import { IonicStorageModule } from '@ionic/storage';


import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import {TimelinePage} from '../pages/timeline/timeline';
import {MonitorPage} from '../pages/monitor/monitor';
import {MorePage} from '../pages/more/more';
import {PostPage  } from "../pages/post/post";
import {NotificationPage} from "../pages/notification/notification";
import {ProfilePage} from "../pages/profile/profile";
import {ImageViewPage} from "../pages/image-view/image-view";
import { AddPostPage } from '../pages/add-post/add-post';
import { MapViewPage } from '../pages/map-view/map-view';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { ViewPostPage } from '../pages/view-post/view-post';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import {FIREBASE_CONFIG} from './app.firebase.config';
import { InterfaceProvider } from '../providers/interface/interface';
import { SuperTabsModule } from "ionic2-super-tabs";
import { FirebaseImageServiceProvider } from '../providers/firebase-image-service/firebase-image-service';
import { LocationServiceProvider } from '../providers/location-service/location-service';
import { Geolocation } from '@ionic-native/geolocation';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    TimelinePage,
    MonitorPage,
    MorePage,
    PostPage,
    NotificationPage,
    ProfilePage,
    ImageViewPage,
    AddPostPage,
    MapViewPage,
    LeaderboardPage,
    ViewPostPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, { links: [] }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    TimelinePage,
    MonitorPage,
    MorePage,
    PostPage,
    NotificationPage,
    ProfilePage,
    ImageViewPage,
    AddPostPage,
    MapViewPage,
    LeaderboardPage,
    ViewPostPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    InterfaceProvider,
    FirebaseImageServiceProvider,
    LocationServiceProvider,
    Geolocation
  ]
})
export class AppModule { }
