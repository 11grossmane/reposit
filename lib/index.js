#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var figlet_1 = __importDefault(require("figlet"));
var chalk_1 = __importDefault(require("chalk"));
var commander_1 = __importDefault(require("commander"));
var types_1 = require("./types");
var util_1 = require("./util");
var questions_1 = require("./questions");
console.log(chalk_1.default.blue(figlet_1.default.textSync('Reposit\n')));
commander_1.default
    .version('1.0.0')
    .description('create a remote repo!')
    .option('-g, --github', 'set remote to github')
    .option('-b, --bitbucket', 'set remote to bitbucket')
    .option('-r, --reset', 'remove login credentials from cache')
    .parse(process.argv);
exports.cli = function (internalArgs) { return __awaiter(void 0, void 0, void 0, function () {
    var provider, reset, credentials, loginAnswers, e_1, repoName, res, e_2, e_3;
    var _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (internalArgs) {
                    provider = internalArgs.provider;
                    reset = internalArgs.reset;
                }
                else {
                    reset = commander_1.default.reset;
                    if (commander_1.default.github && !commander_1.default.bitbucket) {
                        provider = types_1.Provider.GITHUB;
                    }
                    else if (commander_1.default.bitbucket && !commander_1.default.github) {
                        provider = types_1.Provider.BITBUCKET;
                    }
                    else {
                        console.log(chalk_1.default.yellow('please use either the -g flag for github, OR the -b flag for bitbucket.  Use -h flag for more options.'));
                        return [2 /*return*/];
                    }
                }
                console.log("your remote provider is set to: " + provider + "\n");
                credentials = util_1.checkCache();
                if (!!util_1.hasCredentials(credentials, provider, reset)) return [3 /*break*/, 10];
                return [4 /*yield*/, questions_1.loginQuestions(provider)];
            case 1:
                loginAnswers = _c.sent();
                credentials = (_a = {},
                    _a[provider] = {
                        username: loginAnswers.username,
                        password: loginAnswers.password
                    },
                    _a);
                _c.label = 2;
            case 2:
                _c.trys.push([2, 8, , 9]);
                if (!(provider === types_1.Provider.BITBUCKET && credentials.Bitbucket)) return [3 /*break*/, 4];
                return [4 /*yield*/, util_1.validateCredentials(credentials.Bitbucket, provider)];
            case 3:
                _c.sent();
                return [3 /*break*/, 7];
            case 4:
                if (!(provider === types_1.Provider.GITHUB && credentials.Github)) return [3 /*break*/, 6];
                return [4 /*yield*/, util_1.validateCredentials(credentials.Github, provider)];
            case 5:
                _c.sent();
                return [3 /*break*/, 7];
            case 6:
                util_1.throwUnknownError(provider, credentials);
                _c.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                e_1 = _c.sent();
                util_1.handleError(e_1, provider);
                return [2 /*return*/];
            case 9:
                util_1.writeToCache(credentials);
                _c.label = 10;
            case 10:
                //otherwise, only ask for repo name
                console.log(chalk_1.default.yellow("You are logged in with the username: " + chalk_1.default.green("" + (credentials && ((_b = credentials[provider]) === null || _b === void 0 ? void 0 : _b.username))) + ".  \nIf you would like to change your login credentials, please run again with the -r flag.\n"));
                return [4 /*yield*/, questions_1.repoNameQuestion(provider)
                    //Typecasting to make sure credentials is not null
                ];
            case 11:
                repoName = (_c.sent()).repoName;
                //Typecasting to make sure credentials is not null
                credentials = credentials;
                res = { repoName: '', links: [], statusCode: 0 };
                if (!(provider == types_1.Provider.BITBUCKET && credentials.Bitbucket)) return [3 /*break*/, 16];
                _c.label = 12;
            case 12:
                _c.trys.push([12, 14, , 15]);
                return [4 /*yield*/, util_1.bitbucketCreate(credentials.Bitbucket, repoName)];
            case 13:
                res = _c.sent();
                return [3 /*break*/, 15];
            case 14:
                e_2 = _c.sent();
                util_1.handleError(e_2, provider, repoName);
                return [2 /*return*/];
            case 15: return [3 /*break*/, 20];
            case 16:
                if (!(provider == types_1.Provider.GITHUB && credentials.Github)) return [3 /*break*/, 20];
                _c.label = 17;
            case 17:
                _c.trys.push([17, 19, , 20]);
                return [4 /*yield*/, util_1.githubCreate(credentials.Github, repoName)];
            case 18:
                res = _c.sent();
                return [3 /*break*/, 20];
            case 19:
                e_3 = _c.sent();
                util_1.handleError(e_3, provider, repoName);
                return [2 /*return*/];
            case 20:
                //Success!
                console.log(chalk_1.default.green("\nRepo successfully created!\nRepo Name: " + res.repoName + "\n"));
                console.log("Set your remote repo with https: \n" + chalk_1.default.bold("git remote add origin " + res.links[0]) + " \nOr ssh:\n" + chalk_1.default.bold("git remote add origin " + res.links[1]));
                return [2 /*return*/];
        }
    });
}); };
exports.cli();
