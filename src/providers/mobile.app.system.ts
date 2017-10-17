import { Injectable } from '@angular/core';
import { Http, RequestOptions} from '@angular/http';
import {Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AlertService} from './alert.service';
import {UtilService} from './util.service'

/*
  Generated class for the CoreProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MobileAppSystem {

  private requestConveyorCounter:number;
  private baseUrl: string = 'http://inttest.cos.net.au/ProcessRequest';    
  private sessionId:string;
  private notificationConnectionId:string;


  public constructor(public http: Http,
    private alertService:AlertService,
    private utilService:UtilService) 
  {
    console.log('Hello CoreService Provider');

    this.requestConveyorCounter = 1;
    this.sessionId = '';
  }

  public  isBusy(): boolean
  {
    if(this.utilService.loading !=null)
      return true;
    return false;
  }
  
  private setSessionId(sessId:string)
  {
    this.sessionId = sessId;
  }

  private doServerSideOp(command:string, parameters:any, callback:(result:any) => void, checkForErrors:boolean): void {
      this.requestConveyorCounter++;
      var requests = [
          {
              requestId: 1,
              requestCounter: this.requestConveyorCounter,
              command: command,
              data: parameters
          }
      ];
      if (checkForErrors == null) checkForErrors = true;

      this._doServerSideOp(requests, checkForErrors, false, function (data) {
          if (checkForErrors == true)
              callback(data.result);
          else
              callback(data);
      });
  };

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


  public initialiseConveyorPick(warehouse:string, success_cb:(result:any)=>void){
    let svc = this;
    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'initialiseConveyorPick',
                data: {
                    userSessionId: this.sessionId,
                    warehouse: warehouse
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

public scanOrderBarcode(orderBarcode:string, warehouse:string,pickzone:string, success_cb:(result:any)=>void){
    let svc = this;
    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'scanOrderBarcode',
                data: {
                    userSessionId: this.sessionId,
                    orderBarcode: orderBarcode,
                    warehouse: warehouse,
                    pickzone: pickzone
                }
            }
        ];
    
    this._doServerSideOp(requests, false, false, function (res:any) {
      if(res.isError==true)
      {
        svc.alertService.doAlert('Check barcode', 'Barcode not found', 'OK');
      }  
      else
      {
        if(success_cb != null)  
          success_cb(res);
      }
  });
}

public checkProductNotInToteLimit(orderBarcode:string, allowableProductsNotInTote:number, success_cb:(result:any)=>void){
    let svc = this;
    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'checkProductNotInToteLimit',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber: orderBarcode,
                    allowableProductsNotInTote: allowableProductsNotInTote
                }
            }
        ];
    
    this._doServerSideOp(requests, false, false, function (res:any) {
      if(res.isError==true)
      {
        svc.alertService.doAlert('CheckProductNotInToteLimit', res.errorMessage, 'OK');
      }  
      else
      {
        if(success_cb != null)  
          success_cb(res);
      }
  });
}

public getProductInfoProductBarcode(barcode:string, orderNumber:string, toteNumber:string,
    warehouse:string, pickzone:string, success_cb:(result:any)=>void){
    let svc = this;
    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'getProductInfoProductBarcode',
                data: {
                    userSessionId: this.sessionId,
                    barcode:barcode,
                    orderNumber: orderNumber,
                    //toteNumber:toteNumber,
                    toteNumber:12,
                    warehouse:warehouse,
                    pickzone:pickzone
                }
            }
        ];
    
    this._doServerSideOp(requests, false, false, function (res:any) {
      if(res.isError==true)
      {
        //svc.alertService.doAlert('GetProductInfoProductBarcode', res.errorMessage, 'OK');
        if(success_cb != null)  
          success_cb(null);
      }  
      else
      {
        if(success_cb != null)
          success_cb(res);
      }
  });
}

public getProductInfoBinBarcode(barcode:string, orderNumber:string, toteNumber:string,
    warehouse:string, pickzone:string, success_cb:(result:any)=>void){
    let svc = this;
    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'getProductInfoBinBarcode',
                data: {
                    userSessionId: this.sessionId,                  
                    barcode:barcode,
                    orderNumber: orderNumber,
                    //toteNumber:toteNumber,
                    toteNumber:12,
                    warehouse:warehouse,
                    pickzone:pickzone
                }
            }
        ];
    
    this._doServerSideOp(requests, false, false, function (res:any) {
      if(res.isError==true)
      {
        //svc.alertService.doAlert('GetProductInfoBinBarcode', res.errorMessage, 'OK');
        if(success_cb != null)  
          success_cb(null);
      }  
      else
      {
        if(success_cb != null)
          success_cb(res);
      }
  });
}




public updateProductConfirmQty(orderNumber:string, stockCode:string, binLocation:string, 
    confirmQty:number, toteNumber:string, pickzone:string,  success_cb:(result:any)=>void){

    let svc = this;
    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'updateProductConfirmQty',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber:orderNumber,
                    stockCode:stockCode,
                    binLocation:binLocation,
                    confirmQty:confirmQty,
                    toteNumber:toteNumber,
                    pickzone:pickzone
                }
            }
        ];
    
    this._doServerSideOp(requests, false, false, function (res:any) {
      if(res.isError==true)
      {
        //svc.alertService.doAlert('GetProductInfoBinBarcode', res.errorMessage, 'OK');
        if(success_cb != null)  
          success_cb(null);
      }  
      else
      {
        if(success_cb != null)
          success_cb(res);
      }
  });
}

public getProductListNotInTote(orderNumber:string, pickZone:string, success_cb:(result:any)=>void){

    let svc = this;
    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'getProductListNotInTote',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber:orderNumber,
                    pickzone:pickZone
                }
            }
        ];
    
    this._doServerSideOp(requests, false, false, function (res:any) {
      if(res.isError==true)
      {
        //svc.alertService.doAlert('GetProductInfoBinBarcode', res.errorMessage, 'OK');
        if(success_cb != null)  
          success_cb(null);
      }  
      else
      {
        if(success_cb != null)
          success_cb(res);
      }
  });
}

public placeInTote(orderNumber:string, toteNumber:string, pickZone:string, productList:any, success_cb:(result:any)=>void){

    let svc = this;
    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'placeInTote',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber:orderNumber,
                    toteNumber:toteNumber,                    
                    productList:productList,
                    pickzone:pickZone
                }
            }
        ];
    
    this._doServerSideOp(requests, false, false, function (res:any) {
      if(res.isError==true)
      {
        //svc.alertService.doAlert('GetProductInfoBinBarcode', res.errorMessage, 'OK');
        if(success_cb != null)  
          success_cb(null);
      }  
      else
      {
        if(success_cb != null)
          success_cb(res);
      }
  });
}

public allocateNewToteToOrder(orderNumber:string, toteNumber:string, pickZone:string, productList:any, success_cb:(result:any)=>void){

    let svc = this;
    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'allocateNewToteToOrder',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber:orderNumber,
                    toteNumber:toteNumber,                    
                    productList:productList,
                    pickzone:pickZone
                }
            }
        ];
    
    this._doServerSideOp(requests, false, false, function (res:any) {
      if(res.isError==true)
      {
        //svc.alertService.doAlert('GetProductInfoBinBarcode', res.errorMessage, 'OK');
        if(success_cb != null)  
          success_cb(null);
      }  
      else
      {
        if(success_cb != null)
          success_cb(res);
      }
  });
}

public getOrderPickStatus(orderNumber:string, pickZone:string, success_cb:(result:any)=>void){

    let svc = this;
    let requests =
        [
            {
                requestCounter: 1, //$rootScope.requestConveyorCounter,
                command: 'getOrderPickStatus',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber:orderNumber,
                    pickzone:pickZone
                }
            }
        ];
    
    this._doServerSideOp(requests, false, false, function (res:any) {
      if(res.isError==true)
      {
        if(success_cb != null)  
          success_cb(null);
      }  
      else
      {
        if(success_cb != null)
          success_cb(res);
      }
  });
}




}
