import { Component,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { InterfaceProvider } from '../../providers/interface/interface';
import { User } from '../../models/user';
import { Profile } from '../../models/profile';
import { Chat } from '../../models/chat';
import { ChatMessage } from '../../models/chat_message';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase}  from 'angularfire2/database-deprecated';
import { Content } from 'ionic-angular';
/**
 * Generated class for the ChatMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-message',
  templateUrl: 'chat-message.html',
})


export class ChatMessagePage {
  


  
  user ={} as User;
  otherUser :String;
  profile ={} as Profile;
  otherUserProfile ={} as Profile;
  chat ={} as Chat;
  messages =[];
  loader :any;
  messageData ={} as ChatMessage;
  chatId :String;
  currentDate :String;
  messageText:String;
  tempUrl='assets/icon/avatar.png';
  public items: any[] = [];
 
  @ViewChild(Content) messagesContent;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase,
              private afAuth:AngularFireAuth,public interfac: InterfaceProvider) {

     this.messageData.text='';
     this.currentDate=(new Date()).toDateString();
     this.otherUserProfile.userPhotoURL=this.tempUrl;
         /*let msg1 ={} as ChatMessage;
          msg1.text='Helllo';
          msg1.userId='aGHu8ZiAwwcVcbiu7kcOuRgupH23';
          msg1.sendDate=(new Date()).toDateString();
          this.messages=[msg1,msg1,msg1,msg1,msg1,msg1,msg1,msg1];
          console.log(this.messages);*/


     this.intializeChat().then(()=>{
       //this.messagesContent.scrollToBottom(0);
    
    let scrollDown = setTimeout( () => {
      this.scrollToBottom();
      this.loader.dismiss();
    }, 2000);

  });

  


    }
      

  ionViewDidEnter(){
    let scrollDown = setTimeout( () => {
      this.readMessages(this.chatId);
    }, 2000);
   
  }

  scrollToBottom() {
    console.log('scroll');
    //this.messagesContent.scrollToBottom(0);

          this.messagesContent.scrollTo(0, this.messagesContent.getContentDimensions().contentHeight+(this.messages.length*35), 700);
        
       }

 readMessages(chatId){

   
  let readSubscription=this.afDatabase.list('chat_messages/'+chatId,{
    query :{
      orderByChild:'readStatus',
      equalTo:'N'
    }}).subscribe(chatResult=>{
   
    for (let message of chatResult){
      if(message.userId!=this.user.uId){
      this.afDatabase.object('chat_messages/'+chatId+'/'+message.$key).update({readStatus:'Y'});
      console.log(message.$key);
      }
   }
   readSubscription.unsubscribe();
 }) 
 }



  async intializeChat(){

     //presenting loader
      this.loader=this.interfac.presentLoadingDefault();
     this.loader.present();


     this.afAuth.authState.subscribe(userResult=>{
     
       this.otherUser=this.navParams.get('otherUser');
       //console.log(this.otherUser);
     if(userResult.uid){
       this.user.uId=userResult.uid;

          
          this.afDatabase.object('profile/'+this.user.uId).subscribe(result=>{
          this.profile=result;

            this.afDatabase.object('profile/'+this.otherUser).subscribe(otherProfile=>{
            this.otherUserProfile=otherProfile;

           
            let tempUserArray = [ this.user.uId, this.otherUser];
            
           this.sortUser(tempUserArray).then(resultArr=>{
          
                      this.afDatabase.list('chat/'+resultArr[0]+'_'+resultArr[1]).subscribe(requestResult=>{
                        
                        if(requestResult.length == 0 ||requestResult==null){
                          this.chat.userProfile1=this.profile;
                          this.chat.userId1=this.user.uId;
                          this.chat.userProfile2=this.otherUserProfile;
                          this.chat.userId2=this.otherUser;

                          this.afDatabase.object('chat/'+resultArr[0]+'_'+resultArr[1]).set(this.chat)

                          //Adding a Chat Under User
                          let userChat={chatId:resultArr[0]+'_'+resultArr[1],
                                        otherUser:resultArr[1]};

                         let userOtherChat={chatId:resultArr[0]+'_'+resultArr[1],
                                        otherUser:resultArr[0]};
                          
                          this.afDatabase.object('chat_user/'+resultArr[0]+'/'+resultArr[0]+'_'+resultArr[1]).set(userChat);
                          this.afDatabase.object('chat_user/'+resultArr[1]+'/'+resultArr[0]+'_'+resultArr[1]).set(userOtherChat);

                        }else{

                          this.afDatabase.list('chat_messages/'+resultArr[0]+'_'+resultArr[1]).subscribe(messageList=>{
                            this.messages=messageList;
                          })

                        }

                        this.chatId=resultArr[0]+'_'+resultArr[1];
                        this.readMessages(this.chatId);//read undread Messages
                      })
           })
          // this.loader.dismiss();
           });
          
       });
     
       
     }else{
       this.loader.dismiss();
       this.navCtrl.setRoot(LoginPage);
     }

   });

   
  }

  async sortUser(tempArray){
    return tempArray.sort();
  }

  async sendMessage(){

            
           
            this.messageData.text=this.messageText;
           this.messageData.userId=this.user.uId;
           this.messageData.readStatus='N';
           this.messageData.sendDate=(new Date()).toDateString();
           this.messageData.sendTime=(new Date()).toString();
           this.scrollToBottom();

           this.messageText='';
          //await this.messages.push(this.messageData);
          await this.afDatabase.list('chat_messages/'+this.chatId).push(this.messageData).then(()=>{
            
            this.afDatabase.object('chat/'+this.chatId).update({lastMessage : this.messageData.text,lastMessageUser:this.user.uId}).then(()=>{
              
             });
          });

          
          
  }

}
