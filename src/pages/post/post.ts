import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams  } from 'ionic-angular';


import {AngularFireDatabase}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';
import { InterfaceProvider } from '../../providers/interface/interface';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { Location } from '../../models/location';

import { ViewPostPage } from '../view-post/view-post';
import { AddPostPage } from '../add-post/add-post';
import { NotificationPage } from '../notification/notification';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';
import { ChatPage } from '../chat/chat';
import * as _ from 'lodash';
import { User } from '../../models/user';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
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
  user ={} as User;
  filteredPost=[];
  filteredLessPost=[];
  filteredGreaterPost=[];
  loader:any;
  lastKey:any;
  dataFinished=false;
  undreadNotification=0;
  undreadChat=0;
  batchCount=0;
  currentLocation : any;
  nearPostMsg='Scanning for nearby Post';
  minDistance=2;
  noPostMsg='Sorry! No Post within a '+this.minDistance+'km radius';
  noLocMsg='Please turn on location setting\'s for the best experience';
    /// Active filter rules
    filters = {}

   @ViewChild('postmap') mapDivRef :ElementRef;
  
    marker:any;
    myLocation ={} as Location;
    batch=10;
   
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afDatabase : AngularFireDatabase , private afAuth:AngularFireAuth,
               public interfac: InterfaceProvider,public locationService:LocationServiceProvider,
               private eventLogger :EventLoggerProvider,private diagnostic: Diagnostic,public plt: Platform/*,
  private messageProvider:CloudMessagingProvider*/) {

    this.viewType='list';
    //this.loadPostList();

    this.afAuth.authState.subscribe(async result=>{          
      if(result.uid){
        
        this.user.uId=result.uid;
            
       this.getUserLocation(result.uid).then(()=>{
        this.loadPostList();
       });       
       
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

  async getUserLocation (uid){

    /*let profileSubscription=await this.afDatabase.object('profile/'+uid+'/location').subscribe(async profileLocation=>{
      console.log(profileLocation);
    });*/

if (!this.plt.is('core')) {
    this.diagnostic.isLocationEnabled().then(
      async (isAvailable) => {
      if(isAvailable){
        await this.locationService.getCurrentLocation().then(async resultLocation=>{
   
          console.log(resultLocation);
          if(resultLocation !=null){
          this.currentLocation=resultLocation;
          this.afDatabase.object('profile/'+uid).update({location:this.currentLocation});
          //this.interfac.presentToast('GPD location OK');
          }
        })
      
      }else{
        let profileSubscription=await this.afDatabase.object('profile/'+uid+'/location').subscribe(async profileLocation=>{
          console.log(profileLocation);

          if( profileLocation.latitude!=null){
            this.currentLocation=profileLocation;
            //this.interfac.presentToast('Firebase location OK');
          }else{
            this.interfac.presentToast('Please turn on location setting to get the best experience');
          }

          profileSubscription.unsubscribe();
        });
      }
    })   
  }else{
    await this.locationService.getCurrentLocation().then(async resultLocation=>{
   
      console.log(resultLocation);
      if(resultLocation !=null){
      this.currentLocation=resultLocation;
      this.afDatabase.object('profile/'+uid).update({location:this.currentLocation});
      //this.interfac.presentToast('GPD location OK');
      }
    })
   }     
  }


  private async  applyFilters() {
      
      this.filteredPost = await _.filter(this.post, _.conforms(this.filters) )
      try{
      await this.applyFilterLessThan();
      await this.applyFilterGreaterThan();

      if(this.filteredGreaterPost.length==0 && this.filteredLessPost.length==0){
        this.filteredGreaterPost=this.filteredPost;
        this.nearPostMsg=this.noLocMsg;
      }

      }catch(error){
        this.filteredGreaterPost=this.filteredPost;
        this.nearPostMsg=this.noLocMsg;
      }
     
 
    
  }

  
  /// filter property by equality to rule
  filterExact(property: string, rule: any) {
    this.filters[property] = val => val == rule
    this.applyFilters()
  }

  /// filter  numbers less than rule
  applyFilterLessThan() {
     let tempFilters={};
     tempFilters['distance'] = val => +val < this.minDistance
    this.filteredLessPost=_.filter(this.filteredPost, _.conforms(tempFilters) )
    
  }

  /// filter  numbers greater than rule
  applyFilterGreaterThan() {
    let tempFilters={};
     tempFilters['distance']  = val => +val > this.minDistance
     this.filteredGreaterPost=_.filter(this.filteredPost, _.conforms(tempFilters) )
  }


async  loadPostList(){

    let loader= this.interfac.presentLoadingDefault();
    loader.present();
    


   let  postSubscription =  this.afDatabase.list('post',{
                        query :{orderByKey:true,
                          limitToLast:this.batch
                                                
                        }
                      }).subscribe(async postResult=>{      

                        
                      this.lastKey=postResult[0].$key;
                      postResult.reverse();
                      this.post=[];
                      let l=0;
                       for (let item of  postResult){
                       
                      if(this.currentLocation){
                          await this.locationService.getDistance(item.location.latitude,item.location.longitude,
                            this.currentLocation.latitude,this.currentLocation.longitude).then(result=>{
                          item.distance=result;
                          this.post.push(item);
                       }).catch(error=>{
                          this.interfac.presentToast(error);
                        });
                      }else{
                        this.post.push(item);
                      }
                        //this.interfac.presentToast('Loop.....'+l);
                        l++;
                      }
                      if(postResult.length==this.batch){
                        this.dataFinished=false;
                        
                      }else{
                        this.dataFinished=true;
                      }

                    await this.filterExact('status','Y');
                    if(!(this.dataFinished) && this.filteredLessPost.length<this.batch){
                    this.loadMorePost(this.filteredLessPost.length,'initial');
                    }else{
                      this.nearPostMsg=this.noPostMsg;
                    }
                      loader.dismiss(); 
                      postSubscription.unsubscribe();//removing realtime link to firebase
                      });

  //Removing the realtime link to firebase DB             

  }
  
  ionViewDidEnter(){
    this.eventLogger.pageViewLogger('timeline');//analaytic data collection
    //this.loadPostList();
  }

  refresh(refresher){

    this.getUserLocation(this.user.uId).then(()=>{
      this.loadPostList();
     });    
    refresher.complete();
  }

  async scrollDown(infiniteScroll){
   if(!this.dataFinished) {
      
      this.loadMorePost(0,'').then(()=>{//0 passed in so that 5 new records will be loaded
                infiniteScroll.complete();
               })
      }else{
        infiniteScroll.complete();
      }
    }




    async loadMorePost(num,screen){

      
      this.batchCount=num;
      if(!(this.dataFinished) && this.batchCount<this.batch){
       
        //let loader= this.interfac.presentLoadingDefault();
        this.nearPostMsg='Scanning for nearby Post';
       /* if(screen=='initial'){
          loader.present();
        }*/
        

        let postSubscription=await this.afDatabase.list('post',{
                    query :{orderByKey:true,
                      limitToLast:(this.batch+1),
                      endAt:this.lastKey
                                            
                    }
                  }).subscribe(async postResult=>{

                  let i=0;

                  if(postResult[0].$key==this.lastKey){
                    this.dataFinished=true;
                    this.nearPostMsg=this.noPostMsg;
                  }else{
                    this.lastKey=postResult[0].$key;
                    postResult.reverse();
                    for (let item of  postResult){
                      if(i!=0){//not the first element,Because first element has already been added to Post List
                        if(this.currentLocation){
                        await this.locationService.getDistance(item.location.latitude,item.location.longitude
                                                               ,this.currentLocation.latitude,this.currentLocation.longitude).then(result=>{
                          item.distance=result;
                          this.post.push(item);
                          this.batchCount++;
                        });
                      }else{
                        this.post.push(item);
                        this.batchCount++;
                      }
                      
                     
                      }else{
                        i++;
                      }
                    }
                    await this.filterExact('status','Y');
                    
                    /*if(screen=='initial'){
                      loader.dismiss();
                    }*/
                    this.loadMorePost(this.filteredLessPost.length,screen);//recursive call until  new post's are filtered and printed matching the batch value
                    
                  }
                      postSubscription.unsubscribe(); //removing realtime link to firebase
                      });
         
        }else{
          this.nearPostMsg=this.noPostMsg;
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
