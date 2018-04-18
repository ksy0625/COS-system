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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MobileAppSystem } from '../../../providers/mobile.app.system';
import { User } from '../../../providers/user';
/**
 * Generated class for the OrderStatusPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var OrderedProduct = /** @class */ (function () {
    function OrderedProduct() {
    }
    return OrderedProduct;
}());
export { OrderedProduct };
var OrderStatusPage = /** @class */ (function () {
    function OrderStatusPage(navCtrl, navParams, mobileAppSystem, user) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.mobileAppSystem = mobileAppSystem;
        this.user = user;
        this.selectedIndex = -1;
        this.orderedProducts = [];
    }
    OrderStatusPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad OrderStatusPage');
        var svc = this;
        this.mobileAppSystem.getOrderPickStatus(this.user.orderInfo.orderBarcode, this.user.orderInfo.zone, function (res) {
            if (res == null)
                return;
            if (res.result == null)
                return;
            svc.orderedProducts = res.result.productList;
        });
    };
    OrderStatusPage.prototype.onGotoHome = function () {
        this.navCtrl.setRoot('HomeScreenPage');
    };
    OrderStatusPage.prototype.onGotoScanOrder = function () {
        this.navCtrl.setRoot('ScanOrderPage');
    };
    OrderStatusPage.prototype.onSelectOrder = function (index) {
        this.selectedIndex = index;
    };
    OrderStatusPage.prototype.onContinue = function () {
        if (this.selectedIndex < 0)
            return;
        this.user.orderInfo.orderBarcode = this.orderedProducts[this.selectedIndex].orderNumber;
        this.selectedIndex = -1;
        this.navCtrl.popToRoot();
        this.navCtrl.push('ScanProductPage');
    };
    OrderStatusPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-order-status',
            templateUrl: 'order-status.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams,
            MobileAppSystem,
            User])
    ], OrderStatusPage);
    return OrderStatusPage;
}());
export { OrderStatusPage };
//# sourceMappingURL=order-status.js.map