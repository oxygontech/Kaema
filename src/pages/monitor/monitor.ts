import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';

import { InterfaceProvider } from '../../providers/interface/interface';

import { WasteMonitor } from '../../models/waste-monitor';
import { BinRegistrationPage } from '../bin-registration/bin-registration'
import { AlertController } from 'ionic-angular';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';

/*
  * ***************** HCI ISSUES *********************
  * 
  * 1. The graph is too small to read -Resolved (chart.js was used to create a dynamic graph)
  * 2. Only data related to the user should show up -Need to resolve (this can be done by retriveing only the
  *     user data from the database)
  * 
  * **************** SECURITY RISKS ************
  * 1. Users who aren't authorized shouldn't be able to view the monitor -Resolved (The monitor is only shown 
  *     to those that have registered the bin) 
  *  
  */

@IonicPage()
@Component({
  selector: 'page-monitor',
  templateUrl: 'monitor.html',
})

export class MonitorPage {

    numberTasks: number;
    task: number;
    timer: any;

    showMonitor: boolean = false;
    hideMonitor: boolean = true;
    userId:string;
    messageString = 'There are 8 million people starving in the world';
    messageImg="assets/img/message_background.jpg";
    displayMessage = '';
    wasteMonitor = [];
    binId:string;
    fillClass='fill0';
    lidStatus :string;

    
    currentWeight=0;
    currentHeight=0;
    currentPercentage=0;

    pageLoaded=false;

    constructor(public navCtrl: NavController, public navParams: NavParams,
      private afDatabase : AngularFireDatabase ,private afAuth:AngularFireAuth,
      public interfac: InterfaceProvider,private alertCtrl:AlertController,private eventLogger :EventLoggerProvider) {

        let loader = this.interfac.presentLoadingDefault();
        loader.present();

      this.pageLoaded=true;

        //validates the user
        this.afAuth.authState.subscribe(result=>{
          if(result.uid){
            this.userId = result.uid;
            
            
            //checks whether the bin is registered, only shows the monitor data if the bin is registers
            this.loadMonitor();
            loader.dismiss();
          }else{
            this.navCtrl.setRoot(BinRegistrationPage);
            loader.dismiss();
          }
        });

        //gets the waste monitor data
        this.afDatabase.list('waste_monitor/waste_monitor').subscribe(requestResult=>{
          
          this.wasteMonitor = requestResult;
        })
      }

      

      ionViewDidEnter (){
       // this.loadMonitor();
      
       
       this.eventLogger.pageViewLogger('waster_monitor');//analaytic data collection

       if (this.pageLoaded){
        this.currentWeight=0;
        this.currentPercentage=0;
        this.binAnimation(this.binId);
       }
      }

   
      loadMonitor(){

        this.afDatabase.list('bin_registration',{
          query :{
            orderByChild:'userId',
            equalTo:this.userId
          }
        }).subscribe(requestResult=>{

          if(requestResult.length > 0){

            this.showMonitor = true;
            this.hideMonitor = false;
            this.displayMessage = this.messageString;
            this.drawGraph();
            this.binId=requestResult[0].binID;

            
            this.binAnimation(requestResult[0].binID);

            //loading daily message with Background Image
            this.afDatabase.list('daily_message').subscribe(messageResult=>{

              //console.log(messageResult);
              this.displayMessage=messageResult[0].message;
              this.messageImg=messageResult[0].imageURL;
            });
           // loader.dismiss();

          }
        })
      }

binAnimation (bindId){
        this.afDatabase.object('admin_data/binIDs/'+bindId).subscribe(resultAdmin=>{

          //console.log(messageResult);
          let maxHeight=resultAdmin.maxHeight;
          this.afDatabase.object('current_reading/'+bindId).subscribe(result=>{
 
              //console.log(result);
             // this.currentWeight=result.weight;lidStatus
             this.lidStatus=result.door;
             if(result.door!=0){
<<<<<<< HEAD
               if(result.weight>0){
                 this.weightAnimation(result.weight);
               }
=======

               if(result.weight>0){
                 this.weightAnimation(result.weight);
               }

>>>>>>> f8811e4e5bf1a691378f8acb72f5268215f48ea4
              
               if(result.height>0){
                this.currentHeight=result.height;
               }else{

                this.currentHeight=0;
               }
              
             // this.currentPercentage=(this.currentHeight/maxHeight)*100;
              this.percentageAnimation((this.currentHeight/maxHeight)*100);

              let percentage=(this.currentHeight/maxHeight)*100;
             
              switch(true) { 
                case (percentage>=0 && percentage<1) : { 
                  this.fillClass='fill0';
                   break; 
                } 

                case (percentage>1 && percentage<=30) : { 
                  this.fillClass='fill20';
                   break; 
                } 
                case (percentage>30 && percentage<=50): { 
                  this.fillClass='fill40';
                   break; 
                } 
                case (percentage>50 && percentage<=70) : { 
                  this.fillClass='fill60';
                   break; 
                } 
                case (percentage>70 && percentage<=90): { 
                  this.fillClass='fill80';
                   break; 
                } 

                case (percentage>90 ): { 
                  this.fillClass='fill100';
                   break; 
                } 
              
              }

            }
          });
          
        });
        
      }

      weightAnimation (number){
        let interval = setInterval(()=>{
          
           if( this.currentWeight > number){
            this.currentWeight--; 
           }else if(this.currentWeight == number){
            clearInterval(interval);
           }else  if( this.currentWeight < number){
            this.currentWeight++;
           }else{
            clearInterval(interval);
           }

        },80)
      }

      
      percentageAnimation (number){
        let interval = setInterval(()=>{
          
           if( this.currentPercentage > number+5){
            this.currentPercentage--; 
           }else if(this.currentPercentage == number){
            clearInterval(interval);
<<<<<<< HEAD
           }else  if( this.currentPercentage < number+5){
=======

           }else  if( this.currentPercentage < number+5){

>>>>>>> f8811e4e5bf1a691378f8acb72f5268215f48ea4
            this.currentPercentage++;
           }else{
            clearInterval(interval);
           }
        },80)
      }

      @ViewChild('lineCanvas') lineCanvas;
      lineChart: any;

   

      drawGraph(){

        if (this.showMonitor == true){
          this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
              labels: ["Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", "Jan 6", "Jan 7"],
              datasets: [
                {
                  label: "Food Waste",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "#32db64",
                  borderColor: "#32db64",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "#32db64",
                  pointBackgroundColor: "#32db64",
                  pointBorderWidth: 1,
                  pointHoverRadius: 3,
                  pointHoverBackgroundColor: "#448e39",
                  pointHoverBorderColor: "#448e39",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                    data: [65, 59, 80, 81, 56, 55, 40],
                    spanGaps: false,
                  }
                ]
              },
              options: {
                scales: {
                  yAxes: [{
                    labelString: 'Weight (kg)',
                  }],
                  gridLines: [{
                    display: false,
                  }]
                }
              }
            });
          }
        }

        connectBin(){
          this.navCtrl.push(BinRegistrationPage);
        }

        disconnectBin(){

          let confirm = this.alertCtrl.create({
            title: 'Confirm Disconnection',
            message: 'Are you sure you want to Disconnect the Waste Monitor ?',
            buttons: [
              {
                text: 'Yes',
                handler: () => {
                  this.showMonitor=false;
                  this.afDatabase.object('bin_registration/'+this.binId+'_'+this.userId).remove().then(()=>{
                    window.location.reload();
                  });
                }
              },
              {
                text: 'No',
                handler: () => {
                 
                }
              }
            ]
          });
          confirm.present();

          
        }
}
