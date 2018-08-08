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
export class MobileAppSystemMoveStock {

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

public moveStock_getSourceBinDetails(warehouse:string, binCode:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'moveStock_getSourceBinDetails',
                data: {
                    userSessionID: this.sessionId,
                    warehouse: warehouse,
                    binCode:binCode,
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


public moveStock_getDestinationBinDetails(warehouse:string, binCode:string,sourceMainWH:string, fromBinCode:string, stockCode:string,success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'moveStock_getDestinationBinDetails',
                data: {
                    userSessionID: this.sessionId,
                    warehouse: warehouse,
                    binCode:binCode,
                    sourceMainWH:sourceMainWH,
                    fromBinCode:fromBinCode,
                    stockCode:stockCode
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


public moveStock_UpdateMoveBin(stockCode:string, sourceMainWH:string, fromBinCode:string, destMainWH:string, 
  toBinCode:string,rsValue:number, moveQty:number, maxQty:number,  success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'moveStock_updateMoveBin',
                data: {
                    userSessionID: this.sessionId,
                    stockCode:stockCode,
                    sourceMainWH:sourceMainWH,
                    fromBinCode:fromBinCode,
                    destMainWH:destMainWH,
                    toBinCode:toBinCode,
                    rsValue:rsValue,
                    moveQty:moveQty,
                    maxQty:maxQty,
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


public getLabelPrinters(warehouse:string,  success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'getLabelPrinters',
                data: {
                    userSessionID: this.sessionId,
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

public moveStock_printLabel(bincode:string, printerPath:string, success_cb:(result:any)=>void){

    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'moveStock_printLabel',
                data: {
                    userSessionID: this.sessionId,
                    Bincode:bincode,
                    printerPath:printerPath,                    
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
