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
    .parse(process.argv);
var cli = function () { return __awaiter(void 0, void 0, void 0, function () {
    var provider, credentials, repoName, answers, answers, res, e_1, e_2;
    var _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (commander_1.default.github && !commander_1.default.bitbucket) {
                    provider = types_1.Provider.GITHUB;
                }
                else if (commander_1.default.bitbucket && !commander_1.default.github) {
                    provider = types_1.Provider.BITBUCKET;
                }
                else {
                    console.log(chalk_1.default.yellow('please use either the -g flag for github, OR the -b flag for bitbucket'));
                    return [2 /*return*/];
                }
                console.log("your remote provider is set to: " + provider);
                credentials = util_1.checkCache();
                if (!!util_1.hasCredentials(credentials, provider, commander_1.default.reset)) return [3 /*break*/, 2];
                return [4 /*yield*/, questions_1.questionsWithLogin(provider)];
            case 1:
                answers = _c.sent();
                credentials = (_a = {},
                    _a[provider] = {
                        username: answers.username,
                        password: answers.password
                    },
                    _a);
                util_1.writeToCache(credentials);
                repoName = answers.repoName;
                return [3 /*break*/, 4];
            case 2:
                console.log(chalk_1.default.yellow("You are logged in with the username: " + chalk_1.default.green("" + (credentials && ((_b = credentials[provider]) === null || _b === void 0 ? void 0 : _b.username))) + ".  \nIf you would like to change your login credentials, please run again with the -r flag."));
                return [4 /*yield*/, questions_1.questionsIfCachedLogin(provider)];
            case 3:
                answers = _c.sent();
                repoName = answers.repoName;
                _c.label = 4;
            case 4:
                credentials = credentials;
                res = { repoName: '', links: [], statusCode: 0 };
                if (!(provider == types_1.Provider.BITBUCKET && credentials.Bitbucket)) return [3 /*break*/, 9];
                _c.label = 5;
            case 5:
                _c.trys.push([5, 7, , 8]);
                return [4 /*yield*/, util_1.bitbucketCreate(credentials.Bitbucket, repoName)];
            case 6:
                res = _c.sent();
                return [3 /*break*/, 8];
            case 7:
                e_1 = _c.sent();
                console.error(chalk_1.default.red("status: " + e_1.response.status + ",\nmessage: " + e_1.response.data.error.message));
                return [2 /*return*/];
            case 8: return [3 /*break*/, 13];
            case 9:
                if (!(provider == types_1.Provider.GITHUB && credentials.Github)) return [3 /*break*/, 13];
                _c.label = 10;
            case 10:
                _c.trys.push([10, 12, , 13]);
                return [4 /*yield*/, util_2.githubCreate(credentials.Github, repoName)];
            case 11:
                res = _c.sent();
                return [3 /*break*/, 13];
            case 12:
                e_2 = _c.sent();
                console.error(chalk_1.default.red("status: " + e_2.response.status + ",\nmessage: " + e_2.response.data.errors[0].message));
                return [2 /*return*/];
            case 13:
                console.log(chalk_1.default.green("Repo successfully created!\nRepo Name: " + res.repoName));
                console.log(chalk_1.default.yellowBright('---------------'));
                console.log(chalk_1.default.magentaBright("Set your remote repo with https: \ngit remote add origin " + res.links[0] + " \nOr ssh:\ngit remote add origin " + res.links[1]));
                return [2 /*return*/];
        }
    });
}); };
cli();
