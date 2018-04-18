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
var ConfirmModalPage = /** @class */ (function () {
    function ConfirmModalPage(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.resolve = params.data.resolve;
        this.title = params.data.title;
        this.message = params.data.message;
        this.okTxt = params.data.okTxt;
        this.cancelTxt = params.data.cancelTxt;
        if (params.data.icon == null)
            this.icon = 'bulb';
        else
            this.icon = params.data.icon;
    }
    ConfirmModalPage.prototype.onOK = function () {
        var svc = this;
        this.viewCtrl.dismiss().then(function () { return svc.resolve(true); });
    };
    ConfirmModalPage.prototype.onCancel = function () {
        var svc = this;
        this.viewCtrl.dismiss().then(function () { return svc.resolve(false); });
    };
    ConfirmModalPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ConfirmModalPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-confirm-modal',
            templateUrl: 'confirm-modal.html'
        }),
        __metadata("design:paramtypes", [ViewController, NavParams])
    ], ConfirmModalPage);
    return ConfirmModalPage;
}());
export { ConfirmModalPage };
//# sourceMappingURL=confirm-modal.js.map