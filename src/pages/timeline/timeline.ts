import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



import {PostPage  } from "../post/post";
import {NotificationPage} from "../notification/notification";


/**
 * Generated class for the TimelinePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})



export class TimelinePage {

 // blog=BlogPage;
  post=PostPage;
  notify =NotificationPage; 

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimelinePage');
  }

}
