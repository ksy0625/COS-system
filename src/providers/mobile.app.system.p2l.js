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
var MobileAppSystemP2l = /** @class */ (function () {
    function MobileAppSystemP2l(http, alertService, utilService) {
        this.http = http;
        this.alertService = alertService;
        this.utilService = utilService;
        this.baseUrl = '';
        console.log('Hello CoreService Provider');
        this.requestConveyorCounter = 1;
        this.sessionId = '';
    }
    MobileAppSystemP2l.prototype.setBaseUrl = function (newUrl) {
        this.baseUrl = newUrl;
    };
    MobileAppSystemP2l.prototype.getBaseUrl = function () {
        return this.baseUrl;
    };
    MobileAppSystemP2l.prototype.isBusy = function () {
        if (this.utilService.loading != null)
            return true;
        return false;
    };
    MobileAppSystemP2l.prototype.setSessionId = function (sessId) {
        this.sessionId = sessId;
    };
    MobileAppSystemP2l.prototype._doServerSideOp = function (requests, checkForErrors, isArrayRequest, callback) {
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
    MobileAppSystemP2l.prototype.checkForErrors = function (res) {
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
    MobileAppSystemP2l.prototype.loginOPsApp = function (userName, password, success_cb, isSingleSingOn) {
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
    MobileAppSystemP2l.prototype.p2l_getJob = function (warehouse, p2lBarcode, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'p2l_getJob',
                data: {
                    userSessionID: this.sessionId,
                    warehouse: warehouse,
                    p2lBarcode: p2lBarcode,
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
    MobileAppSystemP2l.prototype.p2l_getNextProduct = function (jobID, p2lBarcode, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'p2l_getNextProduct',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    p2lBarcode: p2lBarcode
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
    MobileAppSystemP2l.prototype.p2l_getNext1stLabel = function (jobID, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'p2l_getNext1stLabel',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID
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
    MobileAppSystemP2l.prototype.p2l_validateProductBarcode = function (jobID, warehouse, stockCode, productBarcode, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'p2l_validateProductBarcode',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse: warehouse,
                    stockCode: stockCode,
                    productBarcode: productBarcode
                }
            }
        ];
        this._doServerSideOp(requests, true, false, function (res) {
            if (success_cb != null)
                success_cb(res);
        });
    };
    MobileAppSystemP2l.prototype.p2l_validateProductBinBarcode = function (jobID, warehouse, stockCode, binBarcode, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'p2l_validateProductBinBarcode',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse: warehouse,
                    stockCode: stockCode,
                    binBarcode: binBarcode
                }
            }
        ];
        this._doServerSideOp(requests, true, false, function (res) {
            if (success_cb != null)
                success_cb(res);
        });
    };
    MobileAppSystemP2l.prototype.p2l_validate1stLabel = function (jobID, warehouse, stockCode, p2lBarcode, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'p2l_validate1stLabel',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse: warehouse,
                    stockCode: stockCode,
                    p2lBarcode: p2lBarcode
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
    MobileAppSystemP2l.prototype.p2l_parkProductPick = function (jobID, warehouse, stockCode, p2lBarcode, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'p2l_parkProductPick',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse: warehouse,
                    stockCode: stockCode,
                    p2lBarcode: p2lBarcode
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
    MobileAppSystemP2l.prototype.p2l_confirmPickQty = function (jobID, warehouse, stockCode, pickQty, confirmQty, confirmQtyCheckAck, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'p2l_confirmPickQty',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse: warehouse,
                    stockCode: stockCode,
                    pickQty: pickQty,
                    confirmQty: confirmQty,
                    confirmQtyCheckAck: confirmQtyCheckAck
                }
            }
        ];
        this._doServerSideOp(requests, true, false, function (res) {
            if (success_cb != null)
                success_cb(res);
        });
    };
    MobileAppSystemP2l.prototype.p2l_destroyLabels = function (jobID, warehouse, stockCode, pickQty, confirmQty, destroyP2Lbarcode, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'p2l_destroyLabels',
                data: {
                    userSessionID: this.sessionId,
                    jobID: jobID,
                    warehouse: warehouse,
                    stockCode: stockCode,
                    pickQty: pickQty,
                    confirmQty: confirmQty,
                    destroyP2Lbarcode: destroyP2Lbarcode
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
    MobileAppSystemP2l.prototype.p2l_getJobPickStatus = function (warehouse, jobID, success_cb) {
        var requests = [
            {
                requestCounter: 1,
                command: 'p2l_getJobPickStatus',
                data: {
                    userSessionID: this.sessionId,
                    warehouse: warehouse,
                    jobID: jobID
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
    MobileAppSystemP2l.prototype.deAllocateJob = function (warehouse, jobID) {
        var requests = [
            {
                requestCounter: 1,
                command: 'deAllocateJob',
                data: {
                    userSessionID: this.sessionId,
                    warehouse: warehouse,
                    jobID: jobID
                }
            }
        ];
        this._doServerSideOp(requests, true, false, function (res) {
            if (res == null)
                return;
        });
    };
    MobileAppSystemP2l = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            AlertService,
            UtilService])
    ], MobileAppSystemP2l);
    return MobileAppSystemP2l;
}());
export { MobileAppSystemP2l };
//# sourceMappingURL=mobile.app.system.p2l.js.map