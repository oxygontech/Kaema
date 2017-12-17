import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MorePage } from '../more/more';
import { MonitorPage } from '../monitor/monitor';


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


  monitor=MonitorPage;
  more=MorePage;
  timeline :String; 

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.timeline="blog";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimelinePage');
  }

}
