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
        this.jobComplete = "N";
        this.pickQty = 0;
        this.pickUnit = '';
        this.stockCode = '';
    }
    return ProductInfo;
}());
export { ProductInfo };
var P2lScanProductPage = /** @class */ (function () {
    function P2lScanProductPage(navCtrl, navParams, keyboard, platform, mobileAppSystem, modalService, translateService, user, alertService) {
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
        this.bLastPressReturnKey = true;
        this.bBinLocationScaning = false;
        this.confirmedPickFocused = false;
        this.pickUnitSensitive = false;
        this.title = '';
        this.titleDefault = '';
        this.productInfo = new ProductInfo();
        this.confirmedPick = '';
        var svc = this;
        translateService.get('SCANPRODUCT_TITLE').subscribe(function (value) {
            svc.titleDefault = value;
        });
        //init display
        this.getNextProduct();
        CustomKeyBoard.hide();
        this.timerTick();
    }
    P2lScanProductPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ScanProductPage');
    };
    P2lScanProductPage.prototype.getNextProduct = function () {
        var svc = this;
        this.mobileAppSystem.p2l_getNextProduct(this.user.p2linfo.jobID, this.user.p2linfo.p2lBarcode, function (res) {
            if (res == null)
                return;
            if (res.result.statusCode != 200) {
                svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function (ret) {
                    return;
                });
                return;
            }
            else {
                svc.productInfo = res.result;
                svc.confirmedPick = String(svc.productInfo.pickQty);
                svc.title = svc.titleDefault + " : " + svc.productInfo.countProductScanned + " of " + svc.productInfo.countTotalProducts + " done";
            }
        });
    };
    P2lScanProductPage.prototype.destroyP2LLabels = function (statusStr) {
        var svc = this;
        this.bBinLocationScaning = true;
        var strtitle = '';
        var strContent = '';
        if (statusStr != null) {
            var splitted = statusStr.split("\r\n", 2);
            if (splitted.length == 2) {
                strtitle = splitted[0];
                strContent = splitted[1];
            }
        }
        this.modalService.doPrompt(strtitle, strContent, 'Go', 'Cancel', '', 'Barcode Here').then(function (p2lLabelBarCode) {
            svc.bBinLocationScaning = false;
            if (p2lLabelBarCode == '')
                return;
            svc.mobileAppSystem.p2l_destroyLabels(svc.user.p2linfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode, svc.productInfo.pickQty, Number(svc.confirmedPick), p2lLabelBarCode, function (res) {
                if (res == null)
                    return;
                if (res.result.statusCode != 200) {
                    svc.alertService.doAlert('P2L Label for this product is invalid', res.result.statusMsg, 'OK').then(function (res) {
                        svc.destroyP2LLabels(statusStr);
                        return;
                    });
                }
                else {
                    if (res.result.countLabelsRemaining > 0)
                        svc.destroyP2LLabels(res.result.statusMsg);
                    else
                        svc.getNextProduct();
                }
            });
        });
    };
    P2lScanProductPage.prototype.callConfirmQty = function () {
        var svc = this;
        if (this.confirmedPick == '')
            return;
        svc.mobileAppSystem.p2l_confirmPickQty(svc.user.p2linfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode, svc.productInfo.pickQty, Number(this.confirmedPick), "", function (res) {
            if (res == null || res.result == null)
                return;
            if (res.result.statusCode != 200) {
                svc.alertService.doAlert('Error!', res.result.statusMsg, 'OK').then(function (any) {
                });
                return;
            }
            else {
                if (res.result.countTotalDestroyLabels > 0) {
                    var data = { productInfo: svc.productInfo, entered: svc.confirmedPick };
                    svc.modalService.showConfirmModal('P2lConfirmQtyPage', 'inset-modal_2', data).then(function (nRet) {
                        if (nRet == 1) {
                            svc.destroyP2LLabels(res.result.statusMsg);
                        }
                        else if (nRet == 3) {
                            svc.mobileAppSystem.p2l_parkProductPick(svc.user.p2linfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode, svc.user.p2linfo.p2lBarcode, function (res) {
                                if (res == null)
                                    return;
                                if (res.result.statusCode != 200) {
                                    svc.alertService.doAlert("Error!", res.result.statusMsg, "OK").then(function (yes) {
                                        svc.getNextProduct();
                                    });
                                }
                                else
                                    svc.getNextProduct();
                            });
                        }
                    });
                }
                else {
                    svc.alertService.doAlertWithtimeOut('Product Scan successful!', '', 2000).then(function (yes) {
                        if (svc.productInfo.jobComplete == "N") {
                            svc.navCtrl.push('P2lScan1stlabelPage');
                        }
                        else if (svc.productInfo.jobComplete == "Y") {
                            svc.alertService.doAlertWithtimeOut('Product Scan successful!', '', 2000).then(function (yes) {
                                svc.navCtrl.push('P2lBeginJobPage');
                            });
                        }
                    });
                }
            }
        });
    };
    P2lScanProductPage.prototype.inputBinLocationCode = function () {
        var svc = this;
        this.bBinLocationScaning = true;
        this.modalService.doPrompt('Scan or Enter Bin Location', '', 'Go', 'Cancel', '', 'BinLocation').then(function (binLocationCode) {
            svc.bBinLocationScaning = false;
            if (binLocationCode == '')
                return;
            svc.mobileAppSystem.p2l_validateProductBinBarcode(svc.user.p2linfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode, binLocationCode, function (res) {
                if (res == null)
                    return;
                if (res.result.statusCode != 200) {
                    svc.alertService.doAlert('Bin Location Not Found!', res.result.statusMsg, 'OK');
                    return;
                }
                else {
                    svc.callConfirmQty();
                }
            });
        });
    };
    P2lScanProductPage.prototype.onChangedProductBarCode = function (val) {
        if (this.pickUnitSensitive == true)
            return;
        if (val == '')
            return;
        this.productBarCode = val;
        var svc = this;
        this.mobileAppSystem.p2l_validateProductBarcode(this.user.p2linfo.jobID, this.user.sessionInfo.userWarehouse, this.productInfo.stockCode, this.productBarCode, function (res) {
            svc.productBarCode = '';
            if (res == null)
                return;
            if (res.result.statusCode != 200) {
                svc.alertService.doConfirm('Product Barcode Not Found!', "", 'Re-Scan Product', 'Scan Bin').then(function (yes) {
                    if (yes == false) {
                        svc.inputBinLocationCode();
                    }
                });
            }
            else {
                svc.callConfirmQty();
            }
        });
    };
    P2lScanProductPage.prototype.timerTick = function () {
        var _this = this;
        var svc = this;
        setTimeout(function () {
            if (_this.navCtrl.getActive().component.name != "P2lScanProductPage" || _this.mobileAppSystem.isBusy() == true) {
                _this.timerTick();
                return;
            }
            var visibleKeypad = CustomKeyBoard.isVisible();
            if (svc.bBinLocationScaning == false) {
                if (svc.platform.is('cordova'))
                    svc.keyboard.close();
                if (svc.confirmedPickFocused == false) {
                    if (visibleKeypad == false) {
                        if (svc.barCodeInput._isFocus == false) {
                            svc.barCodeInput._readonly = true;
                            svc.barCodeInput.setFocus();
                            setTimeout(function () {
                                svc.barCodeInput._readonly = false;
                            }, 40);
                        }
                    }
                }
            }
            svc.timerTick();
        }, 100); //a least 150ms.
    };
    P2lScanProductPage.prototype.onShowKeyPad = function () {
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
    P2lScanProductPage.prototype.hideKeyboard = function () {
        CustomKeyBoard.hide();
    };
    P2lScanProductPage.prototype.onConfirmQtyFocused = function () {
        console.log("onConfirmQtyFocused");
        var svc = this;
        this.confirmedPickFocused = true;
        CustomKeyBoard.show();
        CustomKeyBoard.setTarget(this.confirmInput, function (val) {
            svc.confirmedPick = val;
            svc.confirmedPickFocused = false;
        });
    };
    P2lScanProductPage.prototype.onClickBarcode = function () {
        if (this.confirmedPickFocused == true) {
            CustomKeyBoard.hide();
            this.confirmedPickFocused = false;
        }
    };
    __decorate([
        ViewChild('barCodeInputBox'),
        __metadata("design:type", Object)
    ], P2lScanProductPage.prototype, "barCodeInput", void 0);
    __decorate([
        ViewChild('confirmedInputBox'),
        __metadata("design:type", Object)
    ], P2lScanProductPage.prototype, "confirmInput", void 0);
    P2lScanProductPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-p2l-scan-product',
            templateUrl: 'p2l-scan-product.html'
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Keyboard,
            Platform,
            MobileAppSystemP2l,
            ModalService,
            TranslateService, User, AlertService])
    ], P2lScanProductPage);
    return P2lScanProductPage;
}());
export { P2lScanProductPage };
//# sourceMappingURL=p2l-scan-product.js.map