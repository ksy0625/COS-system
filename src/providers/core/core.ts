import { Injectable } from '@angular/core';
import { Http, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the CoreProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CoreService {

  private requestConveyorCounter:number;
  private baseUrl: string = 'http://inttest.cos.net.au/ProcessRequest';    
  private sessionId:string;
  private notificationConnectionId:string;

  public constructor(public http: Http) {
    console.log('Hello CoreService Provider');

    this.requestConveyorCounter = 1;
    this.sessionId = '';
  }

  public doServerSideOp(command:string, parameters:any, callback:(result:any) => void, checkForErrors:boolean): void {
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

  public _doServerSideOp (requests:any, checkForErrors:boolean, isArrayRequest:boolean, callback:(result:any) => void): void {
    //srv = this;
    let model = {
        requests: requests,
        context:
        {
            sessionId: this.sessionId,
            notificationConnectionId: this.notificationConnectionId
        }
    };

    let body = { id: JSON.stringify(model)};
    // const header = new Headers();
    // header.set('Access-Control-Allow-Origin','*');
    // header.set('Access-Control-Allow-Methods', 'POST');
    // header.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // header.set('Content-Type','application/x-www-form-urlencoded');

    let res = this.http.post(this.baseUrl, body);

    res.map(res => res.json()).subscribe(
      res => {        
        if(callback != null)
          callback(res);
      }, 
      err => {        
          callback(null);
      });    
    return;

    //let res = $http({
    //     method: "POST",
    //     url: this.baseUrl,
    //     data: { id: JSON.stringify(model), },
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //     }
    // });
      
    //$rootScope.serverOpCounter++;

    // res.success(function (data:any, status:any, headers:string, config:any) {

    //     if (isArrayRequest == true) {
    //         if (data == null) data = [];
    //         if (Object.prototype.toString.call(data) === '[object Array]') {
    //         }
    //         else {
    //             data = [data];
    //         }
    //     }
    //     else {
    //         if (data == null) data = {
    //         };

    //         if (Object.prototype.toString.call(data) === '[object Array]') {
    //             if (data.length > 0)
    //                 data = data[0];
    //             else
    //                 data = null;
    //         }
    //         else {
    //         }
    //     }

    //     let sampleResponseFromServer = {
    //     };
    //     if (Object.prototype.toString.call(data) === '[object Array]') {
    //         if (data.length > 0) {
    //             sampleResponseFromServer = data[0]
    //         }
    //     }
    //     else
    //         sampleResponseFromServer = data;

    //     if (sampleResponseFromServer != null)
    //         srv.setLoginResult(sampleResponseFromServer);



    //     if (data == null) {
    //         displayError('empty response from server');
    //     }
    //     else {
    //         setUserTheme(data);
    //         if (checkForErrors) {

    //             if (data.result == null) data.result = {
    //             };

    //             if (srv.checkForErrors(data))
    //                 callback(data);
    //         }
    //         else {
    //             callback(data);
    //         }
    //     }
    // });
    // res.error(function (data, status, headers, config) {
    //     $rootScope.serverOpCounter--;
    //     if (data == null) data = {
    //     };
    //     if (data.result == null) data.result = {
    //     };
    //     displayError('error communicating with server');
    // });
  }


  private checkForErrors(returnValue:any):boolean {
      if (!returnValue) return true;
      if (returnValue == null) return true;
      if (!returnValue.isError) return true;
      if (returnValue.isError == null) return true;
      if (returnValue.isError == false) return true;

      let forcefullLogOut:boolean = false;
      let errorMessage:string = 'error';

      if (returnValue.errorMessage) {
          errorMessage = returnValue.errorMessage;
      }

//      this.displayError(returnValue.errorMessage);

      if (returnValue.forcefullLogOut)
          if (returnValue.forcefullLogOut != null)
              if (returnValue.forcefullLogOut == true) {
                  // this.setUserName('');
                  // this.setUserBranch('');
                  // this.setUserDepartment('');
                  // this.setUserFullName('');
                  // this.setSessionId(null);
                  // $location.path('/login');
              }

      return false;
  }
}
