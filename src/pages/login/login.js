var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { AppData } from '../../providers/app';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { MobileAppSystem } from '../../providers/mobile.app.system';
import { User } from '../../providers/user';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, menu, mobileAppSystem, appData, user) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.menu = menu;
        this.mobileAppSystem = mobileAppSystem;
        this.appData = appData;
        this.user = user;
        this.username = 'testuser';
        this.password = 'testpass123';
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.appData.getAppAboutData().subscribe(function (data) {
            _this.aboutData = data;
        });
        console.log('ionViewDidLoad LoginPage');
    };
    LoginPage.prototype.ionViewDidEnter = function () {
        this.menu.swipeEnable(false);
    };
    LoginPage.prototype.doLogin = function () {
        var svc = this;
        this.mobileAppSystem.loginOPsApp(this.username, this.password, function (res) {
            svc.user.sessionInfo = res.result.loginResult;
            svc.navCtrl.setRoot('HomeScreenPage', {}, { animate: true, direction: 'forward' });
        }, true);
    };
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            MenuController,
            MobileAppSystem,
            AppData,
            User])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map