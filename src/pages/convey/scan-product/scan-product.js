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
import { Platform } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { MobileAppSystem } from '../../../providers/mobile.app.system';
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
var SurplusBin = /** @class */ (function () {
    function SurplusBin() {
    }
    return SurplusBin;
}());
export { SurplusBin };
var ProductInfo = /** @class */ (function () {
    function ProductInfo() {
    }
    return ProductInfo;
}());
export { ProductInfo };
var ScanProductPage = /** @class */ (function () {
    function ScanProductPage(navCtrl, navParams, keyboard, platform, mobileAppSystem, modalService, translateService, user, alertService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.keyboard = keyboard;
        this.platform = platform;
        this.mobileAppSystem = mobileAppSystem;
        this.modalService = modalService;
        this.translateService = translateService;
        this.user = user;
        this.alertService = alertService;
        this.onceConfirmClicked = false;
        this.productBarCode = '';
        this.productBarCode1 = '';
        this.scanStarted = false;
        this.bBinLocationScaning = false;
        this.confirmedPickFocused = false;
        this.pickUnitSensitive = false;
        this.scanStarted = false;
        this.title = '';
        this.titleDefault = '';
        this.productInfo = new ProductInfo();
        this.confirmedPick = '';
        var svc = this;
        translateService.get('SCANPRODUCT_TITLE').subscribe(function (value) {
            svc.titleDefault = value;
            svc.title = value + " : " + svc.user.orderInfo.countProductScaned + " of " + svc.user.orderInfo.countTotalProducts + " done";
        });
        CustomKeyBoard.hide();
        this.timerTick();
    }
    ScanProductPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ScanProductPage');
    };
    ScanProductPage.prototype.openPage = function () {
        this.scanStarted = false;
        this.onceConfirmClicked = false;
        this.navCtrl.push('PlaceInTotePage');
    };
    ScanProductPage.prototype.setQtyInformation = function (res) {
        this.scanStarted = true;
        this.user.orderInfo.countProductScaned = res.countProductScanned;
        this.user.orderInfo.countTotalProducts = res.countTotalProducts;
        this.user.orderInfo.binLocations = res.binLocationList;
        this.productInfo.orderNumber = res.orderNumber;
        this.productInfo.binLocation = res.binLocation;
        this.productInfo.description = res.description;
        this.productInfo.img_url = res.img_url;
        //
        //res.img_url; //   'style="background-image:'  + res.img_url + ';"';
        this.productInfo.pickQty = res.pickQty;
        this.productInfo.pickUnit = res.pickUnit;
        this.productInfo.pickUnitSensitive = res.pickUnitSensitive;
        // if(res.pickUnitSensitive =='Y')
        //   this.pickUnitSensitive = true;
        // else
        this.pickUnitSensitive = false;
        this.productInfo.stockCode = res.stockCode;
        this.productInfo.surplusBins = res.surplusBins;
        this.confirmedPick = String(this.productInfo.pickQty);
        this.title = this.titleDefault + " : " + this.user.orderInfo.countProductScaned + " of " + this.user.orderInfo.countTotalProducts + " done";
        this.onceConfirmClicked = false;
        this.clearBarcodeScan();
    };
    ScanProductPage.prototype.updateProductConfirmQty = function (confirmedQty) {
        var svc = this;
        var orderCompleted = false;
        this.mobileAppSystem.updateProductConfirmQty(this.productInfo.orderNumber, this.productInfo.stockCode, this.productInfo.binLocation, confirmedQty, this.user.orderInfo.toteNumber, this.user.orderInfo.zone, function (res) {
            if (res != null && res.result != null) {
                svc.user.orderInfo.binLocations = res.result.binLocationList;
                svc.user.orderInfo.countProductScaned = res.result.countProductScanned;
                svc.user.orderInfo.countTotalProducts = res.result.countTotalProducts;
                svc.title = svc.titleDefault + " : " + svc.user.orderInfo.countProductScaned + " of " + svc.user.orderInfo.countTotalProducts + " done";
                if (res.result.statusCode != 200) {
                    svc.alertService.doAlert('Error', res.result.statusMsg, 'OK');
                    return;
                }
                else if (res.result.orderComplete == 'Y') {
                    orderCompleted = true;
                    svc.navCtrl.push('PlaceInTotePage');
                    return;
                }
            }
            svc.mobileAppSystem.checkProductNotInToteLimit(svc.user.orderInfo.orderBarcode, svc.user.allowableProductsNotInTote, function (res) {
                if (res == null || res.result == null)
                    return;
                if (res.result.overLimit == 'Y') {
                    svc.alertService.doConfirm('Your OverLoaded!', res.result.statusMsg, 'YES', 'NO').then(function (yes) {
                        if (yes) {
                            svc.navCtrl.push('PlaceInTotePage');
                        }
                    });
                }
                else {
                    svc.scanStarted = false;
                }
            });
        });
    };
    ScanProductPage.prototype.inputBinLocationCode = function () {
        var svc = this;
        this.bBinLocationScaning = true;
        this.modalService.doPromptRightSide('Product Barcode Not Found!', 'Scan or Enter Bin Location', 'Go', 'Cancel', '', 'BinLocation').then(function (binLocationCode) {
            svc.bBinLocationScaning = false;
            if (binLocationCode == '') {
                return;
            }
            svc.mobileAppSystem.getProductInfoBinBarcode(binLocationCode, svc.user.orderInfo.orderBarcode, svc.user.orderInfo.toteNumber, svc.user.orderInfo.warehouse, svc.user.orderInfo.zone, function (res) {
                if (res.isError) {
                    svc.alertService.doAlert('Error', res.errorMessage, 'OK');
                }
                else {
                    if (res.result.statusCode == 200)
                        svc.setQtyInformation(res.result);
                    else {
                        svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function (ret) {
                        });
                    }
                }
            });
        });
    };
    ScanProductPage.prototype.checkProductBarcode = function (productBarcode) {
        var svc = this;
        this.mobileAppSystem.getProductInfoProductBarcode(productBarcode, this.user.orderInfo.orderBarcode, this.user.orderInfo.toteNumber, this.user.orderInfo.warehouse, this.user.orderInfo.zone, function (res) {
            svc.clearBarcodeScan();
            if (res.isError) {
                svc.inputBinLocationCode();
                return;
            }
            else {
                if (res.result.statusCode == 200) {
                    svc.setQtyInformation(res.result);
                }
                else {
                    svc.alertService.doConfirm('Error', res.result.statusMsg, 'OK', 'Scan Bin Barcode').then(function (ret) {
                        if (ret == false)
                            svc.inputBinLocationCode();
                    });
                }
            }
        });
    };
    ScanProductPage.prototype.startScanBarcode = function () {
        if (this.productBarCode == '')
            return;
        this.scanStarted = false;
        var productBarcode = this.productBarCode;
        this.checkProductBarcode(productBarcode);
    };
    ScanProductPage.prototype.firstScan = function () {
        this.onChangedProductBarCode(this.productBarCode);
        CustomKeyBoard.hide();
    };
    ScanProductPage.prototype.onChangedProductBarCode = function (val) {
        if (this.scanStarted == true)
            return;
        if (val == '')
            return;
        this.startScanBarcode();
    };
    ScanProductPage.prototype.onChangedProductBarCode1 = function (val) {
        if (this.scanStarted == false)
            return;
        if (this.productInfo.pickUnitSensitive == 'Y' && this.pickUnitSensitive == false)
            return;
        if (val == '')
            return;
        this.productBarCode = val;
        this.startScanBarcode();
    };
    ScanProductPage.prototype.clearBarcodeScan = function () {
        this.productBarCode = '';
        this.productBarCode1 = '';
    };
    ScanProductPage.prototype.timerTick = function () {
        var _this = this;
        var svc = this;
        setTimeout(function () {
            if (_this.navCtrl.getActive().id != "ScanProductPage" || _this.mobileAppSystem.isBusy() == true) {
                _this.timerTick();
                return;
            }
            var visibleKeypad = CustomKeyBoard.isVisible();
            if (svc.scanStarted == false) {
                if (svc.bBinLocationScaning == false) {
                    if (svc.platform.is('cordova'))
                        svc.keyboard.close();
                    if (visibleKeypad == false) {
                        if (svc.barCodeInput._isFocus == false) {
                            //svc.barCodeInput._readonly = true;
                            svc.barCodeInput.setFocus();
                            //setTimeout(() =>{
                            //  svc.barCodeInput._readonly = false;
                            //}, 40);            
                        }
                    }
                }
            }
            else {
                if (svc.bBinLocationScaning == false) {
                    if (svc.platform.is('cordova'))
                        svc.keyboard.close();
                    if (svc.confirmedPickFocused == false) {
                        if (visibleKeypad == false) {
                            if (svc.barCodeInput1._isFocus == false) {
                                //svc.barCodeInput1._readonly = true;
                                svc.barCodeInput1.setFocus();
                                //setTimeout(() =>{
                                //svc.barCodeInput1._readonly = false;
                                //}, 40);
                            }
                        }
                    }
                }
            }
            svc.timerTick();
        }, 100); //a least 150ms.
    };
    ScanProductPage.prototype.onShowKeyPad = function () {
        var svc = this;
        if (CustomKeyBoard.isVisible())
            CustomKeyBoard.hide();
        else {
            CustomKeyBoard.show();
            if (this.scanStarted == false) {
                CustomKeyBoard.setTarget(this.barCodeInput, function (val) {
                    svc.onChangedProductBarCode(val);
                });
            }
            else {
                CustomKeyBoard.setTarget(this.barCodeInput1, function (val) {
                    svc.onChangedProductBarCode1(val);
                });
            }
        }
    };
    ScanProductPage.prototype.hideKeyboard = function () {
        CustomKeyBoard.hide();
    };
    ScanProductPage.prototype.onConfirmQtyFocused = function () {
        var svc = this;
        this.confirmedPick = '';
        this.confirmedPickFocused = true;
        CustomKeyBoard.show();
        CustomKeyBoard.setTarget(this.confirmInput, function (val) {
            svc.confirmedPickFocused = false;
        });
    };
    ScanProductPage.prototype.onClickBarcode1 = function () {
        if (this.confirmedPickFocused == true) {
            CustomKeyBoard.hide();
            this.confirmedPickFocused = false;
        }
    };
    ScanProductPage.prototype.onConfirmClicked = function () {
        var svc = this;
        svc.confirmedPickFocused = false;
        if (this.confirmedPick == '')
            return;
        if (this.productInfo.stockCode == '')
            return;
        if (this.productInfo.pickUnitSensitive == 'Y' && this.pickUnitSensitive == false)
            return;
        var confirmQty = Number(this.confirmedPick);
        if (confirmQty != this.productInfo.pickQty) {
            var data = { productInfo: this.productInfo, entered: this.confirmedPick };
            this.modalService.showConfirmModal('ConfirmQtyPage', 'inset-modal_2', data).then(function (yes) {
                if (yes == 1) {
                    svc.updateProductConfirmQty(confirmQty);
                    svc.onceConfirmClicked = true;
                }
                else
                    svc.confirmedPick = String(svc.productInfo.pickQty);
            });
        }
        else {
            svc.updateProductConfirmQty(confirmQty);
            svc.onceConfirmClicked = true;
        }
    };
    ScanProductPage.prototype.onGotoHome = function () {
        this.navCtrl.setRoot('HomeScreenPage');
    };
    ScanProductPage.prototype.onGotoScanOrder = function () {
        var svc = this;
        this.mobileAppSystem.checkInToteStatus(this.user.orderInfo.orderBarcode, this.user.orderInfo.zone, function (res) {
            if (res == null || res.result == null)
                return;
            if (res.result.itemsNotInToteExist == 'Y') {
                svc.alertService.doConfirm('Error', res.result.statusMsg, 'OK', 'Cancel').then(function (yes) {
                    if (yes)
                        svc.navCtrl.push('PlaceInTotePage');
                });
            }
            else {
                svc.navCtrl.setRoot('ScanOrderPage');
            }
        });
    };
    __decorate([
        ViewChild('barCodeInputBox'),
        __metadata("design:type", Object)
    ], ScanProductPage.prototype, "barCodeInput", void 0);
    __decorate([
        ViewChild('barCodeInputBox1'),
        __metadata("design:type", Object)
    ], ScanProductPage.prototype, "barCodeInput1", void 0);
    __decorate([
        ViewChild('confirmedInputBox'),
        __metadata("design:type", Object)
    ], ScanProductPage.prototype, "confirmInput", void 0);
    ScanProductPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-scan-product',
            templateUrl: 'scan-product.html'
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Keyboard,
            Platform,
            MobileAppSystem,
            ModalService,
            TranslateService, User, AlertService])
    ], ScanProductPage);
    return ScanProductPage;
}());
export { ScanProductPage };
//# sourceMappingURL=scan-product.js.map