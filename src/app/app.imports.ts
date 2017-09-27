// Global state (used for theming)
import { AppState } from './app.global';

// Providers
import { User } from '../providers/user';
import { Api } from '../providers/api';
import { AppData } from '../providers/app';
import {MobileAppSystem} from '../providers/mobile.app.system'
import {AlertService} from '../providers/alert.service'
import {UtilService} from '../providers/util.service'
import {ModalService} from '../providers/modal.service'


// Ionic native providers
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

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
  User,
  Api,
  AppData,
  StatusBar,
  SplashScreen,
  ScreenOrientation,
  MobileAppSystem,
  AlertService,
  UtilService,
  ModalService
];

export const COMPONENTS = [
  
];

export const DIRECTIVES = [
  
];
