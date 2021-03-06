import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import {MobileAppSystemPutAway} from '../../../providers/mobile.app.system.putaway'
import {User, PutAwayJobStatus} from '../../../providers/user'
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
  selector: 'page-put-away-job-list',
  templateUrl: 'put-away-job-list.html',
})

export class PutAwayJobListPage {

  @ViewChild('orderBarCodeInputBox') orderBarCodeInput ;
  barcode:string='';
  jobList: PutAwayJobStatus[]=[];
  selectedJobID:string = '';
  didUnload:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  			  public mobileAppSystem:MobileAppSystemPutAway,
          private keyboard:Keyboard,
          private platform: Platform,          
  	    	private modalService:ModalService,
  	    	private alertService:AlertService, 
          public translateService:TranslateService,
  			  public user:User) {

    this.user.putwayInfo.putAwayJobStatus = new PutAwayJobStatus();
  }

  timerTick()
  {
    if(this.didUnload)return;

    let svc = this;
    setTimeout(() => {

      if(this.navCtrl.getActive().id !="PutAwayJobListPage"  || this.mobileAppSystem.isBusy()==true)
      {
        this.timerTick();
        return;
      }

      let visibleKeypad = CustomKeyBoard.isVisible();            
      if (svc.platform.is('cordova'))
       svc.keyboard.close();

       if(visibleKeypad==false )
       {
         if(svc.orderBarCodeInput._isFocus ==false)
         {
           svc.orderBarCodeInput._readonly = true;
           svc.orderBarCodeInput.setFocus(); 
           setTimeout(() =>{
             svc.orderBarCodeInput._readonly = false;
           }, 40);                 
         }               
       }
       svc.timerTick();
    },100); //a least 150ms.
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Put-Away job list page');
    this.onRefreshJobList();
  }

  ionViewWillEnter()
  {
    this.didUnload = false;
    CustomKeyBoard.hide();
    this.timerTick();
  }


  ionViewWillLeave()
  {
    console.log('ionViewWillLeave Put-Away job list page');
    //this.jobList = [];
    this.didUnload = true;
  }     

  onRefreshJobList(){
    let svc = this;
    let re = /\,/gi;
    this.mobileAppSystem.putaway_getPutawayJobList(this.user.sessionInfo.userWarehouse, function(res:any){
        if(res==null || res.result==null)return;
        if(res.result.statusCode==200)
        {

          for(let i=0; i<res.result.putAwayJobs.length; i++)
          {
            res.result.putAwayJobs[i].scan_frompall = new Date(res.result.putAwayJobs[i].scan_frompall).toLocaleString().replace(re, " ");
          }
          svc.jobList = res.result.putAwayJobs;         
          svc.user.putwayInfo.putawayJobList = svc.jobList;
        }
        else
        {
            svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
            });
        }
    });
  }

  openPage() 
  {
    let svc = this;
    if(this.barcode=='')
      return;    

    this.mobileAppSystem.putaway_getPutawayLineScan(this.user.sessionInfo.userWarehouse, this.barcode, function(res:any){
        if(res==null || res.result==null)return;
        if(res.result.statusCode==200)
        {
          //select job status
          let job_id:string = '';
          if(res.result.putawayListResponse.length >0)
            job_id = res.result.putawayListResponse[0].job_id;
          for(let status of svc.jobList)
          {
            if(status.job_id == job_id)
            {
              svc.user.putwayInfo.putAwayJobStatus = status;
              break;
            }  
          }

          svc.user.putwayInfo.bEnteredBarcode = true;  
          svc.user.putwayInfo.putawayDetails = res.result.putawayListResponse;
          svc.user.putwayInfo.barcode = svc.barcode;
          //svc.jobList = res.result.putAwayJobs;
          svc.navCtrl.push('PutAwayJobFoundPage');
          //svc.navCtrl.setRoot('PutAwayJobFoundPage');
        }
        else
        {
            svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
            });
        }
    });
  }

  onClickRow(jobID:string)
  {
    this.selectedJobID = '';
    for (let jobStatus of this.jobList) {
      if(jobStatus.job_id == jobID)
      {
        this.user.putwayInfo.putAwayJobStatus =   jobStatus;
        this.selectedJobID = jobID;
        break;
      }        
    }

    this.barcode = this.selectedJobID;
    if(this.barcode=='')
      return;

    let svc = this;
    this.mobileAppSystem.putaway_getPutawayJobDetails(Number(jobID), function(res:any){
        if(res==null || res.result==null)return;
        if(res.result.statusCode==200)
        {
          svc.user.putwayInfo.bEnteredBarcode = false;
          svc.user.putwayInfo.putawayDetails1 = res.result.putawayListResponse;
          svc.navCtrl.push('PutAwayJobPage');
        }
        else
        {
            svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
            });
        }
    });
  }

  onChangedProductBarCode(val:string)
  {
     this.openPage(); 
  }

  onClickBarcode()
  {

  }

  onShowKeyPad()
  {
    let svc = this;
    if(CustomKeyBoard.isVisible())
       CustomKeyBoard.hide();
    else
    {
      CustomKeyBoard.show();    
      CustomKeyBoard.setTarget(this.orderBarCodeInput, function(val:string){
        svc.onChangedProductBarCode(val);
      });
    }
  }  

}
