
import { Injectable } from '@angular/core';
import firebase from 'firebase';


/*
  Generated class for the FirebaseImageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseImageServiceProvider {

  constructor() {
    
  }






  async saveImage(fileName,folderPath,imageURL) {
   
    let firebaseURL='';
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    
  
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`${folderPath}/${fileName}.jpg`);
  
    await imageRef.putString(imageURL, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
     // Do something here when the data is succesfully uploaded!
   
   
   
     /*this.getImage(`${folderPath}/${fileName}.jpg`).then((result)=>{
        this.afDatabase.object('profile/'+this.user.uId).update({userPhotoURL:result});
        loader.dismiss();
        this.closePage();
    });*/
  
         
     
    });
  
    firebaseURL=await this.getImage(`${folderPath}/${fileName}.jpg`)
    return firebaseURL;
  }


  async getImage(imageUrl){
    
      let storageRef = firebase.storage().ref();
      let photoUrl='';
    
    
      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(imageUrl);
    
      await imageRef.getDownloadURL().then((snapshot)=> {
       // Do something here when the data is succesfully uploaded!
       photoUrl=snapshot;
      },(err)=>{
        
        console.log(err);
        
      });
      return photoUrl;
    }

  

}
