import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import {MobileAppSystem1Line} from '../../../providers/mobile.app.system.1line'
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

export class LineJobStatus{
  binLocation:string;
  numOrders:number;     
  numCompleted:number;    
}


@IonicPage()
@Component({
  selector: 'page-line-job-in-progress',
  templateUrl: 'line-job-in-progress.html',
})
export class LineJobInProgressPage {

  productList: LineJobStatus[]=[];
  selectedJobID:number = 0;
  private title :string = "";
  private selBinCode :string = '';


  constructor(public navCtrl: NavController, public navParams: NavParams,
  			  public mobileAppSystem:MobileAppSystem1Line,
          private keyboard:Keyboard,
  	    	private modalService:ModalService,
  	    	private alertService:AlertService, 
          public translateService:TranslateService,
  			  public user:User) {

    let svc = this;
    translateService.get('LINE_JOB_IN_PROGRESS_TITLE').subscribe(
      value => {
        svc.title =  value + " - Job ID: " + svc.user.lineinfo.jobID;
      }
    );    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad P2L Outstanding Jobs page');
    this.onRefreshJobList();
  }

  onRefreshJobList(){
    let svc = this;
    this.mobileAppSystem.singleLine_getJobPickStatus(this.user.lineinfo.jobID, this.user.sessionInfo.userWarehouse, function(res:any){
       if(res==null || res.result==null)
         return;       
       svc.selectedJobID = res.result.jobID;
       svc.productList  = res.result.productBins;

    });      
  }

  openPage() {

    if(this.selBinCode=='')
      return;

    let svc = this;    
    this.mobileAppSystem.singleLine_getNextProduct(this.user.lineinfo.jobID, this.user.sessionInfo.userWarehouse, svc.selBinCode, 'B',function(res:any){
      if(res==null|| res.result==null)return;
      if(res.result.statusCode == 200)
      {        
        svc.user.lineinfo.barcodetype = 'B';
        svc.user.lineinfo.productInfo = res.result;
        svc.navCtrl.setRoot('LinePickOrderPage');
      }
    });

  }

  onClickRow(bincode:string)
  {
    this.selBinCode = bincode;
  }

}
