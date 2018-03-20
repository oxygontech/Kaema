import { Http , Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

/*
  Generated class for the WebServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WebServiceProvider {

  constructor(private http :Http) {
    
  }

  
  editProfile(userId){

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
    
    this.http.post("https://kaema.azurewebsites.net/service/profile", postParams, options)
      .subscribe(data => {
        console.log(data['_body']);
       }, error => {
        console.log(error);// Error getting the data
      });
  }


  async sharePost(shareObj){

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
 
    let postParams=shareObj;
    console.log('WebService : ');
    console.log(shareObj);

    
    this.http.post("http://kaema.azurewebsites.net/service/share",postParams, options)
      .subscribe(data => {
        console.log(data['_body']);
       }, error => {
        console.log(error);// Error getting the data
      });


  }





}
