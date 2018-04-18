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
import { MobileAppSystemP2l } from '../../../providers/mobile.app.system.p2l';
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
var P2lBeginJobPage = /** @class */ (function () {
    function P2lBeginJobPage(navCtrl, navParams, keyboard, platform, events, user, mobileAppSystem, alertService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.keyboard = keyboard;
        this.platform = platform;
        this.events = events;
        this.user = user;
        this.mobileAppSystem = mobileAppSystem;
        this.alertService = alertService;
        this.p2lBarCode = '';
        this.p2lBarCode = '';
        CustomKeyBoard.hide();
        this.timerTick();
    }
    P2lBeginJobPage.prototype.timerTick = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.navCtrl.getActive().component.name == "P2lBeginJobPage" && _this.mobileAppSystem.isBusy() == false) {
                if (_this.platform.is('cordova'))
                    _this.keyboard.close();
                if (CustomKeyBoard.isVisible() == false) {
                    if (_this.p2lBarCodeInput._isFocus == false) {
                        _this.p2lBarCodeInput._readonly = true;
                        _this.p2lBarCodeInput.setFocus();
                        setTimeout(function () {
                            _this.p2lBarCodeInput._readonly = false;
                        }, 40);
                    }
                }
            }
            _this.timerTick();
        }, 100); //a least 150ms.
    };
    P2lBeginJobPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad P2lBeginJobPage');
    };
    P2lBeginJobPage.prototype.openPage = function () {
        if (this.p2lBarCode == '')
            return;
        var svc = this;
        this.mobileAppSystem.p2l_getJob(this.user.sessionInfo.userWarehouse, this.p2lBarCode, function (res) {
            if (res == null)
                return;
            if (res.result.statusCode != 200) {
                svc.alertService.doAlert('Job Not Found!', res.result.statusMsg, 'OK').then(function (ret) {
                    return;
                });
            }
            else {
                svc.user.p2linfo.jobID = res.result.jobID;
                svc.user.p2linfo.p2lBarcode = svc.p2lBarCode;
                if (svc.user.p2linfo.bFirstProduct == true) {
                    svc.navCtrl.push('P2lScanProductPage');
                }
                else {
                    svc.navCtrl.push('P2lScan1stlabelPage');
                }
            }
        });
    };
    P2lBeginJobPage.prototype.onChangedP2lBarcode = function (val) {
        var svc = this;
        if (val == null || val == '')
            return;
        this.openPage();
    };
    P2lBeginJobPage.prototype.onShowKeyPad = function () {
        var svc = this;
        if (CustomKeyBoard.isVisible())
            CustomKeyBoard.hide();
        else {
            CustomKeyBoard.show();
            CustomKeyBoard.setTarget(this.p2lBarCodeInput, function (val) {
                svc.onChangedP2lBarcode(val);
            });
        }
    };
    __decorate([
        ViewChild('p2lBarCodeInputBox'),
        __metadata("design:type", Object)
    ], P2lBeginJobPage.prototype, "p2lBarCodeInput", void 0);
    P2lBeginJobPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-p2l-begin-job',
            templateUrl: 'begin-job.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Keyboard,
            Platform,
            Events, User, MobileAppSystemP2l,
            AlertService])
    ], P2lBeginJobPage);
    return P2lBeginJobPage;
}());
export { P2lBeginJobPage };
//# sourceMappingURL=begin-job.js.map