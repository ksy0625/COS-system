var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';
var AlertModalPage = /** @class */ (function () {
    function AlertModalPage(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.title = params.data.title;
        this.message = params.data.message;
        this.okTxt = params.data.okTxt;
        if (params.data.icon == null)
            this.icon = 'bulb';
        else
            this.icon = params.data.icon;
        if (params.data.color == null)
            this.color = 'danger';
        else
            this.color = params.data.color;
    }
    AlertModalPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    AlertModalPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-alert-modal',
            templateUrl: 'alert-modal.html'
        }),
        __metadata("design:paramtypes", [ViewController,
            NavParams])
    ], AlertModalPage);
    return AlertModalPage;
}());
export { AlertModalPage };
//# sourceMappingURL=alert-modal.js.map