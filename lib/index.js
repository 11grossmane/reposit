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
var child_process_1 = require("child_process");
var ora_1 = __importDefault(require("ora"));
console.log(chalk_1.default.blue(figlet_1.default.textSync("Reposit\n")));
commander_1.default
    .version("1.0.0")
    .description("create a remote repo!")
    .option("-g, --github", "set remote to github")
    .option("-b, --bitbucket", "set remote to bitbucket")
    .option("-r, --reset", "remove login credentials from cache")
    .option("-d,--delete", "delete named repo")
    .parse(process.argv);
exports.cli = function (internalArgs) { return __awaiter(void 0, void 0, void 0, function () {
    var provider, reset, _a, credentials, cp, spinner, _b, loginAnswers, e_1, storeAnswer, _c, repoName, _d, answers, response, e_2, response, e_3, res, e_4, e_5;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
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
                        console.log(chalk_1.default.yellow("please use either the -g flag for github, OR the -b flag for bitbucket.  Use -h flag for more options."));
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
                _a = (_g.sent());
                _g.label = 2;
            case 2:
                //if reset is true wipe credentials
                _a;
                console.log("your remote provider is set to: " + provider + "\n");
                return [4 /*yield*/, util_1.checkCache()];
            case 3:
                credentials = _g.sent();
                if (!!util_1.hasCredentials(credentials, provider, reset)) return [3 /*break*/, 19];
                cp = void 0;
                spinner = ora_1.default("Authorizing...");
                if (provider === types_1.Provider.GITHUB) {
                    cp = child_process_1.spawn("node", ["lib/server"], {
                        detached: true,
                        stdio: "inherit",
                    });
                    spinner.start();
                }
                _b = provider;
                switch (_b) {
                    case types_1.Provider.BITBUCKET: return [3 /*break*/, 4];
                    case types_1.Provider.GITHUB: return [3 /*break*/, 6];
                }
                return [3 /*break*/, 7];
            case 4: return [4 /*yield*/, questions_1.loginQuestions(provider)];
            case 5:
                loginAnswers = _g.sent();
                credentials = {
                    Bitbucket: {
                        username: loginAnswers.username,
                        password: loginAnswers.password,
                    },
                };
                return [3 /*break*/, 7];
            case 6:
                credentials = {
                    Github: {
                        access_token: "",
                    },
                };
                _g.label = 7;
            case 7:
                _g.trys.push([7, 14, , 15]);
                if (!(provider === types_1.Provider.BITBUCKET && credentials.Bitbucket)) return [3 /*break*/, 9];
                return [4 /*yield*/, util_1.validateCredentials(credentials.Bitbucket, provider)];
            case 8:
                _g.sent();
                return [3 /*break*/, 13];
            case 9:
                if (!(provider === types_1.Provider.GITHUB && credentials.Github)) return [3 /*break*/, 12];
                return [4 /*yield*/, util_1.validateCredentials(credentials.Github, provider)];
            case 10:
                credentials = _g.sent();
                cp.kill();
                return [4 /*yield*/, util_1.removeFromCache(types_1.Provider.GITHUB)];
            case 11:
                _g.sent();
                spinner.stop();
                return [3 /*break*/, 13];
            case 12:
                util_1.throwUnknownError(provider, credentials);
                _g.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                e_1 = _g.sent();
                util_1.handleError(e_1, provider);
                return [2 /*return*/];
            case 15:
                console.log(chalk_1.default.yellow("You are logged in with the username: " + chalk_1.default.green("" + (credentials && ((_e = credentials[provider]) === null || _e === void 0 ? void 0 : _e.username))) + ".  \nIf you would like to change your login credentials, please run again with the -r flag.\n"));
                return [4 /*yield*/, questions_1.storeQuestion()];
            case 16:
                storeAnswer = _g.sent();
                _c = storeAnswer.storeLocally;
                if (!_c) return [3 /*break*/, 18];
                return [4 /*yield*/, util_1.writeToCache(credentials)];
            case 17:
                _c = (_g.sent());
                _g.label = 18;
            case 18:
                _c;
                _g.label = 19;
            case 19:
                //otherwise, only ask for repo name
                console.log(chalk_1.default.yellow("You are logged in with the username: " + chalk_1.default.green("" + (credentials && ((_f = credentials[provider]) === null || _f === void 0 ? void 0 : _f.username))) + ".  \nIf you would like to change your login credentials, please run again with the -r flag.\n"));
                //Typecasting to make sure credentials is not null
                credentials = credentials;
                if (!commander_1.default.delete) return [3 /*break*/, 21];
                return [4 /*yield*/, questions_1.repoNameQuestion(provider, "delete")];
            case 20:
                _d = _g.sent();
                return [3 /*break*/, 23];
            case 21: return [4 /*yield*/, questions_1.repoNameQuestion(provider)];
            case 22:
                _d = _g.sent();
                _g.label = 23;
            case 23:
                repoName = (_d).repoName;
                if (!commander_1.default.delete) return [3 /*break*/, 35];
                return [4 /*yield*/, questions_1.deleteQuestions(provider, repoName)];
            case 24:
                answers = _g.sent();
                if (!(answers.delete &&
                    provider === types_1.Provider.GITHUB && (credentials === null || credentials === void 0 ? void 0 : credentials.Github))) return [3 /*break*/, 29];
                _g.label = 25;
            case 25:
                _g.trys.push([25, 27, , 28]);
                return [4 /*yield*/, util_1.githubDelete(credentials.Github, repoName)];
            case 26:
                response = _g.sent();
                console.log(chalk_1.default.green(response));
                return [2 /*return*/];
            case 27:
                e_2 = _g.sent();
                util_1.handleError(e_2, provider);
                return [2 /*return*/];
            case 28: return [3 /*break*/, 35];
            case 29:
                if (!(answers.delete &&
                    provider == types_1.Provider.BITBUCKET && (credentials === null || credentials === void 0 ? void 0 : credentials.Bitbucket))) return [3 /*break*/, 34];
                _g.label = 30;
            case 30:
                _g.trys.push([30, 32, , 33]);
                return [4 /*yield*/, util_1.bitbucketDelete(credentials.Bitbucket, repoName)];
            case 31:
                response = _g.sent();
                console.log(chalk_1.default.green(response));
                return [2 /*return*/];
            case 32:
                e_3 = _g.sent();
                util_1.handleError(e_3, provider);
                return [2 /*return*/];
            case 33: return [3 /*break*/, 35];
            case 34:
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
                _g.label = 35;
            case 35:
                res = { repoName: "", links: [], statusCode: 0 };
                if (!(provider == types_1.Provider.BITBUCKET && credentials.Bitbucket)) return [3 /*break*/, 40];
                _g.label = 36;
            case 36:
                _g.trys.push([36, 38, , 39]);
                return [4 /*yield*/, util_1.bitbucketCreate(credentials.Bitbucket, repoName)];
            case 37:
                res = _g.sent();
                return [3 /*break*/, 39];
            case 38:
                e_4 = _g.sent();
                util_1.handleError(e_4, provider, repoName);
                return [2 /*return*/];
            case 39: return [3 /*break*/, 44];
            case 40:
                if (!(provider == types_1.Provider.GITHUB && credentials.Github)) return [3 /*break*/, 44];
                _g.label = 41;
            case 41:
                _g.trys.push([41, 43, , 44]);
                return [4 /*yield*/, util_1.githubCreate(credentials.Github, repoName)];
            case 42:
                res = _g.sent();
                return [3 /*break*/, 44];
            case 43:
                e_5 = _g.sent();
                util_1.handleError(e_5, provider, repoName);
                return [2 /*return*/];
            case 44:
                //Success!
                console.log(chalk_1.default.green("\nRepo successfully created!\nRepo Name: " + res.repoName + "\n"));
                console.log("Set your remote repo with https: \n" + chalk_1.default.bold("git remote add origin " + res.links[0]) + " \nOr ssh:\n" + chalk_1.default.bold("git remote add origin " + res.links[1]));
                return [2 /*return*/];
        }
    });
}); };
exports.cli();
