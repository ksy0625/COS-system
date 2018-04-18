var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertService } from './alert.service';
import { UtilService } from './util.service';
/*
  Generated class for the CoreProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
var MobileAppSystem = /** @class */ (function () {
    function MobileAppSystem(http, alertService, utilService) {
        this.http = http;
        this.alertService = alertService;
        this.utilService = utilService;
        this.baseUrl = 'http://inttest.cos.net.au/ProcessRequest';
        console.log('Hello CoreService Provider');
        this.requestConveyorCounter = 1;
        this.sessionId = '';
    }
    MobileAppSystem.prototype.setBaseUrl = function (newUrl) {
        this.baseUrl = newUrl;
    };
    MobileAppSystem.prototype.getBaseUrl = function () {
        return this.baseUrl;
    };
    MobileAppSystem.prototype.isBusy = function () {
        if (this.utilService.loading != null)
            return true;
        return false;
    };
    MobileAppSystem.prototype._doServerSideOp = function (requests, checkForErrors, isArrayRequest, callback) {
        var _this = this;
        var model = {
            requests: requests,
            context: {
                sessionId: this.sessionId,
                notificationConnectionId: this.notificationConnectionId
            }
        };
        console.log(model);
        var body = { id: JSON.stringify(model) };
        this.utilService.presentLoading();
        // let headers = new Headers();
        // headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // headers.append("Accept", 'application/x-www-form-urlencoded');
        // let options = new RequestOptions({ headers: headers });
        // let res = this.http.post(this.baseUrl, body, options);
        var res = this.http.post(this.baseUrl, body);
        res.map(function (res) { return res.json(); }).subscribe(function (res) {
            console.log(res);
            _this.utilService.hideLoading();
            var result = res[0];
            if (checkForErrors == true) {
                _this.checkForErrors(result);
            }
            if (callback != null)
                callback(result);
        }, function (err) {
            _this.utilService.hideLoading();
            _this.checkForErrors(null);
            callback(null);
        });
    };
    MobileAppSystem.prototype.checkForErrors = function (res) {
        if (res == null) {
            this.alertService.doAlert('Api call failed', 'No response', 'OK');
            return true;
        }
        if (res.isError == true) {
            var errMsg = '';
            if (res.errorMessage != null)
                errMsg = res.errorMessage;
            this.alertService.doAlert('Api call failed', errMsg, 'OK');
        }
    };
    MobileAppSystem.prototype.loginOPsApp = function (userName, password, success_cb, isSingleSingOn) {
        if (isSingleSingOn == null)
            isSingleSingOn = false;
        var requests = [
            {
                requestCounter: 1,
                command: 'MobileLogin',
                data: {
                    userName: userName, password: password, isSingleSingOn: isSingleSingOn
                }
            }
        ];
        var svc = this;
        this._doServerSideOp(requests, false, false, function (res) {
            if (res == null)
                return;
            if (res.isError == true) {
                svc.alertService.doAlert('Login failed', res.errorMessage, 'OK');
                return;
            }
            if (res.isError == false) {
                svc.sessionId = res.result.loginResult.sessionId;
                if (success_cb != null)
                    success_cb(res);
            }
        });
    };
    MobileAppSystem.prototype.initialiseConveyorPick = function (warehouse, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'initialiseConveyorPick',
                data: {
                    userSessionId: this.sessionId,
                    warehouse: warehouse
                }
            }
        ];
        this._doServerSideOp(requests, true, false, function (res) {
            if (res == null)
                return;
            if (res.isError == false) {
                if (success_cb != null)
                    success_cb(res);
            }
        });
    };
    MobileAppSystem.prototype.scanOrderBarcode = function (orderBarcode, warehouse, pickzone, success_cb) {
        var svc = this;
        var requests = [
            {
                requestCounter: 1,
                command: 'scanOrderBarcode',
                data: {
                    userSessionId: this.sessionId,
                    orderBarcode: orderBarcode,
                    warehouse: warehouse,
                    pickzone: pickzone
                }
            }
        ];
        this._doServerSideOp(requests, false, false, function (res) {
            if (res.isError == true) {
                svc.alertService.doAlert('Check barcode', 'Barcode not found', 'OK');
            }
            else {
                if (success_cb != null)
                    success_cb(res);
            }
        });
    };
    MobileAppSystem.prototype.checkProductNotInToteLimit = function (orderBarcode, allowableProductsNotInTote, success_cb) {
        var svc = this;
        var requests = [
            {
                requestCounter: 1,
                command: 'checkProductNotInToteLimit',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber: orderBarcode,
                    allowableProductsNotInTote: allowableProductsNotInTote
                }
            }
        ];
        this._doServerSideOp(requests, false, false, function (res) {
            if (res.isError == true) {
                svc.alertService.doAlert('CheckProductNotInToteLimit', res.errorMessage, 'OK');
            }
            else {
                if (success_cb != null)
                    success_cb(res);
            }
        });
    };
    MobileAppSystem.prototype.getProductInfoProductBarcode = function (barcode, orderNumber, toteNumber, warehouse, pickzone, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'getProductInfoProductBarcode',
                data: {
                    userSessionId: this.sessionId,
                    barcode: barcode,
                    orderNumber: orderNumber,
                    toteNumber: toteNumber,
                    //toteNumber:12,
                    warehouse: warehouse,
                    pickzone: pickzone
                }
            }
        ];
        this._doServerSideOp(requests, false, false, function (res) {
            if (success_cb != null)
                success_cb(res);
        });
    };
    MobileAppSystem.prototype.getProductInfoBinBarcode = function (barcode, orderNumber, toteNumber, warehouse, pickzone, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'getProductInfoBinBarcode',
                data: {
                    userSessionId: this.sessionId,
                    barcode: barcode,
                    orderNumber: orderNumber,
                    toteNumber: toteNumber,
                    warehouse: warehouse,
                    pickzone: pickzone
                }
            }
        ];
        this._doServerSideOp(requests, false, false, function (res) {
            if (success_cb != null)
                success_cb(res);
        });
    };
    MobileAppSystem.prototype.updateProductConfirmQty = function (orderNumber, stockCode, binLocation, confirmQty, toteNumber, pickzone, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'updateProductConfirmQty',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber: orderNumber,
                    stockCode: stockCode,
                    binLocation: binLocation,
                    confirmQty: confirmQty,
                    toteNumber: toteNumber,
                    pickzone: pickzone
                }
            }
        ];
        this._doServerSideOp(requests, false, false, function (res) {
            if (res.isError == true) {
                //svc.alertService.doAlert('GetProductInfoBinBarcode', res.errorMessage, 'OK');
                if (success_cb != null)
                    success_cb(null);
            }
            else {
                if (success_cb != null)
                    success_cb(res);
            }
        });
    };
    MobileAppSystem.prototype.getProductListNotInTote = function (orderNumber, pickZone, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'getProductListNotInTote',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber: orderNumber,
                    pickzone: pickZone
                }
            }
        ];
        this._doServerSideOp(requests, false, false, function (res) {
            if (res.isError == true) {
                //svc.alertService.doAlert('GetProductInfoBinBarcode', res.errorMessage, 'OK');
                if (success_cb != null)
                    success_cb(null);
            }
            else {
                if (success_cb != null)
                    success_cb(res);
            }
        });
    };
    MobileAppSystem.prototype.placeInTote = function (orderNumber, toteNumber, pickZone, productList, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'placeInTote',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber: orderNumber,
                    toteNumber: toteNumber,
                    productList: productList,
                    pickzone: pickZone
                }
            }
        ];
        this._doServerSideOp(requests, false, false, function (res) {
            if (res.isError == true) {
                //svc.alertService.doAlert('GetProductInfoBinBarcode', res.errorMessage, 'OK');
                if (success_cb != null)
                    success_cb(null);
            }
            else {
                if (success_cb != null)
                    success_cb(res);
            }
        });
    };
    MobileAppSystem.prototype.allocateNewToteToOrder = function (orderNumber, toteNumber, pickZone, productList, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'allocateNewToteToOrder',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber: orderNumber,
                    toteNumber: toteNumber,
                    productList: productList,
                    pickzone: pickZone
                }
            }
        ];
        this._doServerSideOp(requests, false, false, function (res) {
            if (res.isError == true) {
                //svc.alertService.doAlert('GetProductInfoBinBarcode', res.errorMessage, 'OK');
                if (success_cb != null)
                    success_cb(null);
            }
            else {
                if (success_cb != null)
                    success_cb(res);
            }
        });
    };
    MobileAppSystem.prototype.getOrderPickStatus = function (orderNumber, pickZone, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'getOrderPickStatus',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber: orderNumber,
                    pickzone: pickZone
                }
            }
        ];
        this._doServerSideOp(requests, false, false, function (res) {
            if (res.isError == true) {
                if (success_cb != null)
                    success_cb(null);
            }
            else {
                if (success_cb != null)
                    success_cb(res);
            }
        });
    };
    MobileAppSystem.prototype.checkInToteStatus = function (orderNumber, pickZone, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'checkInToteStatus',
                data: {
                    userSessionId: this.sessionId,
                    orderNumber: orderNumber,
                    pickzone: pickZone
                }
            }
        ];
        this._doServerSideOp(requests, false, false, function (res) {
            if (res.isError == true) {
                if (success_cb != null)
                    success_cb(null);
            }
            else {
                if (success_cb != null)
                    success_cb(res);
            }
        });
    };
    MobileAppSystem = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            AlertService,
            UtilService])
    ], MobileAppSystem);
    return MobileAppSystem;
}());
export { MobileAppSystem };
//# sourceMappingURL=mobile.app.system.js.map