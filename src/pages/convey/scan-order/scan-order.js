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
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { MobileAppSystem } from '../../../providers/mobile.app.system';
import { AlertService } from '../../../providers/alert.service';
import { User } from '../../../providers/user';
import { Keyboard } from '@ionic-native/keyboard';
import { CustomKeyBoard } from '../../../components/customKeyBoard/custom-keyboard';
/**
 * Generated class for the ScanOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var ScanOrderPage = /** @class */ (function () {
    function ScanOrderPage(navCtrl, navParams, keyboard, platform, events, user, mobileAppSystem, alertService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.keyboard = keyboard;
        this.platform = platform;
        this.events = events;
        this.user = user;
        this.mobileAppSystem = mobileAppSystem;
        this.alertService = alertService;
        this.zoneCode = '';
        this.orderBarCode = '';
        this.orderBarCode = '';
        //init zone list
        var svc = this;
        this.mobileAppSystem.initialiseConveyorPick(this.user.sessionInfo.userWarehouse, function (res) {
            if (res == null)
                return;
            svc.user.allowableProductsNotInTote = res.result.allowableProductsNotInTote;
            svc.user.hasTotes = res.result.hasTotes;
            if (svc.user.hasTotes == null)
                svc.user.hasTotes = '';
            svc.zoneCodes = res.result.pickZonesList;
        });
        CustomKeyBoard.hide();
        this.timerTick();
    }
    ScanOrderPage.prototype.timerTick = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.navCtrl.getActive().id == "ScanOrderPage" && _this.mobileAppSystem.isBusy() == false) {
                if (_this.platform.is('cordova'))
                    _this.keyboard.close();
                if (CustomKeyBoard.isVisible() == false) {
                    if (_this.zoneCodes == null || _this.zoneCodes.length == 0 || (_this.zoneCodes.length > 0 && _this.zoneSelector._isFocus == false)) {
                        if (_this.orderBarCodeInput._isFocus == false) {
                            //this.orderBarCodeInput._readonly = true;
                            _this.orderBarCodeInput.setFocus();
                            //setTimeout(() =>{
                            //  if (this.platform.is('cordova'))
                            //    this.keyboard.close();
                            //}, 50);
                        }
                    }
                }
            }
            _this.timerTick();
        }, 100); //a least 150ms.
    };
    ScanOrderPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ScanOrderPage');
        this.orderBarCodeInput.setFocus();
    };
    ScanOrderPage.prototype.openPage = function () {
        if (this.orderBarCode == '')
            return;
        if (this.zoneCodes != null && this.zoneCodes.length > 0 && this.zoneCode == '')
            return;
        if (this.zoneCodes == null)
            this.zoneCode = "";
        var svc = this;
        this.mobileAppSystem.scanOrderBarcode(this.orderBarCode, this.user.sessionInfo.userWarehouse, this.zoneCode, function (res) {
            if (res == null)
                return;
            if (res.result.binLocationList == null) {
                if (res.result.statusMsg != null && res.result.statusMsg != '')
                    // svc.modalService.doAlert('ScanOrderBarcode', res.result.statusMsg, 'OK', 'default', 'barcode');
                    svc.alertService.doAlert('ScanOrderBarcode', res.result.statusMsg, 'OK');
                return;
            }
            svc.user.orderInfo.zone = svc.zoneCode;
            svc.user.orderInfo.binLocations = res.result.binLocationList;
            svc.user.orderInfo.countProductScaned = res.result.countProductScanned;
            svc.user.orderInfo.countTotalProducts = res.result.countTotalProducts;
            svc.user.orderInfo.orderBarcode = res.result.orderNumber;
            svc.user.orderInfo.toteNumber = res.result.toteNumber;
            svc.user.orderInfo.warehouse = svc.user.sessionInfo.userWarehouse;
            svc.events.publish('convey:startscan');
            svc.navCtrl.push('ScanProductPage');
        });
    };
    ScanOrderPage.prototype.onChangedOrderBarcode = function (val) {
        if (val == null || val == '')
            return;
        if (this.zoneCodes == null || this.zoneCodes.length == 0)
            this.openPage();
        else if (this.zoneCode != '')
            this.openPage();
    };
    ScanOrderPage.prototype.onChangeZone = function () {
        this.selectOrderBarcodeInput();
    };
    ScanOrderPage.prototype.selectOrderBarcodeInput = function () {
        var _this = this;
        setTimeout(function () {
            _this.orderBarCodeInput.setFocus();
        }, 300); //a least 150ms.
    };
    ScanOrderPage.prototype.onShowKeyPad = function () {
        var svc = this;
        if (CustomKeyBoard.isVisible())
            CustomKeyBoard.hide();
        else {
            CustomKeyBoard.show();
            CustomKeyBoard.setTarget(this.orderBarCodeInput, function (val) {
                svc.onChangedOrderBarcode(val);
            });
        }
    };
    __decorate([
        ViewChild('orderBarCodeInputBox'),
        __metadata("design:type", Object)
    ], ScanOrderPage.prototype, "orderBarCodeInput", void 0);
    __decorate([
        ViewChild('zoneSelector'),
        __metadata("design:type", Object)
    ], ScanOrderPage.prototype, "zoneSelector", void 0);
    ScanOrderPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-scan-order',
            templateUrl: 'scan-order.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Keyboard,
            Platform,
            Events, User, MobileAppSystem,
            AlertService])
    ], ScanOrderPage);
    return ScanOrderPage;
}());
export { ScanOrderPage };
//# sourceMappingURL=scan-order.js.map