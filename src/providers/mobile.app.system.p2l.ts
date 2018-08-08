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
export class MobileAppSystemP2l {

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

//    let body = { id: JSON.stringify(model)}; 
   let bodyj = JSON.stringify(model); 
   let body = new FormData();
   body.append("id",bodyj);    

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

public p2l_getJob(warehouse:string, p2lBarcode:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'p2l_getJob',
                data: {
                    userSessionID: this.sessionId,
                    warehouse: warehouse,
                    p2lBarcode:p2lBarcode,
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

public p2l_getNextProduct(jobID:number, p2lBarcode:string, sortOrder:string,success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'p2l_getNextProduct',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    p2lBarcode:p2lBarcode,
                    sortOrder:sortOrder,
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

public p2l_getNext1stLabel(jobID:number, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'p2l_getNext1stLabel',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID
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

public p2l_validateProductBarcode(jobID:number,warehouse:string,stockCode:string,productBarcode:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'p2l_validateProductBarcode',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse:warehouse,
                    stockCode:stockCode,
                    productBarcode:productBarcode   
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
        if(success_cb != null)  
          success_cb(res);
  });
}


public p2l_validateProductBinBarcode(jobID:number,warehouse:string,stockCode:string,binBarcode:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'p2l_validateProductBinBarcode',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse:warehouse,
                    stockCode:stockCode,
                    binBarcode:binBarcode
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
      if(success_cb != null)  
        success_cb(res);
  });
}


public p2l_validate1stLabel(jobID:number,warehouse:string,stockCode:string,p2lBarcode:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'p2l_validate1stLabel',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse:warehouse,
                    stockCode:stockCode,
                    p2lBarcode:p2lBarcode
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

public p2l_parkProductPick (jobID:number,warehouse:string,stockCode:string,binCode:string,success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'p2l_parkProductPick',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse:warehouse,
                    stockCode:stockCode,
                    binCode:binCode
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


public p2l_confirmPickQty(jobID:number,warehouse:string,binCode:string,stockCode:string,pickQty:number, confirmQty:number, confirmQtyCheckAck:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'p2l_confirmPickQty',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse:warehouse,
                    binCode:binCode,
                    stockCode:stockCode,
                    pickQty:pickQty,
                    confirmQty:confirmQty, 
                    confirmQtyCheckAck:confirmQtyCheckAck
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
      if(success_cb != null)  
        success_cb(res);
  });
}

public p2l_destroyLabels(jobID:number,warehouse:string,stockCode:string,pickQty:number, confirmQty:number, destroyP2Lbarcode:string,
  binCode:string,  success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'p2l_destroyLabels',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse:warehouse,
                    stockCode:stockCode,
                    pickQty:pickQty,
                    confirmQty:confirmQty,
                    destroyP2Lbarcode:destroyP2Lbarcode,
                    binCode:binCode 
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


public p2l_getJobPickStatus(warehouse:string, jobID:number, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'p2l_getJobPickStatus',
                data: {
                    userSessionID: this.sessionId,
                    warehouse:warehouse,
                    jobID:jobID
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

public deAllocateJob(warehouse:string, jobID:number)
{

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'deAllocateJob',
                data: {
                    userSessionID: this.sessionId,
                    warehouse:warehouse,
                    jobID:jobID
                }
            }
        ];
    
    this._doServerSideOp(requests, true, false, function (res:any) {        
      if(res==null)
        return;
  });  
}


}
