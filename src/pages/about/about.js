var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AppData } from '../../providers/app';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var AboutPage = /** @class */ (function () {
    function AboutPage(appData, navCtrl, navParams) {
        this.appData = appData;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        appData.load();
    }
    AboutPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad AboutPage');
        this.appData.getAppAboutData().subscribe(function (data) {
            _this.aboutData = data;
        });
    };
    AboutPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-about',
            templateUrl: 'about.html',
        }),
        __metadata("design:paramtypes", [AppData,
            NavController,
            NavParams])
    ], AboutPage);
    return AboutPage;
}());
export { AboutPage };
//# sourceMappingURL=about.js.map