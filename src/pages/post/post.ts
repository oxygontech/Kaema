import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams  } from 'ionic-angular';


import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';
import { InterfaceProvider } from '../../providers/interface/interface';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { Location } from '../../models/location';

import { ViewPostPage } from '../view-post/view-post';
import { AddPostPage } from '../add-post/add-post';
import { NotificationPage } from '../notification/notification';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';
import { ChatPage } from '../chat/chat';
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
  undreadNotification=0;
  undreadChat=0;

   @ViewChild('postmap') mapDivRef :ElementRef;
  
    marker:any;
    myLocation ={} as Location;
    batch=2;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afDatabase : AngularFireDatabase , private afAuth:AngularFireAuth,
               public interfac: InterfaceProvider,public locationService:LocationServiceProvider,
               private eventLogger :EventLoggerProvider/*,
  private messageProvider:CloudMessagingProvider*/) {

    this.viewType='list';
    this.loadPostList();

    this.afAuth.authState.subscribe(result=>{          
      if(result.uid){
       this.loadNotifications(result.uid);
       this.loadUnreadMessages(result.uid);
    }

  });

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

                        
                      this.lastKey=postResult[0].$key;
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
  


  ionViewDidEnter(){
    this.eventLogger.pageViewLogger('timeline');//analaytic data collection

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

                    if(postResult[0].$key==this.lastKey){
                      this.dataFinished=true;
                    }else{
                      this.lastKey=postResult[0].$key;
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
  

  addPost(){
    this.eventLogger.buttonClickLogger('add_post');//analaytic data collection
    this.navCtrl.push(AddPostPage);
    }

    
  showNotifications(){
    this.navCtrl.push(NotificationPage);
    }

    showChat(){
      this.navCtrl.push(ChatPage);
      }

    loadNotifications(userId){


      this.afDatabase.list('notifications/'+userId).subscribe(requestResult=>{
  
       let notifyList =requestResult.reverse();
       this.undreadNotification=0;
       for (let item of notifyList){
            if(item.readStatus=="Y"){
              continue;
            }
            this.undreadNotification++;
          }
      })
    }

    loadUnreadMessages (userId){

      this.afDatabase.list('chat_user/'+userId).subscribe(requestResult=>{
    
        for (let item of requestResult){
          this.afDatabase.list('chat_messages/'+item.chatId).subscribe(chatMessageResult=>{
            
             let chatCount=0;
             for (let messageValue of chatMessageResult){
              if(messageValue.readStatus=='N' && messageValue.userId!=userId){
                chatCount++;
               }
            }
            this.undreadChat=chatCount;
          }) 
         }
      })
    }

}
