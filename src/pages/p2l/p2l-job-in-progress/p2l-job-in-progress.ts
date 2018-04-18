import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import {MobileAppSystemP2l} from '../../../providers/mobile.app.system.p2l'
import {User} from '../../../providers/user'
import {ModalService} from '../../../providers/modal.service'
import {AlertService} from '../../../providers/alert.service'

import { Keyboard } from '@ionic-native/keyboard';
import { CustomKeyBoard } from '../../../components/customKeyBoard/custom-keyboard';

/**
 * Generated class for the PlacInTotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export class P2lJobStatus{
  stockCode:string;
  binLocation:string;
  numCartons:number;     
  numCompleted:number;   
}


@IonicPage()
@Component({
  selector: 'page-p2l-job-in-progress',
  templateUrl: 'p2l-job-in-progress.html',
})
export class P2lJobInProgressPage {

  productList: P2lJobStatus[]=[];
  selectedJobID:number = 0;
  private title :string = "";   

  constructor(public navCtrl: NavController, public navParams: NavParams,
  			  public mobileAppSystem:MobileAppSystemP2l,
          private keyboard:Keyboard,
  	    	private modalService:ModalService,
  	    	private alertService:AlertService, 
          public translateService:TranslateService,
  			  public user:User) {

    let svc = this;
    translateService.get('P2L_JOB_IN_PROGRESS_TITLE').subscribe(
      value => {
        svc.title =  value + " - Job ID: " + svc.user.p2linfo.jobID;
      }
    );    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad P2L Outstanding Jobs page');
    this.onRefreshJobList();
  }

  onRefreshJobList(){
    let svc = this;
    this.mobileAppSystem.p2l_getJobPickStatus(this.user.sessionInfo.userWarehouse, this.user.p2linfo.jobID, function(res:any){
       if(res==null || res.result==null)
         return;       
       svc.selectedJobID = res.result.jobID;
       svc.productList  = res.result.jobDetails;

    });      
  }

  openPage() {
  	this.navCtrl.setRoot('P2lScan1stlabelPage');
  }

}
