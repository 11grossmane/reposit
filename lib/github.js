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
var child_process_1 = require("child_process");
var commander_1 = __importDefault(require("commander"));
var ora_1 = __importDefault(require("ora"));
var path_1 = __importDefault(require("path"));
var questions_1 = require("./questions");
var types_1 = require("./types");
var util_1 = require("./util");
exports.github = function (_a) {
    var credentials = _a.credentials, _b = _a.del, del = _b === void 0 ? false : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var provider, spinner, base, cmd, executePath, cp_1, e_1, storeAnswer, _c, repoName, _d, answers, _e, response, e_2, res, e_3;
        var _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, util_1.checkGithubAuthExpiration(credentials)];
                case 1:
                    credentials = _h.sent();
                    provider = types_1.Provider.GITHUB;
                    if (!!util_1.hasCredentials(credentials, provider)) return [3 /*break*/, 10];
                    spinner = ora_1.default("Authorizing...");
                    base = path_1.default.basename(path_1.default.dirname(__filename));
                    cmd = base === "src" ? "ts-node" : "node";
                    executePath = base === "src" ? "src/server" : "lib/server";
                    cp_1 = child_process_1.spawn(cmd, [executePath], {
                        detached: true,
                        stdio: "ignore",
                    });
                    spinner.start();
                    setTimeout(function () {
                        !cp_1.killed && cp_1.kill();
                    }, 8000);
                    _h.label = 2;
                case 2:
                    _h.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, util_1.validateCredentials(null, provider)];
                case 3:
                    credentials = _h.sent();
                    cp_1.kill();
                    return [4 /*yield*/, util_1.removeFromCache(provider)];
                case 4:
                    _h.sent();
                    spinner.stop();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _h.sent();
                    util_1.handleError(e_1, provider);
                    return [2 /*return*/];
                case 6:
                    //if we are just getting credentials, display login and then ask if they want to store
                    console.log(chalk_1.default.yellow("You are logged in with the username: " + chalk_1.default.green("" + ((_f = credentials === null || credentials === void 0 ? void 0 : credentials.Github) === null || _f === void 0 ? void 0 : _f.username)) + ".  \nIf you would like to change your login credentials, please run again with the -r flag.\n"));
                    return [4 /*yield*/, questions_1.storeQuestion()];
                case 7:
                    storeAnswer = _h.sent();
                    _c = storeAnswer.storeLocally;
                    if (!_c) return [3 /*break*/, 9];
                    return [4 /*yield*/, util_1.writeToCache(credentials)];
                case 8:
                    _c = (_h.sent());
                    _h.label = 9;
                case 9:
                    _c;
                    return [3 /*break*/, 11];
                case 10:
                    //otherwise just display login
                    console.log(chalk_1.default.yellow("You are logged in with the username: " + chalk_1.default.green("" + ((_g = credentials === null || credentials === void 0 ? void 0 : credentials.Github) === null || _g === void 0 ? void 0 : _g.username)) + ".  \nIf you would like to change your login credentials, please run again with the -r flag.\n"));
                    _h.label = 11;
                case 11:
                    if (!commander_1.default.delete) return [3 /*break*/, 13];
                    return [4 /*yield*/, questions_1.repoNameQuestion(provider, "delete")];
                case 12:
                    _d = _h.sent();
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, questions_1.repoNameQuestion(provider)];
                case 14:
                    _d = _h.sent();
                    _h.label = 15;
                case 15:
                    repoName = (_d).repoName;
                    if (!del) return [3 /*break*/, 22];
                    return [4 /*yield*/, questions_1.deleteQuestions(provider, repoName)];
                case 16:
                    answers = _h.sent();
                    _e = answers.delete;
                    switch (_e) {
                        case true: return [3 /*break*/, 17];
                        case false: return [3 /*break*/, 20];
                    }
                    return [3 /*break*/, 21];
                case 17:
                    _h.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, util_1.githubDelete(credentials.Github, repoName)];
                case 18:
                    response = _h.sent();
                    console.log(chalk_1.default.green(response));
                    return [2 /*return*/];
                case 19:
                    e_2 = _h.sent();
                    util_1.handleError(e_2, provider);
                    return [2 /*return*/];
                case 20: return [2 /*return*/];
                case 21:
                    try {
                        util_1.throwUnknownError(provider, credentials);
                    }
                    catch (e) {
                        util_1.handleError(e, provider);
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 22];
                case 22:
                    _h.trys.push([22, 24, , 25]);
                    return [4 /*yield*/, util_1.githubCreate(credentials.Github, repoName)];
                case 23:
                    res = _h.sent();
                    //Success!
                    console.log(chalk_1.default.green("\nRepo successfully created!\nRepo Name: " + res.repoName + "\n"));
                    console.log("Set your remote repo with https: \n" + chalk_1.default.bold("git remote add origin " + res.links[0]) + " \nOr ssh:\n" + chalk_1.default.bold("git remote add origin " + res.links[1]));
                    return [3 /*break*/, 25];
                case 24:
                    e_3 = _h.sent();
                    util_1.handleError(e_3, provider, repoName);
                    return [2 /*return*/];
                case 25: return [2 /*return*/];
            }
        });
    });
};
