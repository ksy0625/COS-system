import { BaseResponse } from '../core/msgbase';

export class LoginRequest {
  constructor(public username: string, public password: string)
  {  	
  }
}

export class LoginResponse extends BaseResponse{
  userSessionID: string = '';
  warehouse: string = '';
}

export class ConveyRequest{
  warehouse: string = '';
}

export class ConveyResponse extends BaseResponse{
  allowableProductsNotInTote: number = 0;
  hasPickZones: string = ''; //Y/N
  pickZoneList: number[];
}
