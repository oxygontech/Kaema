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
  binMapped=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase:AngularFireDatabase,
              private afAuth:AngularFireAuth, private barcodeScanner:BarcodeScanner, public interfac:InterfaceProvider,
              private webService:WebServiceProvider) {

                this.binRegistration.foodPreference='vegetarian';//setting default value

                let loader = this.interfac.presentLoadingDefault();
                loader.present();

                this.afAuth.authState.subscribe(result=>{
                    if(result.uid){
                       this.userID = result.uid;
                       loader.dismiss();
                    }else{
                      this.navCtrl.setRoot(BinRegistrationPage);
                      loader.dismiss();
                    }

                });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BinRegistrationPage');
  }


  async scanCode() {

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
        console.log(result);
        this.binRegistration.binID = result[0].id;

        if(this.binRegistration.binID != null){
          this.binRegistration.binID = this.binRegistration.binID ;//+ " - " + this.userID;
          this.interfac.presentToast('Scan Successfull.');
          this.binMapped=true;
        }else{
          this.interfac.presentToast('Scan unsuccessful. This is an incorrect code.');
        }

        loader.dismiss();
      });

      console.log("BARCODE VALUE 2 :::: " + this.binRegistration.binID);


     
    }, (err) => {
      console.log('Error: ', err);
      this.interfac.presentToast('An error occurred');
    });
  }

  validateInputs(){

    if(this.binRegistration.noOfPeople==0||this.binRegistration.noOfPeople==null){
      this.interfac.presentToast('Please Enter Correct number of people');
      return false;
    }else if(!this.binMapped){
      this.interfac.presentToast('Please Scan the bin barcode');
      return false;
    }else{
      return true;
    }

  
  }



  async registerBin(){

    if(this.validateInputs){

      let loader = this.interfac.presentLoadingDefault();
      loader.present();
      this.binRegistration.userId=this.userID;

    await  this.afDatabase.list('bin_registration/',{
        query :{
          orderByChild:'binID',
          equalTo:this.binRegistration.binID
        }
      }).subscribe(result=>{
        //console.log(result);
        //this.binRegistration.binID = result[0].id;
       if(result.length>0){
        this.binRegistration.adminUser=true;
       }else{
        this.binRegistration.adminUser=false;
       }
        
       this.afDatabase.object('bin_registration/'+this.binRegistration.binID+'_'+this.userID).set(this.binRegistration).then(()=>{

        
        loader.dismiss();
        this.interfac.presentToast("Bin has been added Successfully");
        this.navCtrl.pop();
     })
     
        
      });

      
      
    }
  }




  }

