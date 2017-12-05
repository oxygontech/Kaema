import { Component } from '@angular/core';

import { LoginPage } from '../login/login';
import {AngularFireAuth} from 'angularfire2/auth';
import { NavController } from 'ionic-angular';
import { InterfaceProvider } from '../../providers/interface/interface';
import { User } from '../../models/user';


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

 num1=0;
 num2 =0;
 answer=0;

 uId=null;
 Uemail=null;
 Uphoto=null;

user ={} as User;


  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController,
               public interfac: InterfaceProvider) {

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.user.userPhotoURL='../../assets/icon/avatar.svg';
    this.afAuth.authState.subscribe(result=>{
  
      if(result.uid){
          this.user.uId=result.uid;
          this.user.username=result.displayName;
          this.user.userEmail=result.email;
          
          if(result.photoURL!=null){
          this.user.userPhotoURL=result.photoURL;
          }
         
           console.log(this.user);
      }else{
        this.interfac.presentToast('User Cannot be Found');
      }

    });
  }

calculate(){

   //  console.log(jsFunctions);
      /* let  num1 = this.num1 ? parseFloat(this.num1) : 0 ;
        let  num2 = this.num2 ? parseFloat(this.num2) : 0;
        this.answer= num1 + num2 ;*/

        console.log(this.num1 +" + "+this.num2 );
       
  	 this.answer=this.addNumbers(this.num1,this.num2);//parseFloat(this.num1) +parseFloat(this.num2);//addNumber(this.num1,this.num2);
  	 console.log(this.answer);
  }


addNumbers(n1,n2){

        console.log("Reached");
        let return_val=parseFloat(n1) +parseFloat(n2);
        return return_val ;

   //  return num1+num2;

  }


 
}
