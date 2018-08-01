import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
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

  @ViewChild('productBarCodeInputBox') productBarCodeInput;
  
  private productBarCode:string='';
  private title:string = ''; 
  private titleDefault:string = '';   

  jobList: PutawayDetail[]=[];
  jobStatus:PutAwayJobStatus;
  selectedBIN:string = '';  
  didUnload:boolean = false;  


  constructor(public navCtrl: NavController, public navParams: NavParams,
  			  public mobileAppSystem:MobileAppSystemPutAway,
          private keyboard:Keyboard,
  	    	private modalService:ModalService,
  	    	private alertService:AlertService, 
          public translateService:TranslateService,
          private platform: Platform,                    
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

  timerTick()
  {
    if(this.didUnload)return;

    let svc = this;
    setTimeout(() => {

      if(this.navCtrl.getActive().id !="PutAwayJobPage"  || this.mobileAppSystem.isBusy()==true)
      {
        this.timerTick();
        return;
      }

      let visibleKeypad = CustomKeyBoard.isVisible();            
      if (svc.platform.is('cordova'))
       svc.keyboard.close();

       if(visibleKeypad==false )
       {
         if(svc.productBarCodeInput._isFocus ==false)
         {
           svc.productBarCodeInput._readonly = true;
           svc.productBarCodeInput.setFocus(); 
           setTimeout(() =>{
             svc.productBarCodeInput._readonly = false;
           }, 40);                 
         }               
       }
       svc.timerTick();
    },100); //a least 150ms.
  }


  ionViewDidLoad() {
//    console.log('ionViewDidLoad Put-Away job page');
    if(this.jobList.length ==1)  
    {
      this.onClickRow(this.jobList[0].to_bin);
    }
  }

  ionViewWillEnter()
  {
    this.didUnload = false;
    CustomKeyBoard.hide();
    this.timerTick();
  }

  ionViewWillLeave()
  {
    this.didUnload = true;
    //this.jobList = [];
  }     

  onShowKeyPad()
  {
    let svc = this;
    if(CustomKeyBoard.isVisible())
       CustomKeyBoard.hide();
    else
    {
      CustomKeyBoard.show();    
      CustomKeyBoard.setTarget(svc.productBarCodeInput, function(val:string){
        setTimeout(() =>{
          svc.onChangedProductBarCode(svc.productBarCode);    
        }, 200);        
      });
    }
  }


  onClickRow(binCode:string)
  {
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

  onClickBarcode()
  {
  }
  onChangedProductBarCode(val:string)
  {
    let svc = this;
    this.productBarCode = val;
    if(val=='')return;

    //find stockCode for product barcode.
    svc.mobileAppSystem.putaway_getPutawayLineScan(svc.user.sessionInfo.userWarehouse, val, function(res:any){
        if(res==null || res.result==null)return;
        if(res.result.statusCode==200)
        {
          //select job status
          let stockCode:string = '';
          let binCode:string ='';
          if(res.result.putawayListResponse.length >0)
            stockCode = res.result.putawayListResponse[0].stk_code;
          if(stockCode =='') return;

          //get binCode from stockCode.
          for(let detail of svc.jobList)
          {
            if(detail.stk_code == stockCode)
            {
              binCode = detail.to_bin;
              break;
            }
          }
          if(binCode=='')return;

          //do tap click
          svc.onClickRow(binCode);

        }
        else
        {
            svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
            });
        }
    });

  }

}
