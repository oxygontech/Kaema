import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { InterfaceProvider } from '../../providers/interface/interface';
import { User } from '../../models/user';
import { Profile } from '../../models/profile';
import { Chat } from '../../models/chat';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase}  from 'angularfire2/database-deprecated';
import { ChatMessagePage } from '../chat-message/chat-message';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})


export class ChatPage {

user ={} as User;
loader :any;
chatList =[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase,
    private afAuth:AngularFireAuth,public interfac: InterfaceProvider) {

       this.intializeChatList();
  }
  
async intializeChatList(){

    //presenting loader
    this.loader=this.interfac.presentLoadingDefault();
    this.loader.present();

         await this.afAuth.authState.subscribe(userResult=>{
        
          if(userResult.uid){
            this.user.uId=userResult.uid;


        this.afDatabase.list('chat_user/'+this.user.uId).subscribe(requestResult=>{

        //console.log(requestResult);
      
        for (let item of requestResult){
        
        
        this.afDatabase.object('chat/'+item.chatId).subscribe(chatResult=>{

          
          let chatCount=0;
          
          this.afDatabase.list('chat_messages/'+item.chatId).subscribe(chatMessageResult=>{
            this.chatList=[];
            chatCount=0;

             for (let messageValue of chatMessageResult){
            

              if(messageValue.readStatus=='N' && messageValue.userId!=this.user.uId){
                chatCount++;
               }
               
            }

            if(chatResult.userId1==this.user.uId){
              let chatObj ={userName:chatResult.userProfile2.firstName, 
                             profileImg:chatResult.userProfile2.userPhotoURL,
                             otherUser:chatResult.userId2,
                             lastMessage:chatResult.lastMessage,
                             lastMessageUser:chatResult.lastMessageUser,
                             unreadCount:chatCount}
  
              this.chatList.push(chatObj);
            }else{
              let chatObj ={userName:chatResult.userProfile1.firstName, 
                            profileImg:chatResult.userProfile1.userPhotoURL,
                            otherUser:chatResult.userId1,
                            lastMessage:chatResult.lastMessage,
                            lastMessageUser:chatResult.lastMessageUser,
                            unreadCount:chatCount}
              this.chatList.push(chatObj);
            }
           

          })
         

         
         
          })
        }

        this.loader.dismiss();
      })

    }else{
      this.loader.dismiss();
      this.navCtrl.setRoot(LoginPage);
    }

    });


  }


  openChat(otherUserId){
    this.navCtrl.push(ChatMessagePage,{otherUser:otherUserId});
  }

}
