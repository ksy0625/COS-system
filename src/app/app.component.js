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
import { Platform, Nav, Config, MenuController, Events } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../providers/user';
import { AlertService } from '../providers/alert.service';
import { CustomKeyBoard } from '../components/customKeyBoard/custom-keyboard';
import { MobileAppSystem } from '../providers/mobile.app.system';
var MyApp = /** @class */ (function () {
    function MyApp(events, translate, platform, config, keyboard, menu, statusBar, splashScreen, alertService, user, mobileAppSystem) {
        this.events = events;
        this.translate = translate;
        this.platform = platform;
        this.config = config;
        this.keyboard = keyboard;
        this.menu = menu;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.alertService = alertService;
        this.user = user;
        this.mobileAppSystem = mobileAppSystem;
        this.rootPage = 'LoginPage';
        this.menuPages = [];
        this.homePages = [
            { title: 'Home', component: 'HomeScreenPage', active: true },
            { title: 'About', component: 'AboutPage', active: false },
            { title: 'Logout', component: 'LoginPage', active: false, logsOut: true }
        ];
        this.ConveyPages = [
            { title: 'Home', component: 'HomeScreenPage', active: true },
            { title: 'Scan Order Barcode', component: 'ScanOrderPage', active: true },
            { title: 'Scan Product Barcode', component: 'ScanProductPage', active: true },
            { title: 'Place in Tote', component: 'PlaceInTotePage', active: true },
            { title: 'Order Pick Status', component: 'OrderStatusPage', active: true },
            { title: 'About', component: 'AboutPage', active: false },
            { title: 'Logout', component: 'LoginPage', active: false, logsOut: true }
        ];
        this.P2LPages = [
            { title: 'Home', component: 'HomeScreenPage', active: true },
            { title: 'Begin P2L Job', component: 'P2lBeginJobPage', active: true },
            { title: 'Scan Product', component: 'P2lScanProductPage', active: true },
            { title: 'My Jobs in Progress', component: 'P2lJobInProgressPage', active: true },
            { title: 'About', component: 'AboutPage', active: false },
            { title: 'Logout', component: 'LoginPage', active: false, logsOut: true }
        ];
        this.menuPages = this.homePages;
        this.initTranslate();
        this.listenToEvents();
        // Keyboard key tab (used in the app.html template)
        this.keysTab = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
            "A", "B", "C", "D", "E", "F", "", "", "", "GO"];
        this.keyboard.disableScroll(true);
    }
    MyApp.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.initTranslate = function () {
        var _this = this;
        // Set the default language for translation strings, and the current language.
        this.translate.setDefaultLang('en');
        if (this.translate.getBrowserLang() !== undefined) {
            this.translate.use(this.translate.getBrowserLang());
        }
        else {
            this.translate.use('en'); // Set your language here
        }
        this.translate.get(['BACK_BUTTON_TEXT']).subscribe(function (values) {
            _this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });
    };
    MyApp.prototype.openPage = function (page) {
        var svc = this;
        if (this.user.workingRegion == 'convey') {
            if (page.component == 'ScanOrderPage') {
                this.mobileAppSystem.checkInToteStatus(this.user.orderInfo.orderBarcode, this.user.orderInfo.zone, function (res) {
                    if (res == null || res.result == null)
                        return;
                    if (res.result.itemsNotInToteExist == 'Y') {
                        svc.alertService.doConfirm('Error', res.result.statusMsg, 'OK', 'Cancel').then(function (yes) {
                            if (yes)
                                svc.nav.setRoot('PlaceInTotePage');
                        });
                    }
                    else {
                        svc.nav.setRoot('ScanOrderPage');
                    }
                });
            }
            else
                this.nav.setRoot(page.component);
        }
        else if (this.user.workingRegion == 'p2ljob') {
            this.nav.setRoot(page.component);
        }
        else
            this.nav.setRoot(page.component);
        if (page.logsOut === true) {
            this.events.publish('user:logout');
        }
    };
    MyApp.prototype.enableMenu = function () {
        if (this.user.workingRegion == '')
            this.menuPages = this.homePages;
        else if (this.user.workingRegion == 'convey')
            this.menuPages = this.ConveyPages;
        else if (this.user.workingRegion == 'p2ljob')
            this.menuPages = this.P2LPages;
    };
    MyApp.prototype.listenToEvents = function () {
        var _this = this;
        this.events.subscribe('home:entered', function () {
            _this.user.workingRegion = '';
            _this.enableMenu();
        });
        this.events.subscribe('convey:startscan', function () {
            _this.user.workingRegion = 'convey';
            _this.enableMenu();
        });
        this.events.subscribe('p2ljob:start', function () {
            _this.user.workingRegion = 'p2ljob';
            _this.enableMenu();
        });
        this.events.subscribe('user:logout', function () {
            _this.user.workingRegion = '';
        });
    };
    MyApp.prototype.ngOnInit = function () {
        console.log("=============");
        CustomKeyBoard.hide();
    };
    // Event emitter
    MyApp.prototype.keyClick = function (k) {
        //console.log('Event emitter - key: ', k);
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Events,
            TranslateService,
            Platform,
            Config,
            Keyboard,
            MenuController,
            StatusBar,
            SplashScreen,
            AlertService,
            User,
            MobileAppSystem])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map