var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, Input, Output, EventEmitter, Renderer, HostBinding } from '@angular/core';
import { Subject } from 'rxjs/Rx';
var CustomKeyBoard = /** @class */ (function () {
    function CustomKeyBoard(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.contentString = '';
        this.colNb = 10;
        this.visible = true;
        // Outputs
        this.cKClickEmit = new EventEmitter();
        this.deleteEmit = new EventEmitter();
        this.zoom = 1;
        this.rowNb = 1;
        CustomKeyBoard_1.m_component = this;
    }
    CustomKeyBoard_1 = CustomKeyBoard;
    CustomKeyBoard.prototype.ngOnInit = function () {
        // Init with the @input values
        if (this.colNb)
            this.m_main_column_nb = this.colNb;
        if (this.keysTab) {
            this.m_main_rows = this.range(0, (this.keysTab.length - 1), this.m_main_column_nb);
            this.m_main_cols = this.range(0, this.m_main_column_nb - 1, 1);
            this.rowNb = Math.floor((this.keysTab.length / this.m_main_column_nb + 1));
        }
        this.resize();
    };
    Object.defineProperty(CustomKeyBoard, "onCKClick", {
        get: function () {
            return this.m_clickObs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomKeyBoard, "onDeleteClick", {
        get: function () {
            return this.m_deleteObs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomKeyBoard, "onCKShow", {
        get: function () {
            return this.m_showObs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomKeyBoard, "onCKHide", {
        get: function () {
            return this.m_hideObs;
        },
        enumerable: true,
        configurable: true
    });
    CustomKeyBoard.prototype.cKClick = function (event, key) {
        CustomKeyBoard_1.onCKClick.next(key);
        this.cKClickEmit.emit(key);
        if (CustomKeyBoard_1.m_targetInput != null) {
            if (key != "GO") {
                CustomKeyBoard_1.m_targetInput.value += key;
                this.contentString = CustomKeyBoard_1.m_targetInput.value;
            }
            else if (CustomKeyBoard_1.m_targetCallback != null) {
                CustomKeyBoard_1.m_targetCallback(CustomKeyBoard_1.m_targetInput.value);
                CustomKeyBoard_1.hide();
            }
        }
    };
    CustomKeyBoard.prototype.deleteClick = function (event) {
        CustomKeyBoard_1.onDeleteClick.next();
        this.deleteEmit.emit();
        if (CustomKeyBoard_1.m_targetInput != null) {
            var val = CustomKeyBoard_1.m_targetInput.value;
            if (val != null) {
                CustomKeyBoard_1.m_targetInput.value = val.slice(0, val.length - 1);
                this.contentString = CustomKeyBoard_1.m_targetInput.value;
            }
        }
    };
    CustomKeyBoard.prototype.onWindowResize = function (event) {
        this.resize();
    };
    CustomKeyBoard.setTarget = function (target, callBack) {
        if (callBack === void 0) { callBack = function () { }; }
        if (this.m_targetInput != null)
            this.m_targetInput._readonly = false;
        CustomKeyBoard_1.m_component.contentString = target.value;
        this.m_targetOrgVal = target.value;
        this.m_targetInput = target;
        this.m_targetCallback = callBack;
        this.m_targetInput._readonly = true;
    };
    CustomKeyBoard.clearTarget = function () {
        CustomKeyBoard_1.m_component.contentString = '';
        if (this.m_targetInput != null) {
            this.m_targetInput._readonly = false;
            this.m_targetInput = null;
            this.m_targetCallback = null;
        }
    };
    CustomKeyBoard.show = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        if (this.m_component && !this.m_component.visible) {
            this.m_component.visible = true;
            setTimeout(function () {
                callback();
                CustomKeyBoard_1.onCKShow.next();
            }, 100);
        }
    };
    CustomKeyBoard.isVisible = function () {
        if (!this.m_component)
            return false;
        return this.m_component.visible;
    };
    CustomKeyBoard.hide = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        this.clearTarget();
        if (this.m_component && this.m_component.visible) {
            this.m_component.visible = false;
            if (callback) {
                setTimeout(function () {
                    callback();
                    CustomKeyBoard_1.onCKHide.next();
                }, 100);
            }
        }
    };
    CustomKeyBoard.prototype.hide = function () {
        var value = '';
        var bChanged = false;
        if (CustomKeyBoard_1.m_targetInput != null) {
            value = CustomKeyBoard_1.m_targetInput.value;
            if (CustomKeyBoard_1.m_targetOrgVal != value)
                bChanged = true;
        }
        // if(bChanged==true && CustomKeyBoard.m_targetCallback != null )
        //     CustomKeyBoard.m_targetCallback(value);
        CustomKeyBoard_1.hide(null);
    };
    CustomKeyBoard.destroy = function (callback) {
        if (callback === void 0) { callback = function (success) { }; }
        if (this.m_component) {
            this.m_component.el.nativeElement.remove();
            this.m_component = null;
            callback(true);
        }
        else
            callback(true);
    };
    CustomKeyBoard.prototype.resize = function () {
        // Compute the keyboard height (key height = 50px, toolbar height = 30px)
        var keyboardHeight = (50 * this.rowNb) + 30;
        var screenHeight = window.screen.height;
        // Make sure the keyboard is not bigger than 0.40 * screen size
        if (keyboardHeight > (screenHeight * 0.40))
            this.zoom = (screenHeight * 0.40) / keyboardHeight;
        else
            this.zoom = 1;
    };
    CustomKeyBoard.prototype.range = function (min, max, step) {
        step = step || 1;
        var tab = [];
        for (var i = min; i <= max; i += step) {
            tab.push(i);
        }
        return tab;
    };
    // Component reference
    CustomKeyBoard.m_component = null;
    CustomKeyBoard.m_targetInput = null;
    CustomKeyBoard.m_targetCallback = null;
    CustomKeyBoard.m_targetOrgVal = '';
    // Observables for subscribers to get the events
    CustomKeyBoard.m_clickObs = new Subject();
    CustomKeyBoard.m_deleteObs = new Subject();
    CustomKeyBoard.m_showObs = new Subject();
    CustomKeyBoard.m_hideObs = new Subject();
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], CustomKeyBoard.prototype, "keysTab", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CustomKeyBoard.prototype, "colNb", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CustomKeyBoard.prototype, "width", void 0);
    __decorate([
        HostBinding('class.visible'), Input(),
        __metadata("design:type", Boolean)
    ], CustomKeyBoard.prototype, "visible", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], CustomKeyBoard.prototype, "cKClickEmit", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], CustomKeyBoard.prototype, "deleteEmit", void 0);
    CustomKeyBoard = CustomKeyBoard_1 = __decorate([
        Component({
            selector: 'custom-keyboard',
            templateUrl: 'custom-keyboard.html'
        }),
        __metadata("design:paramtypes", [ElementRef, Renderer])
    ], CustomKeyBoard);
    return CustomKeyBoard;
    var CustomKeyBoard_1;
}());
export { CustomKeyBoard };
//# sourceMappingURL=custom-keyboard.js.map