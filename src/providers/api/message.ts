import {BaseResponse } from '../core/msgbase';



export class OrderBarcodeRequest{
  orderBarcode: string = '';
  warehouse: string = '';
  pickzone: string = '';
}
export class OrderBarcodeResponse extends BaseResponse{
  countProductScanned: string = '';
  countTotalProducts: string = '';
  binLocationList: string[]; 
  orderNumber: string = '';
  toteNumber: string = '';
}


export class ProductNotInToteLimitRequest{
  orderNumber: string = '';
  allowableProductsNotInTote: number = 0;
}
export class ProductNotInToteLimitResponse extends BaseResponse{
  overLimit: string = ''; // Y/N
}

export class SurplusBin{
  binLocation: string='';
  qty:  string='';
}

export class ProductInfoProductBarcodeRequest{
  barcode: string = '';
  orderNumber: string = '';
}
export class ProductInfoProductBarcodeResponse extends BaseResponse{
  countProductScanned:number = 0;
  countTotalProducts:number = 0;
  binLocationList: string[]; 
  orderNumber:string='';
  toteNumber:string='';
  stockCode:string='';
  description:string='';
  binLocation:string='';
  pickUnit:string='';
  pickUnitSensitive:string='';
  pickQty:string='';
  img_url:string='';
  surplusBins: SurplusBin[];
}

// export class GetProductInfoBinBarcodeRequest extends BaseRequest{
//   barcode: string = '';
//   orderNumber: string = '';
// }
// export class GetProductInfoBinBarcodeResponse extends BaseRequest{
//   countProductScanned:number = 0;
//   countTotalProducts:number = 0;  
//   binLocationList: string[]; 
//   orderNumber:string='';
//   toteNumber:string='';
//   stockCode:string='';
//   description:string='';
//   binLocation:string='';
//   pickUnit:string='';
//   pickUnitSensitive:string='';
//   pickQty:string='';
//   img_url:string='';
//   surplusBins: SurplusBin[];
// }

export class ProductConfirmQtyRequest{
  orderNumber: string = '';
  stockCode: string = '';
  binLocation: string = '';
  confirmQty: number = 0;
}


export class ProductListNotInToteRequest{
  orderNumber: string = '';
}

export class ProductId{
  rowID: number = 0;
  binLocation: string = '';
  stockCode: string = '';
}
export class Product extends ProductId{
  pickQty: string = '';
  confirmQty: number = 0;  
}

export class ProductListNotInToteResponse extends BaseResponse{
  productList: Product[];
}

export class PlaceInToteRequest{
  orderNumber: string = '';
  toteNumber: string = '';
  productList: ProductId[];
}
export class PlaceInToteResponse extends BaseResponse{
  orderComplete: string = ''; // Y/N
}


// export class AllocateNewToteToOrderRequest extends BaseRequest{
//   orderNumber: string = '';
//   toteNumber: string = '';
//   productList: ProductId[];
// }
// export class AllocateNewToteToOrderResponse extends BaseResponse{
//   orderComplete: string = ''; // Y/N
// }


export class OrderPickStatusRequest{
  orderNumber: string = '';
  warehouse: string = '';
  pickzone: string = '';
}

export class ProductStatus extends Product{
  pickStatus:string='';  
}

export class OrderPickStatusResponse extends BaseResponse{
  orderNumber: string = '';  
  productList: ProductStatus[];
}




