// Global state (used for theming)
import { AppState } from './app.global';

// Providers
import { User } from '../providers/user';
import { Api } from '../providers/api';
import { AppData } from '../providers/app';
import {LoginService} from '../providers/login/login'
import {CoreService} from '../providers/core/core'
import {AlertService} from '../providers/util/alert.service'
import { ServiceApi } from '../providers/api/api'


// Ionic native providers
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
  CoreService,
  LoginService,
  ServiceApi,
  AlertService,
];

export const COMPONENTS = [
  
];

export const DIRECTIVES = [
  
];
