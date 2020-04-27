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
    .option('-d,--delete', 'delete named repo')
    .parse(process.argv);
exports.cli = function (internalArgs) { return __awaiter(void 0, void 0, void 0, function () {
    var provider, reset, credentials, loginAnswers, e_1, repoName, _a, answers, response, e_2, response, e_3, res, e_4, e_5;
    var _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
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
                loginAnswers = _d.sent();
                credentials = (_b = {},
                    _b[provider] = {
                        username: loginAnswers.username,
                        password: loginAnswers.password
                    },
                    _b);
                _d.label = 2;
            case 2:
                _d.trys.push([2, 8, , 9]);
                if (!(provider === types_1.Provider.BITBUCKET && credentials.Bitbucket)) return [3 /*break*/, 4];
                return [4 /*yield*/, util_1.validateCredentials(credentials.Bitbucket, provider)];
            case 3:
                _d.sent();
                return [3 /*break*/, 7];
            case 4:
                if (!(provider === types_1.Provider.GITHUB && credentials.Github)) return [3 /*break*/, 6];
                return [4 /*yield*/, util_1.validateCredentials(credentials.Github, provider)];
            case 5:
                _d.sent();
                return [3 /*break*/, 7];
            case 6:
                util_1.throwUnknownError(provider, credentials);
                _d.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                e_1 = _d.sent();
                util_1.handleError(e_1, provider);
                return [2 /*return*/];
            case 9:
                util_1.writeToCache(credentials);
                _d.label = 10;
            case 10:
                //otherwise, only ask for repo name
                console.log(chalk_1.default.yellow("You are logged in with the username: " + chalk_1.default.green("" + (credentials && ((_c = credentials[provider]) === null || _c === void 0 ? void 0 : _c.username))) + ".  \nIf you would like to change your login credentials, please run again with the -r flag.\n"));
                //Typecasting to make sure credentials is not null
                credentials = credentials;
                if (!commander_1.default.delete) return [3 /*break*/, 12];
                return [4 /*yield*/, questions_1.repoNameQuestion(provider, 'delete')];
            case 11:
                _a = _d.sent();
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, questions_1.repoNameQuestion(provider)
                //delete flow
                //Provider is github
            ];
            case 13:
                _a = _d.sent();
                _d.label = 14;
            case 14:
                repoName = (_a).repoName;
                if (!commander_1.default.delete) return [3 /*break*/, 26];
                return [4 /*yield*/, questions_1.deleteQuestions(provider, repoName)];
            case 15:
                answers = _d.sent();
                if (!(answers.delete &&
                    provider === types_1.Provider.GITHUB && (credentials === null || credentials === void 0 ? void 0 : credentials.Github))) return [3 /*break*/, 20];
                _d.label = 16;
            case 16:
                _d.trys.push([16, 18, , 19]);
                return [4 /*yield*/, util_1.githubDelete(credentials.Github, repoName)];
            case 17:
                response = _d.sent();
                console.log(chalk_1.default.green(response));
                return [2 /*return*/];
            case 18:
                e_2 = _d.sent();
                util_1.handleError(e_2, provider);
                return [2 /*return*/];
            case 19: return [3 /*break*/, 26];
            case 20:
                if (!(answers.delete &&
                    provider == types_1.Provider.BITBUCKET && (credentials === null || credentials === void 0 ? void 0 : credentials.Bitbucket))) return [3 /*break*/, 25];
                _d.label = 21;
            case 21:
                _d.trys.push([21, 23, , 24]);
                return [4 /*yield*/, util_1.bitbucketDelete(credentials.Bitbucket, repoName)];
            case 22:
                response = _d.sent();
                console.log(chalk_1.default.green(response));
                return [2 /*return*/];
            case 23:
                e_3 = _d.sent();
                util_1.handleError(e_3, provider);
                return [2 /*return*/];
            case 24: return [3 /*break*/, 26];
            case 25:
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
                _d.label = 26;
            case 26:
                res = { repoName: '', links: [], statusCode: 0 };
                if (!(provider == types_1.Provider.BITBUCKET && credentials.Bitbucket)) return [3 /*break*/, 31];
                _d.label = 27;
            case 27:
                _d.trys.push([27, 29, , 30]);
                return [4 /*yield*/, util_1.bitbucketCreate(credentials.Bitbucket, repoName)];
            case 28:
                res = _d.sent();
                return [3 /*break*/, 30];
            case 29:
                e_4 = _d.sent();
                util_1.handleError(e_4, provider, repoName);
                return [2 /*return*/];
            case 30: return [3 /*break*/, 35];
            case 31:
                if (!(provider == types_1.Provider.GITHUB && credentials.Github)) return [3 /*break*/, 35];
                _d.label = 32;
            case 32:
                _d.trys.push([32, 34, , 35]);
                return [4 /*yield*/, util_1.githubCreate(credentials.Github, repoName)];
            case 33:
                res = _d.sent();
                return [3 /*break*/, 35];
            case 34:
                e_5 = _d.sent();
                util_1.handleError(e_5, provider, repoName);
                return [2 /*return*/];
            case 35:
                //Success!
                console.log(chalk_1.default.green("\nRepo successfully created!\nRepo Name: " + res.repoName + "\n"));
                console.log("Set your remote repo with https: \n" + chalk_1.default.bold("git remote add origin " + res.links[0]) + " \nOr ssh:\n" + chalk_1.default.bold("git remote add origin " + res.links[1]));
                return [2 /*return*/];
        }
    });
}); };
exports.cli();
