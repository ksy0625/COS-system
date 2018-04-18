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
import { LoadingController } from 'ionic-angular';
var UtilService = /** @class */ (function () {
    function UtilService(loadingCtrl) {
        this.loadingCtrl = loadingCtrl;
        this.loading = null;
    }
    UtilService.prototype.presentLoading = function () {
        if (this.loading != null) {
            this.hideLoading();
        }
        this.loading = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 6000
        });
        this.loading.present();
    };
    UtilService.prototype.hideLoading = function () {
        if (this.loading != null) {
            this.loading.dismiss();
            this.loading = null;
        }
    };
    UtilService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LoadingController])
    ], UtilService);
    return UtilService;
}());
export { UtilService };
//# sourceMappingURL=util.service.js.map