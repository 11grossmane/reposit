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
var chalk_1 = __importDefault(require("chalk"));
var commander_1 = __importDefault(require("commander"));
var questions_1 = require("./questions");
var types_1 = require("./types");
var util_1 = require("./util");
exports.bitbucket = function (_a) {
    var credentials = _a.credentials, _b = _a.del, del = _b === void 0 ? false : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var provider, loginAnswers, e_1, storeAnswer, repoName, _c, answers, _d, response, e_2, res, e_3;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    provider = types_1.Provider.BITBUCKET;
                    if (!!util_1.hasCredentials(credentials, provider)) return [3 /*break*/, 7];
                    return [4 /*yield*/, questions_1.loginQuestions(provider)];
                case 1:
                    loginAnswers = _f.sent();
                    credentials = {
                        Bitbucket: {
                            username: loginAnswers.username,
                            password: loginAnswers.password,
                        },
                    };
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, util_1.validateCredentials(credentials.Bitbucket, provider)];
                case 3:
                    _f.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _f.sent();
                    util_1.handleError(e_1, provider);
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, questions_1.storeQuestion()];
                case 6:
                    storeAnswer = _f.sent();
                    storeAnswer.storeLocally && (util_1.writeToCache(credentials));
                    _f.label = 7;
                case 7:
                    //otherwise, only ask for repo name
                    console.log(chalk_1.default.yellow("You are logged in with the username: " + chalk_1.default.green("" + (credentials && ((_e = credentials[provider]) === null || _e === void 0 ? void 0 : _e.username))) + ".  \nIf you would like to change your login credentials, please run again with the -r flag.\n"));
                    if (!commander_1.default.delete) return [3 /*break*/, 9];
                    return [4 /*yield*/, questions_1.repoNameQuestion(provider, "delete")];
                case 8:
                    _c = _f.sent();
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, questions_1.repoNameQuestion(provider)];
                case 10:
                    _c = _f.sent();
                    _f.label = 11;
                case 11:
                    repoName = (_c).repoName;
                    if (!del) return [3 /*break*/, 18];
                    return [4 /*yield*/, questions_1.deleteQuestions(provider, repoName)];
                case 12:
                    answers = _f.sent();
                    _d = answers.delete;
                    switch (_d) {
                        case true: return [3 /*break*/, 13];
                        case false: return [3 /*break*/, 16];
                    }
                    return [3 /*break*/, 17];
                case 13:
                    _f.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, util_1.bitbucketDelete(credentials.Bitbucket, repoName)];
                case 14:
                    response = _f.sent();
                    console.log(chalk_1.default.green(response));
                    return [2 /*return*/];
                case 15:
                    e_2 = _f.sent();
                    util_1.handleError(e_2, provider);
                    return [2 /*return*/];
                case 16: return [2 /*return*/];
                case 17:
                    try {
                        util_1.throwUnknownError(provider, credentials);
                    }
                    catch (e) {
                        util_1.handleError(e, provider);
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 18];
                case 18:
                    res = { repoName: "", links: [], statusCode: 0 };
                    _f.label = 19;
                case 19:
                    _f.trys.push([19, 21, , 22]);
                    return [4 /*yield*/, util_1.bitbucketCreate(credentials.Bitbucket, repoName)];
                case 20:
                    res = _f.sent();
                    //Success!
                    console.log(chalk_1.default.green("\nRepo successfully created!\nRepo Name: " + res.repoName + "\n"));
                    console.log("Set your remote repo with https: \n" + chalk_1.default.bold("git remote add origin " + res.links[0]) + " \nOr ssh:\n" + chalk_1.default.bold("git remote add origin " + res.links[1]));
                    return [3 /*break*/, 22];
                case 21:
                    e_3 = _f.sent();
                    util_1.handleError(e_3, provider, repoName);
                    return [2 /*return*/];
                case 22: return [2 /*return*/];
            }
        });
    });
};
