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
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
var SessionInfo = /** @class */ (function () {
    function SessionInfo() {
    }
    return SessionInfo;
}());
export { SessionInfo };
var OrderModel = /** @class */ (function () {
    function OrderModel() {
    }
    OrderModel.prototype.clear = function () {
        this.orderBarcode = '';
        this.warehouse = '';
        this.zone = '';
        this.binLocations = [];
        this.countProductScaned = 0;
        this.countTotalProducts = 0;
        this.toteNumber = '';
    };
    OrderModel.prototype.isCompleted = function () {
        if (this.countProductScaned == this.countTotalProducts)
            return true;
        return false;
    };
    return OrderModel;
}());
export { OrderModel };
var P2LModel = /** @class */ (function () {
    function P2LModel() {
        this.jobID = 0;
        this.p2lBarcode = '';
        this.bFirstProduct = true;
    }
    P2LModel.prototype.clear = function () {
        this.warehouse = '';
        this.toteNumber = '';
        this.bFirstProduct = true;
    };
    return P2LModel;
}());
export { P2LModel };
var User = /** @class */ (function () {
    function User(http, api) {
        this.http = http;
        this.api = api;
        this.workingRegion = '';
        //for convey region
        this.hasTotes = '';
        this.sessionInfo = new SessionInfo();
        this.orderInfo = new OrderModel();
        this.p2linfo = new P2LModel();
        this.allowableProductsNotInTote = 0;
    }
    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    User.prototype.login = function (accountInfo) {
        var _this = this;
        var seq = this.api.post('login', accountInfo).share();
        seq
            .map(function (res) { return res.json(); })
            .subscribe(function (res) {
            // If the API returned a successful response, mark the user as logged in
            if (res.status == 'success') {
                _this._loggedIn(res);
            }
            else {
            }
        }, function (err) {
            console.error('ERROR', err);
        });
        return seq;
    };
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    User.prototype.signup = function (accountInfo) {
        var _this = this;
        var seq = this.api.post('signup', accountInfo).share();
        seq
            .map(function (res) { return res.json(); })
            .subscribe(function (res) {
            // If the API returned a successful response, mark the user as logged in
            if (res.status == 'success') {
                _this._loggedIn(res);
            }
        }, function (err) {
            console.error('ERROR', err);
        });
        return seq;
    };
    /**
     * Log the user out, which forgets the session
     */
    User.prototype.logout = function () {
        this._user = null;
    };
    /**
     * Process a login/signup response to store user data
     */
    User.prototype._loggedIn = function (resp) {
        this._user = resp.user;
    };
    User = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, Api])
    ], User);
    return User;
}());
export { User };
//# sourceMappingURL=user.js.map