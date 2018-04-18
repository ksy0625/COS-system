var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { MobileAppSystem } from '../../../providers/mobile.app.system';
import { User } from '../../../providers/user';
import { AlertService } from '../../../providers/alert.service';
import { Keyboard } from '@ionic-native/keyboard';
import { CustomKeyBoard } from '../../../components/customKeyBoard/custom-keyboard';
/**
 * Generated class for the PlacInTotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var Product = /** @class */ (function () {
    function Product() {
    }
    return Product;
}());
export { Product };
var ProductOrder = /** @class */ (function (_super) {
    __extends(ProductOrder, _super);
    function ProductOrder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ProductOrder;
}(Product));
export { ProductOrder };
var PlaceInTotePage = /** @class */ (function () {
    function PlaceInTotePage(navCtrl, navParams, platform, mobileAppSystem, keyboard, alertService, user) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.platform = platform;
        this.mobileAppSystem = mobileAppSystem;
        this.keyboard = keyboard;
        this.alertService = alertService;
        this.user = user;
        this.productOrderList = [];
        this.toteBarcode = '';
        //user.hasTotes = 'Y';
        if (this.user.orderInfo.toteNumber)
            this.toteBarcode = this.user.orderInfo.toteNumber;
        CustomKeyBoard.hide();
        this.timerTick();
    }
    PlaceInTotePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PlacInTotePage');
        var svc = this;
        this.mobileAppSystem.getProductListNotInTote(this.user.orderInfo.orderBarcode, this.user.orderInfo.zone, function (res) {
            if (res != null)
                svc.productOrderList = res.result.productList;
            svc.selectToteBarcodeInput();
        });
    };
    PlaceInTotePage.prototype.openPage = function () {
        var toteBarcode = '00000000';
        if (this.user.hasTotes == 'Y') {
            if (this.toteBarcode == '')
                return;
            else
                toteBarcode = this.toteBarcode;
        }
        var svc = this;
        var productList = [];
        if (this.productOrderList != null) {
            for (var _i = 0, _a = this.productOrderList; _i < _a.length; _i++) {
                var productOrder = _a[_i];
                productList.push({ rowId: productOrder.rowId, binLocation: productOrder.binLocation, stockCode: productOrder.stockCode });
            }
        }
        //let productList;
        this.mobileAppSystem.placeInTote(this.user.orderInfo.orderBarcode, toteBarcode, this.user.orderInfo.zone, productList, function (res) {
            if (res == null)
                return;
            if (res.result.orderComplete == 'Y') {
                svc.alertService.doAlertWithtimeOut('Order Complete!', '', 2000).then(function (res) {
                    svc.navCtrl.setRoot('ScanOrderPage');
                });
            }
            else if (res.result.orderComplete == 'N') {
                if (res.result.statusMsg != '') {
                    if (res.result.statusCode == 200) {
                        svc.alertService.doAlertWithtimeOut('Success', res.result.statusMsg, 2000).then(function (res) {
                            svc.navCtrl.setRoot("ScanProductPage");
                        });
                    }
                    else {
                        svc.alertService.doAlertWithtimeOut('Error', res.result.statusMsg, 2000).then(function (res) {
                        });
                    }
                }
            }
        });
    };
    PlaceInTotePage.prototype.allocateNewToteToOrder = function () {
        if (this.toteBarcode == '')
            return;
        var svc = this;
        var productList = [];
        for (var _i = 0, _a = this.productOrderList; _i < _a.length; _i++) {
            var productOrder = _a[_i];
            productList.push({ rowId: productOrder.rowId, binLocation: productOrder.binLocation, stockCode: productOrder.stockCode });
        }
        //let productList;
        this.mobileAppSystem.allocateNewToteToOrder(this.user.orderInfo.orderBarcode, this.toteBarcode, this.user.orderInfo.zone, productList, function (res) {
            if (res == null)
                return;
            if (res.result == null)
                return;
            if (res.result.orderComplete == 'Y') {
                svc.alertService.doAlert('Order Complete!', '', 'OK').then(function (res) {
                    svc.navCtrl.setRoot('ScanOrderPage');
                });
            }
            else if (res.result.orderComplete == 'N') {
                if (res.result.statusMsg != '') {
                    if (res.result.statusCode == 200) {
                        svc.alertService.doAlert('Success', res.result.statusMsg, 'OK').then(function (res) {
                            svc.navCtrl.setRoot("ScanProductPage");
                        });
                    }
                    else
                        svc.alertService.doAlert('Error', res.result.statusMsg, 'OK');
                }
            }
        });
    };
    PlaceInTotePage.prototype.selectToteBarcodeInput = function () {
        var _this = this;
        setTimeout(function () {
            _this.toteBarCodeInput.setFocus();
        }, 500); //a least 150ms.
    };
    PlaceInTotePage.prototype.onChangedToteBarcode = function (val) {
        if (val == null || val == '')
            return;
        this.openPage();
    };
    PlaceInTotePage.prototype.timerTick = function () {
        var _this = this;
        var svc = this;
        setTimeout(function () {
            if (_this.navCtrl.getActive().id != "PlaceInTotePage" || _this.mobileAppSystem.isBusy() == true) {
                _this.timerTick();
                return;
            }
            if (_this.platform.is('cordova'))
                _this.keyboard.close();
            if (_this.toteBarCodeInput._isFocus == false) {
                //this.toteBarCodeInput._readonly = true;
                _this.toteBarCodeInput.setFocus();
                //setTimeout(() =>{
                //  svc.toteBarCodeInput._readonly = false;
                //}, 40);            
            }
            svc.timerTick();
        }, 100); //a least 150ms.
    };
    PlaceInTotePage.prototype.onShowKeyPad = function () {
        var svc = this;
        if (CustomKeyBoard.isVisible())
            CustomKeyBoard.hide();
        else {
            CustomKeyBoard.show();
            CustomKeyBoard.setTarget(this.toteBarCodeInput, function (val) {
                svc.onChangedToteBarcode(val);
            });
        }
    };
    PlaceInTotePage.prototype.onGotoHome = function () {
        this.navCtrl.setRoot('HomeScreenPage');
    };
    __decorate([
        ViewChild('toteBarCodeInputBox'),
        __metadata("design:type", Object)
    ], PlaceInTotePage.prototype, "toteBarCodeInput", void 0);
    PlaceInTotePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-place-in-tote',
            templateUrl: 'place-in-tote.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams,
            Platform,
            MobileAppSystem,
            Keyboard,
            AlertService,
            User])
    ], PlaceInTotePage);
    return PlaceInTotePage;
}());
export { PlaceInTotePage };
//# sourceMappingURL=place-in-tote.js.map