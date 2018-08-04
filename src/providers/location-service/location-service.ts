
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
        
  
       // console.log(resp);
  
        
        
       }).catch((error) => {
         console.log('Error getting location', error.message);
         return null;
       });


        return this.location;
    }


    async getDistance(lat1,lng1,userLat,userLng){

let distance : any;
    
console.log(userLat+' '+userLng);
  
        let userLocation={lat: userLat, lng: userLng};
        let placeLocation={lat: lat1, lng: lng1};
  
        distance=this.getDistanceBetweenPoints(
            userLocation,
            placeLocation,
            'km'
        ).toFixed(2);
  
        console.log(distance);
        return distance;
    }


    getDistanceBetweenPoints(start, end, units){
 
      let earthRadius = {
          miles: 3958.8,
          km: 6371
      };

      let R = earthRadius[units || 'miles'];
      let lat1 = start.lat;
      let lon1 = start.lng;
      let lat2 = end.lat;
      let lon2 = end.lng;

      let dLat = this.toRad((lat2 - lat1));
      let dLon = this.toRad((lon2 - lon1));
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;

      return d;

  }

  toRad(x){
      return x * Math.PI / 180;
  }
}
