import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';
import { InterfaceProvider } from '../../providers/interface/interface';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { Location } from '../../models/location';

import { ViewPostPage } from '../view-post/view-post';
//import { CloudMessagingProvider } from '../../providers/cloud-messaging/cloud-messaging';

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
  lastKey:any;
  dataFinished=false;

   @ViewChild('postmap') mapDivRef :ElementRef;
  
    marker:any;
    myLocation ={} as Location;
    batch=10;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afDatabase : AngularFireDatabase , private afAuth:AngularFireAuth,
               public interfac: InterfaceProvider,public locationService:LocationServiceProvider/*,
  private messageProvider:CloudMessagingProvider*/) {

    this.viewType='list';
    this.loadPostList();

    /*this.messageProvider.getToken().then(()=>{

      console.log('Token received');
          // Listen to incoming messages
          this.messageProvider.listenToNotifications().subscribe(msg => {
            // show a toast
           let toastMsg=this.interfac.presentToast(msg.body)
          })

    })*/
    

  }

async  loadPostList(){

    let loader= this.interfac.presentLoadingDefault();
    loader.present();
    


   let  postSubscription =  this.afDatabase.list('post',{
                        query :{
                          orderByChild:'status',
                          equalTo:'Y',
                          limitToLast:this.batch
                                                
                        }
                      }).subscribe(postResult=>{

                      this.lastKey=postResult.keys[0];
                      this.post =postResult.reverse();

                      if(postResult.length==this.batch){
                        this.dataFinished=false;
                      }else{
                        this.dataFinished=true;
                      }
                      
                      loader.dismiss();
                      postSubscription.unsubscribe();//removing realtime link to firebase
                      });

  //Removing the realtime link to firebase DB             

  }
  
  ionViewWillEnter(){
    //this.loadPostList();
  }


  ionViewDidLoad() {
   // console.log('The map is up');
  
  }

  ionViewDidEnter(){
    this.loadPostList();
  }

  refresh(refresher){

    this.loadPostList();
    refresher.complete();
  }

  async scrollDown(infiniteScroll){

   if(!this.dataFinished) {

   let postSubscription=await this.afDatabase.list('post',{
                      query :{
                        orderByChild:'status',
                        equalTo:'Y',
                        limitToLast:(this.batch+1),
                        endAt:this.lastKey
                                              
                      }
                    }).subscribe(postResult=>{

                    let i=0;

                    for (let item of postResult.reverse() ){
                      if(i!=0){//not the first element,Because first element has already been added to Post List
                      this.post.push(item);
                      }else{
                        i++;
                      }
                    }

                    if(postResult.keys[0]==this.lastKey){
                      this.dataFinished=true;
                    }else{
                      this.lastKey=postResult.keys[0];
                    }
                    
                        infiniteScroll.complete();
                        postSubscription.unsubscribe(); //removing realtime link to firebase
                        });

                       
      }else{
        infiniteScroll.complete();
      }
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
