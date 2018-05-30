import { Injectable } from '@angular/core';
import { Http} from '@angular/http';


import 'rxjs/add/operator/map';
import { AlertService} from './alert.service';
import {UtilService} from './util.service'

/*
  Generated class for the CoreProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MobileAppSystemPutAway {

  private baseUrl: string = '';    
  private sessionId:string;
  private notificationConnectionId:string;


  public constructor(public http: Http,
    private alertService:AlertService,
    private utilService:UtilService) 
  {
    console.log('Hello CoreService Provider');
    this.sessionId = '';
  }

  public setBaseUrl(newUrl :string)
  {
    this.baseUrl = newUrl;
  }
  public getBaseUrl():string
  {
    return this.baseUrl;
  }

  public  isBusy(): boolean
  {
    if(this.utilService.loading !=null)
      return true;
    return false;
  }
  
  public setSessionId(sessId:string)
  {
    this.sessionId = sessId;
  }



  private _doServerSideOp (requests:any, checkForErrors:boolean, isArrayRequest:boolean, callback:(result:any) => void): void 
  {

    let model = {
        requests: requests,
        context:
        {
            sessionId: this.sessionId,
            notificationConnectionId: this.notificationConnectionId
        }
    };

    console.log(model);

    let body = { id: JSON.stringify(model)}; 

    this.utilService.presentLoading();

    // let headers = new Headers();
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // headers.append("Accept", 'application/x-www-form-urlencoded');
    // let options = new RequestOptions({ headers: headers });

    // let res = this.http.post(this.baseUrl, body, options);
    let res = this.http.post(this.baseUrl, body);
    res.map(res => res.json()).subscribe(
      res => {        
        console.log(res);

        
        this.utilService.hideLoading();

        let result = res[0];
        if(checkForErrors ==true)
        {
            this.checkForErrors(result);
        }

        if(callback != null)
          callback(result);
      }, 
      err => {
        this.utilService.hideLoading();
        
        this.checkForErrors(null);
        callback(null);
      });    
  }


  private checkForErrors(res:any):boolean {
      if (res == null)
      {
        this.alertService.doAlert('Api call failed', 'No response', 'OK');
        return true;
      }

      if(res.isError==true)
      {  
        let errMsg = '';      
        if(res.errorMessage != null)
          errMsg = res.errorMessage;

        this.alertService.doAlert('Api call failed', errMsg, 'OK');
      }
  }



  public loginOPsApp(userName:string, password:string, success_cb:(result:any)=>void, isSingleSingOn:boolean):void {

      if (isSingleSingOn == null) isSingleSingOn = false;
      let requests =
          [
              {
                  requestCounter: 1,
                  command: 'MobileLogin',
                  data: {
                      userName: userName, password: password, isSingleSingOn: isSingleSingOn
                  }
              }
          ];

      let svc = this;
      this._doServerSideOp(requests, false, false, function (res:any) {
        if(res==null)return;

        if(res.isError==true)
        {
          svc.alertService.doAlert('Login failed', res.errorMessage, 'OK');   
          return;
        }

        if(res.isError==false)
        {
          svc.sessionId = res.result.loginResult.sessionId;
          if(success_cb != null)  
            success_cb(res);
        }
      });
  }

public putaway_getPutawayJobList(warehouse:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'putaway_getPutawayJobList',
                data: {
                    userSessionID: this.sessionId,
                    warehouse: warehouse,
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(res.isError==false)
      {
        if(success_cb != null)  
          success_cb(res);
      }
  });
}


public putaway_getPutawayLineScan (warehouse:string, barcode:string,success_cb:(result:any)=>void)
{

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'putaway_getPutawayLineScan ',
                data: {
                    userSessionID: this.sessionId,
                    barcode: barcode,
                    warehouse:warehouse,
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(res.isError==false)
      {
        if(success_cb != null)  
          success_cb(res);
      }
  });
}

public putaway_getPutawayJobDetails(jobID:number, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'putaway_getPutawayJobDetails',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(res.isError==false)
      {
        if(success_cb != null)  
          success_cb(res);
      }
  });
}

public putaway_getPutawayLineDetails(taskId :number, warehouse:string, stockCode:string, toBin:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'putaway_getPutawayLineDetails',
                data: {
                    userSessionID: this.sessionId,
                    taskId:taskId,
                    warehouse:warehouse,
                    stockCode:stockCode,
                    toBin:toBin,
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(res.isError==false)
      {
        if(success_cb != null)  
          success_cb(res);
      }
  });
}


public putaway_completePutawayLine (taskId:number,warehouse:string,stockCode:string,toBin:string, 
  quantity:number, overflowBinCode:string, overflowQty:number,success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'putaway_completePutawayLine',
                data: {
                    userSessionID: this.sessionId,
                    taskId:taskId,
                    warehouse:warehouse,
                    stockCode:stockCode,
                    toBin: toBin,
                    quantity:quantity,
                    overflowBinCode:overflowBinCode,
                    overflowQty:overflowQty,
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
        if(success_cb != null)  
          success_cb(res);
  });
}

public singleLine_getNextOrderToPick (jobID:number,warehouse:string,stockCode:string,binLocation:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'singleLine_getNextOrderToPick',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse:warehouse,
                    stockCode:stockCode,
                    binLocation:binLocation
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
      if(success_cb != null)  
        success_cb(res);
  });
}



public singleLine_getJobPickStatus(jobID:number,warehouse:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'singleLine_getJobPickStatus',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse:warehouse
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(res.isError==false)
      {
        if(success_cb != null)  
          success_cb(res);
      }
  });
}



public singleLine_printAdditionalLabels(jobID:number,warehouse:string, stockCode:string, 
  binLocation:string, orderNumber:string, printAddress:string, printQty:number, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'singleLine_printAdditionalLabels',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse:warehouse,
                    stockCode:stockCode,
                    binLocation:binLocation,
                    orderNumber:orderNumber,
                    printAddress:printAddress,
                    printQty:printQty
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(res.isError==false)
      {
        if(success_cb != null)  
          success_cb(res);
      }
  });
}


}
