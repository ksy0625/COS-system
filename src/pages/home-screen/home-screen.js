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
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { User } from '../../providers/user';
import { MobileAppSystem } from '../../providers/mobile.app.system';
import { MobileAppSystemP2l } from '../../providers/mobile.app.system.p2l';
/**
 * Generated class for the HomeScreenPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var HomeScreenPage = /** @class */ (function () {
    //  @ViewChild('input1') input1 ;
    function HomeScreenPage(navCtrl, navParams, events, menu, mobileAppSystem, mobileAppSystemP2L, user) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.events = events;
        this.menu = menu;
        this.mobileAppSystem = mobileAppSystem;
        this.mobileAppSystemP2L = mobileAppSystemP2L;
        this.user = user;
    }
    HomeScreenPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad HomeScreenPage');
        this.mobileAppSystemP2L.setSessionId(this.user.sessionInfo.sessionId);
        this.mobileAppSystemP2L.setBaseUrl(this.mobileAppSystem.getBaseUrl());
        //for test . init.    
        //this.mobileAppSystemP2L.deAllocateJob(this.user.sessionInfo.userWarehouse, 151398503);
        //    console.log(this.input1);
        this.events.publish('home:entered');
    };
    HomeScreenPage.prototype.ionViewDidEnter = function () {
        this.menu.swipeEnable(true);
    };
    HomeScreenPage.prototype.openConvey = function () {
        this.navCtrl.push('ScanOrderPage');
    };
    HomeScreenPage.prototype.openP2Job = function () {
        this.events.publish('p2ljob:start');
        this.navCtrl.push('P2lBeginJobPage');
    };
    HomeScreenPage.prototype.openPage = function () {
    };
    HomeScreenPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-home-screen',
            templateUrl: 'home-screen.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Events,
            MenuController,
            MobileAppSystem,
            MobileAppSystemP2l,
            User])
    ], HomeScreenPage);
    return HomeScreenPage;
}());
export { HomeScreenPage };
//# sourceMappingURL=home-screen.js.map