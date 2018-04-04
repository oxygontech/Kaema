import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InterfaceProvider } from '../../providers/interface/interface';

import { BinRegistration } from '../../models/bin-registration'
import { AngularFireDatabase,FirebaseObjectObservable }  from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { WebServiceProvider } from '../../providers/web-service/web-service';

/*
  * ***************** HCI ISSUES *********************
  * 
  * 1. Complicated bin registration process -Resolved (Have minimal data entry and register through a QR code)
  * 2. User doesn't know whether the bin has been registered successfully -Resolved (Have a section that shows 
  *     the scan status)
  * 
  * **************** SECURITY RISKS ************
  * 1. Users registering using a random QR code -Resolved (The scanned code should match the registered bin codes
  *     that are already in the database)
  * 2. When more that one user registers the same bin all of them gain access to the leaderboard, which should only
  *     be accessible to one person per bin -Resolved (The first registrant is named the admin user who will be the 
  *     only one who can access the leaderboard) 
  */


@IonicPage()
@Component({
  selector: 'page-bin-registration',
  templateUrl: 'bin-registration.html',
})
export class BinRegistrationPage {

  binRegistration = {} as BinRegistration;
  userID:string;
  barcode:any;
  binMapped = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase:AngularFireDatabase,
    private afAuth:AngularFireAuth, private barcodeScanner:BarcodeScanner, public interfac:InterfaceProvider,
    private webService:WebServiceProvider) {

    this.binRegistration.foodPreference = 'Vegetarian'; //setting the default value

    let loader = this.interfac.presentLoadingDefault();
    loader.present();

    //authenticating the user
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

  //scanning the QR code
  async scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {
      this.barcode = barcodeData.text;

      let loader = this.interfac.presentLoadingDefault();
      loader.present();

      //checking if the bin ID is registered in the database
      this.afDatabase.list('admin_data/binIDs',{
        query :{
          orderByChild:'id',
          equalTo:this.barcode
        }
      }).subscribe(result=>{

        console.log(result);
        this.binRegistration.binID = result[0].id;

        //notifies user whether the scan was successful or not
        if(this.binRegistration.binID != null){

          this.binRegistration.binID = this.binRegistration.binID;
          this.interfac.presentToast('Scan successfull.');
          this.binMapped = true;

        }else{

          this.interfac.presentToast('Scan unsuccessful. This is an incorrect code.');

        }

        loader.dismiss();
      });

    },(err) => {
      console.log('Error: ', err);
      this.interfac.presentToast('An error occurred');
    });
  }

  //validates whether barcode was scanned and the no. of people entered is correct
  validateInputs(){

    if(this.binRegistration.noOfPeople == 0 || this.binRegistration.noOfPeople == null){

      this.interfac.presentToast('Please enter the correct number of people');
      return false;

    }else if(!this.binMapped){

      this.interfac.presentToast('Please scan the bin barcode');
      return false;

    }else{

      return true;
    }
  }

  //registers the bin by mapping its details with the user ID in the database
  async registerBin(){
    
    if(this.validateInputs){

      let loader = this.interfac.presentLoadingDefault();
      loader.present();
      this.binRegistration.userId = this.userID;

      await this.afDatabase.list('bin_registration/',{
        query :{
          orderByChild:'binID',
          equalTo:this.binRegistration.binID
        }
      }).subscribe(result=>{

        //if this is the first bin registrant they are made the admin user
        if(result.length > 0){
          this.binRegistration.adminUser = false;
        }else{
          this.binRegistration.adminUser = true;
        }

        //adds the bin registration data to the database
        this.afDatabase.object('bin_registration/' + this.binRegistration.binID + '_' +
        this.userID).set(this.binRegistration).then(()=>{

          loader.dismiss();
          this.interfac.presentToast("Bin has been added successfully");
          this.navCtrl.pop(); //opens the previous waste monitor
        })
      });
    }
  }
}
