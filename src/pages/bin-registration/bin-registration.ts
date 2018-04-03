import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InterfaceProvider } from '../../providers/interface/interface';

import { BinRegistration } from '../../models/bin-registration'
import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { WebServiceProvider } from '../../providers/web-service/web-service';


/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.



 */

@IonicPage()
@Component({
  selector: 'page-bin-registration',
  templateUrl: 'bin-registration.html',
})
export class BinRegistrationPage {


  binRegistration = {} as BinRegistration;
  userID:string;
  codeScanned:boolean;
  barcode:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase:AngularFireDatabase,
              private afAuth:AngularFireAuth, private barcodeScanner:BarcodeScanner, public interfac:InterfaceProvider,
              private webService:WebServiceProvider) {

                let loader = this.interfac.presentLoadingDefault();
                loader.present();

                this.afAuth.authState.subscribe(result=>{
                    if(result.uid){
                       this.userID = result.uid;
                       loader.dismiss;
                    }else{
                      this.navCtrl.setRoot(BinRegistrationPage);
                    }

                });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BinRegistrationPage');
  }


  scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {
      this.barcode = barcodeData.text;

      console.log("BARCODE VALUE::::: " + this.barcode);

      let loader = this.interfac.presentLoadingDefault();
      loader.present();

      this.afDatabase.list('admin_data/binIDs',{
        query :{
          orderByChild:'id',
          equalTo:this.barcode
        }
      }).subscribe(result=>{
        this.binRegistration.binID = result[0].id;
        loader.dismiss();
      });

      console.log("BARCODE VALUE 2 :::: " + this.binRegistration.binID);


      if(this.binRegistration.binID != null){

        this.binRegistration.binID = this.binRegistration.binID + " - " + this.userID;

        this.afDatabase.list('bin_registration').push(this.binRegistration).then(result=>{

          loader.dismiss();
          this.interfac.presentToast('You have successfully registered your bin.');
          this.codeScanned = true;

        });//Making Server Aware of a sharing event

      }else{
        this.interfac.presentToast('Scan unsuccessful. This is an incorrect code.');
      }
    }, (err) => {
      console.log('Error: ', err);
      this.interfac.presentToast('An error occurred');
    });
  }

  async registerBin(){

      //if(this.binRegistration.noOfPeople )
      /*this.loader = await this.interfac.presentLoadingDefault();
     	this.loader.present();

   try{
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(this.email,this.password);
       if(result){

        this.profile.firstName=this.email;
        this.profile.email=this.email;
        this.profile.bio='';
        this.profile.website='';
        this.profile.userPhotoURL='../../assets/icon/avatar.png';

  		            try{
  					  const loginResult=this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password);
  					  if(loginResult){

                this.afAuth.authState.subscribe(result=>{
                      if(result.uid){

                        this.afDatabase.object(`profile/${result.uid}`).set(this.profile)
                        .then(()=>{

                          this.storage.set('status', true)
                          this.storage.set('email', this.email)
                          this.storage.set('password', this.password)

                          this.leader_board.score=0;
                          this.leader_board.userId=result.uid;
                          this.leader_board.userProfile=this.profile;

                          this.afDatabase.object(`leader_board/${result.uid}`).set(this.leader_board).then(()=>{

                            this.navCtrl.push(HomePage)
                            this.loader.dismiss()

                          })



                        }




                         );
                      }
                  });




  					    }
  					  }catch(e){
                this.loader.dismiss();
  					    console.error(e);
  					  }
        }
    }catch(e){

       this.loader.dismiss();
       this.interfac.presentToast(e.message);
       console.error(e);
     }*/
    }




  }

