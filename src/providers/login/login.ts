import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the ServiceLoginProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
import { AlertService} from '../util/alert.service';
import { CoreService } from '../core/core';


@Injectable()
export class LoginService {
  public constructor(public coreService: CoreService, public alertService: AlertService) 
  {
  	console.log('Hello ServiceLoginProvider Provider');
  }

  public login(userName:string, password:string, success_cb:(result:any)=>void, isSingleSingOn:boolean):void {

      if (isSingleSingOn == null) isSingleSingOn = false;
      //srv = this;
      //++$rootScope.requestConveyorCounter;
      let requests =
          [
              {
                  requestCounter: 1, //$rootScope.requestConveyorCounter,
                  command: 'loginOPsApp',
                  data: {
                      userName: userName, password: password, isSingleSingOn: isSingleSingOn
                  }
              }
          ];

      let svc = this;      
      this.coreService._doServerSideOp(requests, false, false, function (result:any) {
        console.log(result);
        if(result==null)
        {
          svc.alertService.presentAlert('Login failed', 'Api request is failed');
          return;
        }

        let res = result[0];
        if(res.isError==true)
        {
          svc.alertService.presentAlert('Login failed', 'Wrong username or password');
        }
        else
        {
          if(success_cb != null)  
            success_cb(res);
        }

          // if (this.coreService.checkForErrors(result)) {
          //     console.log(result);

          //     let loginIsSuccess = true;
          //     if (result == null) result = {
          //     };
          //     if (result.result == null) result.result = {};
          //     if (result.result.loginResult == null) result.result.loginResult = {};
          //     if (result.result.loginResult.status == null) result.result.loginResult.status = '';

          //     loginIsSuccess = result.result.loginResult.sessionId != '';

          //     if (loginIsSuccess) {
          //         //this.coreService.setLoginResult(result.result.loginResult);
          //     }
          //     else {
          //         //this.coreService.clearCache();
          //     }
          // }
          // else if (success_cb != null)
          //   success_cb(result);

      });
  }

}
