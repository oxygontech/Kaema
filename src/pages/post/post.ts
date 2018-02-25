import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';
import { InterfaceProvider } from '../../providers/interface/interface';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { Location } from '../../models/location';

import { ViewPostPage } from '../view-post/view-post';

/**
 * Generated class for the PostPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google :any;

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  viewType:any;
  post =[];
  postKeys=[];
  loader:any;

   @ViewChild('postmap') mapDivRef :ElementRef;
  
    marker:any;
    myLocation ={} as Location;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afDatabase : AngularFireDatabase , private afAuth:AngularFireAuth,
               public interfac: InterfaceProvider,public locationService:LocationServiceProvider) {

    this.viewType='list';

    this.loader= this.interfac.presentLoadingDefault();
    this.loader.present();

    this.afDatabase.list('post',{
      query :{
        orderByChild:'status',
        equalTo:'Y',
        limitToLast:10
        //orderByKey:true                       
      }
    }).subscribe(postResult=>{


      //this.showMap(); 
     
     this.post =postResult.reverse();
     //this.postKeys=postResult.keys();
     this.loader.dismiss()
     console.log(this.post);

    });

  }
  

  ionViewDidLoad() {
    console.log('The map is up');
  }

  ionViewDidEnter(){
    
  }


  async showMap(){
    
   this.locationService.getCurrentLocation().then(result=>{
   
   
    const currentLocation={lat: result.latitude, lng: result.longitude};
    console.log(currentLocation);


    const mapOptions ={
      center:currentLocation,
      zoom:15
    }

    let map=new google.maps.Map(this.mapDivRef.nativeElement,mapOptions);
    this.marker=new google.maps.Marker({
              position:currentLocation,
              map:map,
              draggable: true,
              animation: google.maps.Animation.DROP,
              title:'You are here'});

    });


    
   
  }

  viewPost(selectedPost){
    console.log(selectedPost);
    this.navCtrl.push(ViewPostPage,{post:selectedPost});
  }
  


}
