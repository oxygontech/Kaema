import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from '../../models/post';

/**
 * Generated class for the ViewPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-post',
  templateUrl: 'view-post.html',
})
export class ViewPostPage {

  post ={} as Post;
  locationImage:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    if(navParams.get('post')!=null){
      this.post=navParams.get('post');
      this.locationImage='https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=600x300&maptype=roadmap'+
      '&markers=color:red%7Clabel:C%7C'+this.post.location.latitude+','+this.post.location.longitude+
      '&key=AIzaSyBQP6abQtIy-p2SGetONO3L1-XVwxOZP-g';
      }
  }

  ionViewDidLoad() {
    
  }

}
