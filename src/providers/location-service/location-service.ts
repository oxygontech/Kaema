
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Location } from '../../models/location';


/*
  Generated class for the LocationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationServiceProvider {

  location ={} as Location;


  constructor(public geoLoc:Geolocation) {


    
  }

    async getCurrentLocation(){

      await this.geoLoc.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
  
        this.location.latitude=resp.coords.latitude;
        this.location.longitude=resp.coords.longitude;
        
  
        console.log(resp);
  
        
        
       }).catch((error) => {
         console.log('Error getting location', error);
         
       });


        return this.location;
    }

}
