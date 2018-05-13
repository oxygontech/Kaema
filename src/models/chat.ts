import { Profile } from '../models/profile';
import { ChatMessage } from '../models/chat_message';

export interface Chat{
    
    userProfile1 :Profile;
    userProfile2 :Profile;
    userId1 :String;
    userId2 :String;
    lastMessage  :String;
    lastMessageTime :String;

   
    
    
    

}