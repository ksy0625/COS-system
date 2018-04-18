var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var AppData = /** @class */ (function () {
    function AppData(http) {
        this.http = http;
        console.log('Hello AppData Provider');
    }
    AppData.prototype.load = function () {
        if (this.data) {
            return Observable.of(this.data);
        }
        else {
            return this.http.get('assets/data/data.json')
                .map(this.processData, this);
        }
    };
    AppData.prototype.processData = function (data) {
        this.data = data.json();
        return this.data;
    };
    AppData.prototype.getAppAboutData = function () {
        return this.load().map(function (data) {
            return data.about;
        });
    };
    AppData = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], AppData);
    return AppData;
}());
export { AppData };
//# sourceMappingURL=app.js.map