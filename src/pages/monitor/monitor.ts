import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';

import { InterfaceProvider } from '../../providers/interface/interface';

import { WasteMonitor } from '../../models/waste-monitor';
import { BinRegistrationPage } from '../bin-registration/bin-registration'

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
    displayMessage = '';
    wasteMonitor = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,
      private afDatabase : AngularFireDatabase ,private afAuth:AngularFireAuth,
      public interfac: InterfaceProvider) {

        let loader = this.interfac.presentLoadingDefault();
        loader.present();

        //validates the user
        this.afAuth.authState.subscribe(result=>{
          if(result.uid){
            this.userId = result.uid;
            console.log(result.uid);

            //checks whether the bin is registered, only shows the monitor data if the bin is registers
            this.loadMonitor();
          }else{
            this.navCtrl.setRoot(BinRegistrationPage);
            loader.dismiss();
          }
        });

        //gets the waste monitor data
        this.afDatabase.list('waste_monitor/waste_monitor').subscribe(requestResult=>{
          console.log(requestResult);
          this.wasteMonitor = requestResult;
        })
      }

      ionViewWillEnter (){
        this.loadMonitor();
      }

      wasteLevelAnimation($timeout) {
        this.numberTasks = 8;
        this.task = 1;

        this.timer = function() {
          this.task++;

          if (this.task != this.numberTasks) {
            $timeout(function() {
              this.timer()
            }, 2000);
          }
        }

        $timeout(function() {
          this.timer()
        }, 2000);
      }

      loadMonitor(){

        let loader = this.interfac.presentLoadingDefault();
        loader.present();

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
            loader.dismiss();

          }else{
            loader.dismiss()
          }
        })
      }

      @ViewChild('lineCanvas') lineCanvas;
      lineChart: any;

      ionViewDidLoad() {
        console.log('ionViewDidLoad MonitorPage');
      }

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
}
