import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InterfaceProvider } from '../../providers/interface/interface';

/**
 * Generated class for the BinRegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bin-registration',
  templateUrl: 'bin-registration.html',
})
export class BinRegistrationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public interfac: InterfaceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BinRegistrationPage');
  }

}
