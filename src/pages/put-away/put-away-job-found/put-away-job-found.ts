import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import {MobileAppSystemPutAway} from '../../../providers/mobile.app.system.putaway'
import {User} from '../../../providers/user'
import {PutawayDetail} from '../../../providers/user'
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


@IonicPage()
@Component({
  selector: 'page-put-away-job-found',
  templateUrl: 'put-away-job-found.html',
})

export class PutAwayJobFoundPage {

  jobList: PutawayDetail[]=[];
  selectedJobId:string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
  			  public mobileAppSystem:MobileAppSystemPutAway,
          private keyboard:Keyboard,
  	    	private modalService:ModalService,
  	    	private alertService:AlertService, 
          public translateService:TranslateService,
  			  public user:User) {

    this.jobList = this.user.putwayInfo.putawayDetails;
    if(this.jobList.length==1)
    {
      this.onClickRow(this.jobList[0].job_id);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Put-Away job list page');
  }
  ionViewWillLeave()
  {
    //this.jobList = [];
  }     

  openPage() {
  	// this.navCtrl.setRoot('P2lScan1stlabelPage');
  }

  onClickRow(jobId:string)
  {
    this.selectedJobId = jobId;
    let svc = this;

    let jobDetail:PutawayDetail = null;

    for (let jobStatus of this.jobList) {
      if(jobStatus.job_id == jobId)
      {
        jobDetail = jobStatus;
        break;
      }        
    }

    if(jobDetail==null)
      return;

    this.mobileAppSystem.putaway_getPutawayLineDetails(jobDetail.task_id, jobDetail.warehouse,
      jobDetail.stk_code,jobDetail.to_bin, function(res:any){
        if(res==null || res.result==null)return;
        if(res.result.statusCode==200)
        {
          svc.user.putwayInfo.putawayLineDetail = res.result;
          svc.navCtrl.push('PutAwaySourcePage');
        }
        else
        {
            svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
            });
        }
    });
    

    // this.mobileAppSystem.putaway_getPutawayJobDetails(Number(jobId), function(res:any){
    //     if(res==null || res.result==null)return;
    //     if(res.result.statusCode==200)
    //     {
    //       svc.user.putwayInfo.putawayDetails1 = res.result.putawayListResponse;
    //       svc.navCtrl.push('PutAwayJobPage');
    //     }
    //     else
    //     {
    //         svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
    //         });
    //     }
    // });
        
  }

}
