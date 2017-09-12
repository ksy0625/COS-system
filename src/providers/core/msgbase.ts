export class BaseResponse{
  statusCode: string = '';
  statusMsg: string = '';
}

export class Request{
  requestCounter:number;
  command:string;
  data:any;
}

export class SessionContext{
	sessionId: string;
	notificationConnectionId: string; //'' //leave this blank	
}


export class RequestModel{
	requests:Request[];
	context:SessionContext;
}