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
var ConfirmQtyPage = /** @class */ (function () {
    function ConfirmQtyPage(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.resolve = params.data.resolve;
        this.data = params.data;
        console.log(this.data);
    }
    ConfirmQtyPage.prototype.onOK = function () {
        var svc = this;
        this.viewCtrl.dismiss().then(function () { return svc.resolve(1); });
    };
    ConfirmQtyPage.prototype.onCancel = function () {
        var svc = this;
        this.viewCtrl.dismiss().then(function () { return svc.resolve(2); });
    };
    ConfirmQtyPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ConfirmQtyPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-confirm-qty',
            templateUrl: 'confirm-qty.html'
        }),
        __metadata("design:paramtypes", [ViewController, NavParams])
    ], ConfirmQtyPage);
    return ConfirmQtyPage;
}());
export { ConfirmQtyPage };
//# sourceMappingURL=confirm-qty.js.map