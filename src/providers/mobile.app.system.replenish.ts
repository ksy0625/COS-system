
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestMethod, RequestOptionsArgs} from '@angular/http';

import 'rxjs/add/operator/map';
import { AlertService} from './alert.service';
import {UtilService} from './util.service'
import { CacheService } from "ionic-cache";

/*
  Generated class for the CoreProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MobileAppSystemReplenish {

  private baseUrl: string = '';    
  private sessionId:string;
  private notificationConnectionId:string;


  public constructor(public http: Http,
    private alertService:AlertService,
    private cache:CacheService,
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



  private _doServerSideOp (command:string, requests:any, checkForErrors:boolean, isArrayRequest:boolean, callback:(result:any) => void): void 
  {

    this.cache.clearAll();
    this.utilService.presentLoading();

    console.log(this.baseUrl + command);    
    console.log(requests);


    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let Options: RequestOptionsArgs = new RequestOptions({
        method: RequestMethod.Post,
        headers:headers
    });

    let res = this.http.post(this.baseUrl + command, JSON.stringify(requests), Options);
    res.map(res => res.json()).subscribe(
      res => {        
        console.log(res);

        
        this.utilService.hideLoading();

        let result = res;
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


public getReplenList(warehouse:string, minDays:number, isle:string, success_cb:(result:any)=>void){
    let requests = {
                    sessionId: this.sessionId,
                    warehouse: warehouse,                    
                    minDaysCover:minDays,
                    isle:isle,
                };

    this._doServerSideOp('GetReplenList', requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(success_cb != null)  
        success_cb(res);
  });
}

public getStockDetailsReplScan(warehouse:string, scanBarcode:string, success_cb:(result:any)=>void)
{
  let requests = {
                    sessionId: this.sessionId,
                    warehouse: warehouse,                    
                    scanBarcode:scanBarcode,
                };

    this._doServerSideOp('GetStockDetailsReplScan', requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(success_cb != null)  
        success_cb(res);
  });  
}

public replenSelectSourceBin(binClass:string, qty:number, success_cb:(result:any)=>void)
{
  let requests = {
                    sessionId: this.sessionId,
                    binClass: binClass,                    
                    qty:qty,
                };

    this._doServerSideOp('ReplenSelectSourceBin', requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(success_cb != null)  
        success_cb(res);
  });  
}


public  completeReplenStock (warehouse:string, stockCode:string, fromBin:string, toBin:string, replenQty:number, 
  actualQty:number, toMaxQty:number,success_cb:(result:any)=>void) 
{
  let requests = {
                    sessionId: this.sessionId,
                    warehouse: warehouse,                    
                    stockCodey:stockCode,
                    fromBin:fromBin,
                    toBin:toBin,
                    replenQty:replenQty,
                    actualQty:actualQty,
                    toMaxQty:toMaxQty,
                };

    this._doServerSideOp('ReplenSelectSourceBin', requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(success_cb != null)  
        success_cb(res);
  });  
}


}
