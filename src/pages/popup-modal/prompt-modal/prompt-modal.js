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
import { NavParams, ViewController, IonicPage } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
var PromptModalPage = /** @class */ (function () {
    function PromptModalPage(viewCtrl, platform, keyboard, params) {
        this.viewCtrl = viewCtrl;
        this.platform = platform;
        this.keyboard = keyboard;
        this.bShowKb = false;
        this.m_main_column_nb = 9;
        this.keysTab = [];
        this.dismissed = false;
        this.promptVal = '';
        this.resolve = params.data.resolve;
        this.title = params.data.title;
        this.message = params.data.message;
        this.okTxt = params.data.okTxt;
        this.cancelTxt = params.data.cancelTxt;
        this.placeholder = params.data.placeholder;
        if (params.data.icon == null)
            this.icon = 'bulb';
        else
            this.icon = params.data.icon;
        this.keysTab = ["1", "2", "3", "4", "5", "6", "7", "8", "9",
            "0", "A", "B", "C", "D", "E", "F", ".", "<Back"];
        this.m_main_rows = this.range(0, (this.keysTab.length - 1), this.m_main_column_nb);
        this.m_main_cols = this.range(0, this.m_main_column_nb - 1, 1);
        this.timerTick();
    }
    PromptModalPage.prototype.range = function (min, max, step) {
        step = step || 1;
        var tab = [];
        for (var i = min; i <= max; i += step) {
            tab.push(i);
        }
        return tab;
    };
    PromptModalPage.prototype.onChangedVal = function (val) {
        if (val == '')
            return;
        this.promptVal = val;
        this.onOK();
    };
    PromptModalPage.prototype.onOK = function () {
        var svc = this;
        this.dismissed = true;
        this.viewCtrl.dismiss().then(function () { return svc.resolve(svc.promptVal); });
    };
    PromptModalPage.prototype.onCancel = function () {
        var svc = this;
        this.dismissed = true;
        this.viewCtrl.dismiss().then(function () { return svc.resolve(''); });
    };
    PromptModalPage.prototype.dismiss = function () {
        this.dismissed = true;
        this.viewCtrl.dismiss();
    };
    PromptModalPage.prototype.timerTick = function () {
        var _this = this;
        var svc = this;
        setTimeout(function () {
            if (svc.platform.is('cordova'))
                _this.keyboard.close();
            if (_this.bShowKb == false) {
                if (_this.promptInput._isFocus == false) {
                    //this.promptInput._readonly = true;
                    _this.promptInput.setFocus();
                    //setTimeout(() =>{
                    //  svc.promptInput._readonly = false;
                    //}, 40);            
                }
            }
            if (_this.dismissed == false)
                _this.timerTick();
        }, 100); //a least 150ms.
    };
    PromptModalPage.prototype.onShowKeyPad = function () {
        this.bShowKb = !this.bShowKb;
    };
    PromptModalPage.prototype.cKClick = function (event, key) {
        if (key != "<Back")
            this.promptVal += key;
        else
            this.promptVal = this.promptVal.slice(0, this.promptVal.length - 1);
    };
    __decorate([
        ViewChild('promptInputBox'),
        __metadata("design:type", Object)
    ], PromptModalPage.prototype, "promptInput", void 0);
    PromptModalPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-prompt-modal',
            templateUrl: 'prompt-modal.html'
        }),
        __metadata("design:paramtypes", [ViewController,
            Platform,
            Keyboard,
            NavParams])
    ], PromptModalPage);
    return PromptModalPage;
}());
export { PromptModalPage };
//# sourceMappingURL=prompt-modal.js.map