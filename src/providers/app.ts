import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

/*
  Generated class for the AppData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AppData {
	data: any;
	constructor(public http: Http) {
	    console.log('Hello AppData Provider');
	}
	load() :any {
		if (this.data) {
			return Observable.of(this.data);
		} else {
			return this.http.get('assets/data/data.json')
				.map(this.processData, this);
		}
	}
	processData(data: any) {
		this.data = data.json();
		return this.data;		
	}
	getAppAboutData() {
		return this.load().map((data: any) => {
	      	return data.about;
	    });
	}
}
