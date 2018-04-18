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
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import { MobileAppSystemP2l } from '../../../providers/mobile.app.system.p2l';
import { User } from '../../../providers/user';
import { AlertService } from '../../../providers/alert.service';
import { ModalService } from '../../../providers/modal.service';
import { CustomKeyBoard } from '../../../components/customKeyBoard/custom-keyboard';
/**
 * Generated class for the ScanProductPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var ProductInfo = /** @class */ (function () {
    function ProductInfo() {
        this.countProductScanned = 0;
        this.countTotalProducts = 0;
        this.jobID = 0;
        this.binLocation = '';
        this.description = '';
        this.img_url = '';
        this.jobComplete = 0;
        this.pickQty = 0;
        this.pickUnit = '';
        this.stockCode = '';
    }
    return ProductInfo;
}());
export { ProductInfo };
var P2lScan1stlabelPage = /** @class */ (function () {
    function P2lScan1stlabelPage(navCtrl, navParams, keyboard, platform, mobileAppSystem, modalService, translateService, user, alertService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.keyboard = keyboard;
        this.platform = platform;
        this.mobileAppSystem = mobileAppSystem;
        this.modalService = modalService;
        this.translateService = translateService;
        this.user = user;
        this.alertService = alertService;
        this.productBarCode = '';
        this.title = '';
        this.titleDefault = '';
        this.productInfo = new ProductInfo();
        var svc = this;
        translateService.get('SCAN_1ST_TITLE').subscribe(function (value) {
            svc.titleDefault = value;
        });
        //init display
        this.getNext1stLabel();
        CustomKeyBoard.hide();
        this.timerTick();
    }
    P2lScan1stlabelPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ScanProductPage');
    };
    P2lScan1stlabelPage.prototype.getNext1stLabel = function () {
        var svc = this;
        this.mobileAppSystem.p2l_getNext1stLabel(this.user.p2linfo.jobID, function (res) {
            if (res == null || res.result == null)
                return;
            svc.productInfo = res.result;
            svc.title = svc.titleDefault + " : " + svc.productInfo.countProductScanned + " of " + svc.productInfo.countTotalProducts + " done";
        });
    };
    P2lScan1stlabelPage.prototype.onChangedProductBarCode = function (val) {
        if (val == '')
            return;
        this.productBarCode = val;
        var svc = this;
        this.mobileAppSystem.p2l_validate1stLabel(this.user.p2linfo.jobID, this.user.sessionInfo.userWarehouse, this.productInfo.stockCode, this.productBarCode, function (res) {
            if (res == null || res.result == null)
                return;
            if (res.result.statusCode != 200) {
                svc.productBarCode = '';
                svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function (yes) {
                });
            }
            else {
                svc.user.p2linfo.p2lBarcode = val;
                svc.user.p2linfo.bFirstProduct = false;
                svc.navCtrl.push('P2lScanProductPage');
            }
        });
    };
    P2lScan1stlabelPage.prototype.timerTick = function () {
        var _this = this;
        var svc = this;
        setTimeout(function () {
            if (_this.navCtrl.getActive().component.name != "P2lScanProductPage" || _this.mobileAppSystem.isBusy() == true) {
                _this.timerTick();
                return;
            }
            var visibleKeypad = CustomKeyBoard.isVisible();
            if (svc.platform.is('cordova'))
                svc.keyboard.close();
            if (visibleKeypad == false) {
                if (svc.barCodeInput._isFocus == false) {
                    svc.barCodeInput._readonly = true;
                    svc.barCodeInput.setFocus();
                    setTimeout(function () {
                        svc.barCodeInput._readonly = false;
                    }, 40);
                }
            }
            svc.timerTick();
        }, 100); //a least 150ms.
    };
    P2lScan1stlabelPage.prototype.onShowKeyPad = function () {
        var svc = this;
        if (CustomKeyBoard.isVisible())
            CustomKeyBoard.hide();
        else {
            CustomKeyBoard.show();
            CustomKeyBoard.setTarget(this.barCodeInput, function (val) {
                svc.onChangedProductBarCode(val);
            });
        }
    };
    P2lScan1stlabelPage.prototype.hideKeyboard = function () {
        CustomKeyBoard.hide();
    };
    P2lScan1stlabelPage.prototype.openPage = function () {
        this.onChangedProductBarCode(this.productBarCode);
    };
    __decorate([
        ViewChild('barCodeInputBox'),
        __metadata("design:type", Object)
    ], P2lScan1stlabelPage.prototype, "barCodeInput", void 0);
    __decorate([
        ViewChild('confirmedInputBox'),
        __metadata("design:type", Object)
    ], P2lScan1stlabelPage.prototype, "confirmInput", void 0);
    P2lScan1stlabelPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-p2l-scan-1stlabel',
            templateUrl: 'p2l-scan-1stlabel.html'
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Keyboard,
            Platform,
            MobileAppSystemP2l,
            ModalService,
            TranslateService, User, AlertService])
    ], P2lScan1stlabelPage);
    return P2lScan1stlabelPage;
}());
export { P2lScan1stlabelPage };
//# sourceMappingURL=p2l-scan-1stlabel.js.map