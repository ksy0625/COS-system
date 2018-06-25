// Global state (used for theming)
import { Keyboard } from '@ionic-native/keyboard';
// Providers
import { User } from '../providers/user';
import { Api } from '../providers/api';
import { AppData } from '../providers/app';
import { MobileAppSystem } from '../providers/mobile.app.system';
import { MobileAppSystemP2l } from '../providers/mobile.app.system.p2l';
import { AlertService } from '../providers/alert.service';
import { UtilService } from '../providers/util.service';
import { ModalService } from '../providers/modal.service';
import { CacheService } from "ionic-cache";

// Ionic native providers
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { CustomKeyBoard } from '../components/customKeyBoard/custom-keyboard';

// Directives
// Components
// Pipes
// Modules
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
export var MODULES = [
    BrowserModule,
    HttpModule,
];
export var PIPES = [];
export var PROVIDERS = [
    Keyboard,
    User,
    Api,
    AppData,
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    MobileAppSystem,
    MobileAppSystemP2l,
    AlertService,
    UtilService,
    ModalService
];
export var COMPONENTS = [
    CustomKeyBoard
];
export var DIRECTIVES = [];
//# sourceMappingURL=app.imports.js.map