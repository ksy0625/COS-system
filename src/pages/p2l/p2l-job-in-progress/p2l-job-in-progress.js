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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { MobileAppSystemP2l } from '../../../providers/mobile.app.system.p2l';
import { User } from '../../../providers/user';
import { ModalService } from '../../../providers/modal.service';
import { AlertService } from '../../../providers/alert.service';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the PlacInTotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var P2lJobStatus = /** @class */ (function () {
    function P2lJobStatus() {
    }
    return P2lJobStatus;
}());
export { P2lJobStatus };
var P2lJobInProgressPage = /** @class */ (function () {
    function P2lJobInProgressPage(navCtrl, navParams, mobileAppSystem, keyboard, modalService, alertService, translateService, user) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.mobileAppSystem = mobileAppSystem;
        this.keyboard = keyboard;
        this.modalService = modalService;
        this.alertService = alertService;
        this.translateService = translateService;
        this.user = user;
        this.productList = [];
        this.selectedJobID = 0;
        this.title = "";
        var svc = this;
        translateService.get('P2L_JOB_IN_PROGRESS_TITLE').subscribe(function (value) {
            svc.title = value + " - Job ID: " + svc.user.p2linfo.jobID;
        });
    }
    P2lJobInProgressPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad P2L Outstanding Jobs page');
        this.onRefreshJobList();
    };
    P2lJobInProgressPage.prototype.onRefreshJobList = function () {
        var svc = this;
        this.mobileAppSystem.p2l_getJobPickStatus(this.user.sessionInfo.userWarehouse, this.user.p2linfo.jobID, function (res) {
            if (res == null || res.result == null)
                return;
            svc.selectedJobID = res.result.jobID;
            svc.productList = res.result.jobDetails;
        });
    };
    P2lJobInProgressPage.prototype.openPage = function () {
        this.navCtrl.setRoot('P2lScan1stlabelPage');
    };
    P2lJobInProgressPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-p2l-job-in-progress',
            templateUrl: 'p2l-job-in-progress.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams,
            MobileAppSystemP2l,
            Keyboard,
            ModalService,
            AlertService,
            TranslateService,
            User])
    ], P2lJobInProgressPage);
    return P2lJobInProgressPage;
}());
export { P2lJobInProgressPage };
//# sourceMappingURL=p2l-job-in-progress.js.map