// Global state (used for theming)

import { Keyboard } from '@ionic-native/keyboard';

// Providers
import { User } from '../providers/user';
import { Api } from '../providers/api';
import { AppData } from '../providers/app';
import {MobileAppSystem} from '../providers/mobile.app.system'
import {MobileAppSystemP2l} from '../providers/mobile.app.system.p2l'
import {MobileAppSystem1Line} from '../providers/mobile.app.system.1line'
import {MobileAppSystemBinInfo} from '../providers/mobile.app.system.bin'
import {MobileAppSystemPutAway} from '../providers/mobile.app.system.putaway'
import {MobileAppSystemMoveStock} from '../providers/mobile.app.system.movestock'
import {MobileAppSystemBarcodes} from '../providers/mobile.app.system.barcodes'
import {MobileAppSystemReplenish} from '../providers/mobile.app.system.replenish'


import {AlertService} from '../providers/alert.service'
import {UtilService} from '../providers/util.service'
import {ModalService} from '../providers/modal.service'


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

export const MODULES = [
  BrowserModule,
  HttpModule,
];

export const PIPES = [

];

export const PROVIDERS = [
  Keyboard,
  User,
  Api,
  AppData,
  StatusBar,
  SplashScreen,
  ScreenOrientation,
  MobileAppSystem,
  MobileAppSystemP2l,
  MobileAppSystem1Line,
  MobileAppSystemBinInfo,
  MobileAppSystemPutAway,
  MobileAppSystemMoveStock,
  MobileAppSystemBarcodes,
  MobileAppSystemReplenish,
  AlertService,
  UtilService,
  ModalService
];

export const COMPONENTS = [
  CustomKeyBoard
];

export const DIRECTIVES = [
];
