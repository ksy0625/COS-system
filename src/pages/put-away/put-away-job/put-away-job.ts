import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import {MobileAppSystemPutAway} from '../../../providers/mobile.app.system.putaway'
import {User} from '../../../providers/user'
import {PutawayDetail, PutAwayJobStatus} from '../../../providers/user'
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
  selector: 'page-put-away-job',
  templateUrl: 'put-away-job.html',
})

export class PutAwayJobPage {
  private title:string = ''; 
  private titleDefault:string = '';   

  jobList: PutawayDetail[]=[];
  jobStatus:PutAwayJobStatus;
  selectedJOB:string = '';
  selectedBIN:string = '';  


  constructor(public navCtrl: NavController, public navParams: NavParams,
  			  public mobileAppSystem:MobileAppSystemPutAway,
          private keyboard:Keyboard,
  	    	private modalService:ModalService,
  	    	private alertService:AlertService, 
          public translateService:TranslateService,
  			  public user:User) {

    let svc = this;
    this.jobList = svc.user.putwayInfo.putawayDetails1;
    this.jobStatus = svc.user.putwayInfo.putAwayJobStatus;      

    translateService.get('PUT_AWAY_JOB_TITLE').subscribe(
      value => {
        svc.titleDefault = value;
        svc.title = svc.titleDefault  + ":" + svc.jobStatus.job_id;
      }
    );  

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Put-Away job page');
  }

  openPage() {  	
  }

  onClickRow(job_id:string, binCode:string)
  {
    this.selectedJOB = job_id;
    this.selectedBIN = binCode;
    
    let svc = this;
    let jobDetail: PutawayDetail = null;
    for(let detail of this.jobList)
    {
      if(detail.to_bin == binCode)
      {
        jobDetail = detail;
        break;
      }
    }
    if(jobDetail == null)return;


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
  }


}
