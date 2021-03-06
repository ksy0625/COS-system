import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestMethod, RequestOptionsArgs} from '@angular/http';

import 'rxjs/add/operator/map';
import { AlertService} from './alert.service';
import {UtilService} from './util.service'

/*
  Generated class for the CoreProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MobileAppSystemBarcodes {

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



  private _doServerSideOp (command:string, requests:any, checkForErrors:boolean, isArrayRequest:boolean, callback:(result:any) => void): void 
  {

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



public GetBinDetails(warehouse:string, binCode:string, success_cb:(result:any)=>void){

    let requests = {
                    sessionId: this.sessionId,
                    warehouse: warehouse,
                    bincode:binCode,
                };

    this._doServerSideOp('GetBinDetails', requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(success_cb != null)  
        success_cb(res);
  });
}


public GetBarcodes(stockCode:string,success_cb:(result:any)=>void)
{

    let requests = {
                    sessionId: this.sessionId,
                    stockCode:stockCode,
                };  
   
    this._doServerSideOp('GetStockBarcodes', requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(success_cb != null)  
        success_cb(res);
  });
}

public UpdateStockBarcodes(userName:string,stockCode:string, pieceBarcode:string, packBarcode:string, 
  cartonBarcode:string, palletBarcode:string, success_cb:(result:any)=>void){

    let requests = {
                    sessionId: this.sessionId,
                    Username: userName,
                    Stockcode: stockCode,
                    PieceBarcode:pieceBarcode,
                    PackBarcode:packBarcode,
                    CartonBarcode:cartonBarcode,
                    PalletBarcode:palletBarcode,
                }; 
    
    this._doServerSideOp('UpdateStockBarcodes', requests, true, false, function (res:any) {        
      if(res==null)
        return;
      if(success_cb != null)  
        success_cb(res);
  });
}



}
