import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import {AngularFireDatabase,FirebaseObjectObservable}  from 'angularfire2/database-deprecated';
import {AngularFireAuth} from 'angularfire2/auth';
import { InterfaceProvider } from '../../providers/interface/interface';

/**
 * Generated class for the LeaderboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {

  /**
   *
   *
   * ******************HCI ISSUES*****************
   * 1.Leaderboard order has to be reversed to get the highest score on top in order to make sure users do not get confused with the
   *   ranking. Because the firebase send the leaderboard array in ascending order.
   * 2.Leaderboard should change the scores and order of users when the scores change due to some activity, implemented that part.
   * ***************SECURITY RISK*************
   * 1.Users should not be able to see the leaderboard without being an authenticated user hence each time the page is loaded it is
   *  verified that the user is logged in.
   *
   */

  leaderboard =[];
  batch=10;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afDatabase : AngularFireDatabase ,
              private afAuth:AngularFireAuth,public interfac: InterfaceProvider) {
        this.afAuth.authState.subscribe(result=>{
          console.log('Auther');
              if(result.uid){
                //console.log('profile/'+result.uid);
                this.loadLeaderBoard();
            }else{
                this.navCtrl.setRoot(LoginPage);
              }
          });
  }


  async loadLeaderBoard(){

    let loader= this.interfac.presentLoadingDefault();
    loader.present();

    let leaderBoardSubscription =this.afDatabase.list('leader_board',{
      query :{
        orderByChild:'score',
        limitToLast:this.batch

        //orderByKey:true

      }
    }).subscribe(leaderBoard=>{
    
     this.leaderboard=[];
     this.leaderboard =leaderBoard.reverse();
     loader.dismiss();
    // leaderBoardSubscription.unsubscribe();//removing the realtime link from firebase

    })
  }
  refresh(refresher){
    this.loadLeaderBoard().then(()=>{
      refresher.complete();
    });

  }
  ionViewDidEnter() {
    this.loadLeaderBoard();
  }

}
