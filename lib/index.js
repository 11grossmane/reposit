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
var util_2 = require("./util");
console.log(chalk_1.default.blue(figlet_1.default.textSync('Reposit\n')));
commander_1.default
    .version('1.0.0')
    .description('create a remote repo!')
    .option('-g, --github', 'set remote to github')
    .option('-b, --bitbucket', 'set remote to bitbucket')
    .option('-r, --reset', 'remove login credentials from cache')
    .option('-d,--delete', 'delete named repo')
    .parse(process.argv);
exports.cli = function (internalArgs) { return __awaiter(void 0, void 0, void 0, function () {
    var provider, reset, _a, credentials, loginAnswers, e_1, storeAnswer, _b, repoName, _c, answers, response, e_2, response, e_3, res, e_4, e_5;
    var _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
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
                //if reset is true wipe credentials
                _a = reset;
                if (!_a) 
                //if reset is true wipe credentials
                return [3 /*break*/, 2];
                return [4 /*yield*/, util_2.clearCache()];
            case 1:
                _a = (_f.sent());
                _f.label = 2;
            case 2:
                //if reset is true wipe credentials
                _a;
                console.log("your remote provider is set to: " + provider + "\n");
                return [4 /*yield*/, util_1.checkCache()
                    //If user does not have cached credentials, or he has used -r flag, ask for credential and then cache them
                ];
            case 3:
                credentials = _f.sent();
                if (!!util_1.hasCredentials(credentials, provider, reset)) return [3 /*break*/, 16];
                return [4 /*yield*/, questions_1.loginQuestions(provider)];
            case 4:
                loginAnswers = _f.sent();
                credentials = (_d = {},
                    _d[provider] = {
                        username: loginAnswers.username,
                        password: loginAnswers.password
                    },
                    _d);
                _f.label = 5;
            case 5:
                _f.trys.push([5, 11, , 12]);
                if (!(provider === types_1.Provider.BITBUCKET && credentials.Bitbucket)) return [3 /*break*/, 7];
                return [4 /*yield*/, util_1.validateCredentials(credentials.Bitbucket, provider)];
            case 6:
                _f.sent();
                return [3 /*break*/, 10];
            case 7:
                if (!(provider === types_1.Provider.GITHUB && credentials.Github)) return [3 /*break*/, 9];
                return [4 /*yield*/, util_1.validateCredentials(credentials.Github, provider)];
            case 8:
                _f.sent();
                return [3 /*break*/, 10];
            case 9:
                util_1.throwUnknownError(provider, credentials);
                _f.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                e_1 = _f.sent();
                util_1.handleError(e_1, provider);
                return [2 /*return*/];
            case 12: return [4 /*yield*/, questions_1.storeQuestion()];
            case 13:
                storeAnswer = _f.sent();
                _b = storeAnswer.storeLocally;
                if (!_b) return [3 /*break*/, 15];
                return [4 /*yield*/, util_1.writeToCache(credentials)];
            case 14:
                _b = (_f.sent());
                _f.label = 15;
            case 15:
                _b;
                _f.label = 16;
            case 16:
                //otherwise, only ask for repo name
                console.log(chalk_1.default.yellow("You are logged in with the username: " + chalk_1.default.green("" + (credentials && ((_e = credentials[provider]) === null || _e === void 0 ? void 0 : _e.username))) + ".  \nIf you would like to change your login credentials, please run again with the -r flag.\n"));
                //Typecasting to make sure credentials is not null
                credentials = credentials;
                if (!commander_1.default.delete) return [3 /*break*/, 18];
                return [4 /*yield*/, questions_1.repoNameQuestion(provider, 'delete')];
            case 17:
                _c = _f.sent();
                return [3 /*break*/, 20];
            case 18: return [4 /*yield*/, questions_1.repoNameQuestion(provider)
                //delete flow
            ];
            case 19:
                _c = _f.sent();
                _f.label = 20;
            case 20:
                repoName = (_c).repoName;
                if (!commander_1.default.delete) return [3 /*break*/, 32];
                return [4 /*yield*/, questions_1.deleteQuestions(provider, repoName)
                    //Provider is github
                ];
            case 21:
                answers = _f.sent();
                if (!(answers.delete && provider === types_1.Provider.GITHUB && (credentials === null || credentials === void 0 ? void 0 : credentials.Github))) return [3 /*break*/, 26];
                _f.label = 22;
            case 22:
                _f.trys.push([22, 24, , 25]);
                return [4 /*yield*/, util_1.githubDelete(credentials.Github, repoName)];
            case 23:
                response = _f.sent();
                console.log(chalk_1.default.green(response));
                return [2 /*return*/];
            case 24:
                e_2 = _f.sent();
                util_1.handleError(e_2, provider);
                return [2 /*return*/];
            case 25: return [3 /*break*/, 32];
            case 26:
                if (!(answers.delete && provider == types_1.Provider.BITBUCKET && (credentials === null || credentials === void 0 ? void 0 : credentials.Bitbucket))) return [3 /*break*/, 31];
                _f.label = 27;
            case 27:
                _f.trys.push([27, 29, , 30]);
                return [4 /*yield*/, util_1.bitbucketDelete(credentials.Bitbucket, repoName)];
            case 28:
                response = _f.sent();
                console.log(chalk_1.default.green(response));
                return [2 /*return*/];
            case 29:
                e_3 = _f.sent();
                util_1.handleError(e_3, provider);
                return [2 /*return*/];
            case 30: return [3 /*break*/, 32];
            case 31:
                if (answers.delete == false) {
                    return [2 /*return*/];
                }
                else {
                    try {
                        util_1.throwUnknownError(provider, credentials);
                    }
                    catch (e) {
                        util_1.handleError(e, provider);
                        return [2 /*return*/];
                    }
                }
                _f.label = 32;
            case 32:
                res = { repoName: '', links: [], statusCode: 0 };
                if (!(provider == types_1.Provider.BITBUCKET && credentials.Bitbucket)) return [3 /*break*/, 37];
                _f.label = 33;
            case 33:
                _f.trys.push([33, 35, , 36]);
                return [4 /*yield*/, util_1.bitbucketCreate(credentials.Bitbucket, repoName)];
            case 34:
                res = _f.sent();
                return [3 /*break*/, 36];
            case 35:
                e_4 = _f.sent();
                util_1.handleError(e_4, provider, repoName);
                return [2 /*return*/];
            case 36: return [3 /*break*/, 41];
            case 37:
                if (!(provider == types_1.Provider.GITHUB && credentials.Github)) return [3 /*break*/, 41];
                _f.label = 38;
            case 38:
                _f.trys.push([38, 40, , 41]);
                return [4 /*yield*/, util_1.githubCreate(credentials.Github, repoName)];
            case 39:
                res = _f.sent();
                return [3 /*break*/, 41];
            case 40:
                e_5 = _f.sent();
                util_1.handleError(e_5, provider, repoName);
                return [2 /*return*/];
            case 41:
                //Success!
                console.log(chalk_1.default.green("\nRepo successfully created!\nRepo Name: " + res.repoName + "\n"));
                console.log("Set your remote repo with https: \n" + chalk_1.default.bold("git remote add origin " + res.links[0]) + " \nOr ssh:\n" + chalk_1.default.bold("git remote add origin " + res.links[1]));
                return [2 /*return*/];
        }
    });
}); };
exports.cli();
