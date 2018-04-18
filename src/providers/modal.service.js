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
import { ModalController } from 'ionic-angular';
var ModalService = /** @class */ (function () {
    function ModalService(modalCtrl) {
        this.modalCtrl = modalCtrl;
    }
    ModalService.prototype.doAlert = function (title, message, okTxt, color, icon) {
        var data = { title: title, message: message, okTxt: okTxt, color: color, icon: icon };
        this.openModal('AlertModalPage', data);
    };
    ModalService.prototype.doConfirm = function (title, message, okTxt, cancelTxt, icon) {
        var svc = this;
        return new Promise(function (resolve, reject) {
            var data = { title: title, message: message, okTxt: okTxt, cancelTxt: cancelTxt, resolve: resolve, icon: icon };
            var confirm = svc.modalCtrl.create('ConfirmModalPage', data, { cssClass: 'inset-modal' });
            return confirm.present();
        });
    };
    ModalService.prototype.showConfirmModal = function (page, cls, data) {
        var svc = this;
        return new Promise(function (resolve, reject) {
            data.resolve = resolve;
            var confirm = svc.modalCtrl.create(page, data, { cssClass: cls });
            return confirm.present();
        });
    };
    ModalService.prototype.doPrompt = function (title, message, okTxt, cancelTxt, icon, placeholder) {
        var svc = this;
        return new Promise(function (resolve, reject) {
            var data = { title: title, message: message, okTxt: okTxt, cancelTxt: cancelTxt, resolve: resolve, icon: icon, placeholder: placeholder };
            var confirm = svc.modalCtrl.create('PromptModalPage', data, { cssClass: 'inset-modal_prompt_noraml' });
            return confirm.present();
        });
    };
    ModalService.prototype.doPromptRightSide = function (title, message, okTxt, cancelTxt, icon, placeholder) {
        var svc = this;
        return new Promise(function (resolve, reject) {
            var data = { title: title, message: message, okTxt: okTxt, cancelTxt: cancelTxt, resolve: resolve, icon: icon, placeholder: placeholder };
            var confirm = svc.modalCtrl.create('PromptModalPage', data, { cssClass: 'inset-modal_prompt_right_side' });
            return confirm.present();
        });
    };
    ModalService.prototype.openModal = function (pageName, data) {
        this.modalCtrl.create(pageName, data, { cssClass: 'inset-modal' })
            .present();
    };
    ModalService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [ModalController])
    ], ModalService);
    return ModalService;
}());
export { ModalService };
//# sourceMappingURL=modal.service.js.map