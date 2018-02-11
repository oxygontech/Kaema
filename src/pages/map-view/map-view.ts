import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { Location } from '../../models/location';
import { InterfaceProvider } from '../../providers/interface/interface';

import { Storage } from '@ionic/storage';



/**
 * Generated class for the MapViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google :any;

@IonicPage()
@Component({
  selector: 'page-map-view',
  templateUrl: 'map-view.html',
})
export class MapViewPage {

  @ViewChild('map') mapDivRef :ElementRef;

  marker:any;
  myLocation ={} as Location;
  loader:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public locationService:LocationServiceProvider,private storage: Storage ,public interfac: InterfaceProvider ) {

                this.loader= this.interfac.presentLoadingDefault();
                this.loader.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapViewPage');
    this.showMap();
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

    this.loader.dismiss();

    
   
  }


  getMarkerLocation(){
    
    this.storage.set('myLat', this.marker.getPosition().lat());
    this.storage.set('myLng', this.marker.getPosition().lng());
    console.log(this.marker.getPosition().lat());
    this.navCtrl.pop();
  }

}
