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
var P2lConfirmQtyPage = /** @class */ (function () {
    function P2lConfirmQtyPage(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.resolve = params.data.resolve;
        this.data = params.data;
        console.log(this.data);
    }
    P2lConfirmQtyPage.prototype.onOK = function () {
        var svc = this;
        this.viewCtrl.dismiss().then(function () { return svc.resolve(1); });
    };
    P2lConfirmQtyPage.prototype.onCancel = function () {
        var svc = this;
        this.viewCtrl.dismiss().then(function () { return svc.resolve(2); });
    };
    P2lConfirmQtyPage.prototype.onPark = function () {
        var svc = this;
        this.viewCtrl.dismiss().then(function () { return svc.resolve(3); });
    };
    P2lConfirmQtyPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    P2lConfirmQtyPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-p2l-confirm-qty',
            templateUrl: 'p2l-confirm-qty.html'
        }),
        __metadata("design:paramtypes", [ViewController, NavParams])
    ], P2lConfirmQtyPage);
    return P2lConfirmQtyPage;
}());
export { P2lConfirmQtyPage };
//# sourceMappingURL=p2l-confirm-qty.js.map