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
import { AlertController } from 'ionic-angular';
var AlertService = /** @class */ (function () {
    function AlertService(alertCtrl) {
        this.alertCtrl = alertCtrl;
    }
    AlertService.prototype.doAlert = function (title, message, btnTxt) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var confirm = _this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {
                        text: btnTxt,
                        handler: function () {
                            confirm.dismiss().then(function () { return resolve(true); });
                            return false;
                        }
                    }
                ]
            });
            return confirm.present();
        });
    };
    AlertService.prototype.doAlertWithtimeOut = function (title, message, timeout) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var confirm = _this.alertCtrl.create({
                title: title,
                message: message
            });
            if (timeout > 0) {
                setTimeout(function () {
                    confirm.dismiss().then(function () { return resolve(true); });
                }, timeout);
            }
            return confirm.present();
        });
    };
    AlertService.prototype.doConfirm = function (title, message, okTxt, cancelTxt) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var confirm = _this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [{
                        text: cancelTxt,
                        role: 'cancel',
                        handler: function () {
                            confirm.dismiss().then(function () { return resolve(false); });
                            return false;
                        }
                    }, {
                        text: okTxt,
                        handler: function () {
                            confirm.dismiss().then(function () { return resolve(true); });
                            return false;
                        }
                    }]
            });
            return confirm.present();
        });
    };
    AlertService.prototype.doPrompt = function (title, message, okTxt, cancelTxt, placeHold) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var confirm = _this.alertCtrl.create({
                title: title,
                message: message,
                inputs: [
                    {
                        name: 'promptValue',
                        placeholder: placeHold,
                    },
                ],
                buttons: [{
                        text: cancelTxt,
                        role: 'cancel',
                        handler: function (data) {
                            confirm.dismiss().then(function () { return resolve(''); });
                            return false;
                        }
                    }, {
                        text: okTxt,
                        handler: function (data) {
                            confirm.dismiss().then(function () { return resolve(data.promptValue); });
                            return false;
                        }
                    }]
            });
            return confirm.present();
        });
    };
    AlertService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AlertController])
    ], AlertService);
    return AlertService;
}());
export { AlertService };
//# sourceMappingURL=alert.service.js.map