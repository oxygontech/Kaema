import { Http , Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import {SERVICE_URL} from '../../app/app.config';
/*
  Generated class for the WebServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WebServiceProvider {

  constructor(private http :Http) {
    
  }

  
  async editProfile(userId){

    /*this.http.post('https://kaema.azurewebsites.net/service?userId='+this.user.uId)
    .map(res => res.json())
    .subscribe(data => {
     console.log(data);
    });*/


    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
 
    let postParams = {
      userId: userId
    }
    
    await this.http.post(SERVICE_URL+"/profile", postParams, options)
      .subscribe(data => {
        console.log(data['_body']);
        return data;
       }, error => {
        console.log(error);// Error getting the data
      });
  }


  async sharePost(){

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
 
    /*let postParams=shareObj;
    console.log('WebService : ');
    console.log(shareObj);*/

    
    await this.http.post(SERVICE_URL+"/share", options)
   //await this.http.post("localhost:1337/service/share", options)
      .subscribe(data => {
        console.log(data['_body']);
        return data;
       }, error => {
        console.log(error);// Error getting the data
      });


  }


   


}
