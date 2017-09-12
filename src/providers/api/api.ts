import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the ServiceLoginProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
import { OrderBarcodeRequest} from './message';
import { ProductNotInToteLimitRequest} from './message';
import { ProductInfoProductBarcodeRequest} from './message';
import { ProductConfirmQtyRequest, ProductListNotInToteRequest} from './message';
import { PlaceInToteRequest} from './message';
import { OrderPickStatusRequest} from './message';
import { CoreService } from '../core/core';


@Injectable()
export class ServiceApi {

  constructor(private coreService: CoreService) {
    console.log('Hello ServiceApi Provider');
  }

  initialiseConveyorPick(warehouse:string, success_cb:(result:any)=>void){
      let requests =
          [
              {
                  requestCounter: 1, //$rootScope.requestConveyorCounter,
                  command: 'initialiseConveyorPick',
                  data: {
                      warehouse: warehouse
                  }
              }
          ];
      
      this.coreService._doServerSideOp(requests, false, false, function (result:any) {
          if (this.coreService.checkForErrors(result)) {
              
          }
          else if (success_cb != null)
            success_cb(result);
    });
  }




  // scanOrderBarcode(request: OrderBarcodeRequest): Observable<any> {
  //   return this.coreService.post('/scanOrderBarcode', request);
  // }

  // checkProductNotInToteLimit(request: ProductNotInToteLimitRequest): Observable<any> {
  //   return this.coreService.post('/checkProductNotInToteLimit', request);
  // }

  // getProductInfoProductBarcode(request: ProductInfoProductBarcodeRequest): Observable<any> {
  //   return this.coreService.post('/getProductInfoProductBarcode', request);
  // }

  // getProductInfoBinBarcode(request: ProductInfoProductBarcodeRequest): Observable<any> {
  //   return this.coreService.post('/getProductInfoBinBarcode', request);
  // }


  // updateProductConfirmQty(request: ProductConfirmQtyRequest): Observable<any> {
  //   return this.coreService.post('/updateProductConfirmQty', request);
  // }


  // getProductListNotInTote(request: ProductListNotInToteRequest): Observable<any> {
  //   return this.coreService.post('/getProductListNotInTote', request);
  // }

  // placeInTote(request: PlaceInToteRequest): Observable<any> {
  //   return this.coreService.post('/ placeInTote', request);
  // }

  // allocateNewToteToOrder(request: PlaceInToteRequest): Observable<any> {
  //   return this.coreService.post('/allocateNewToteToOrder', request);
  // }


  // getOrderPickStatus(request: OrderPickStatusRequest): Observable<any> {
  //   return this.coreService.post('/getOrderPickStatus', request);
  // }

}
