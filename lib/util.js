"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var fs_1 = __importDefault(require("fs"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var chalk_1 = __importDefault(require("chalk"));
var axios_1 = __importDefault(require("axios"));
var types_1 = require("./types");
var slugify_1 = __importDefault(require("slugify"));
var index_1 = require("./index");
var Cryptr = require("cryptr");
var node_machine_id_1 = require("node-machine-id");
var shelljs_1 = __importDefault(require("shelljs"));
var clientID = "12e328d31a2bc60d5ddd";
var key = node_machine_id_1.machineIdSync();
var cryptr = new Cryptr(key);
exports.clearCache = function () {
    fs_1.default.writeFileSync(types_1.DATAPATH, "");
};
exports.removeFromCache = function (provider) {
    var oldCredentials = exports.checkCache(false);
    var newEncryptedCredentials = oldCredentials;
    delete newEncryptedCredentials[provider];
    var yamlString = js_yaml_1.default.dump(newEncryptedCredentials);
    fs_1.default.writeFileSync(types_1.DATAPATH, yamlString);
};
exports.checkCache = function (decrypt) {
    if (decrypt === void 0) { decrypt = true; }
    try {
        var str = fs_1.default.readFileSync(types_1.DATAPATH, { encoding: "utf8" });
        var credentials = js_yaml_1.default.safeLoad(str);
        if (!decrypt)
            return credentials;
        return exports.decryptCredentials(credentials);
    }
    catch (e) {
        return null;
    }
};
exports.decryptCredentials = function (creds) {
    var result = {};
    for (var key_1 in creds) {
        switch (key_1) {
            case "Bitbucket":
                result["Bitbucket"] = {
                    username: cryptr.decrypt(creds[key_1].username),
                    password: cryptr.decrypt(creds[key_1].password),
                };
                break;
            case "Github":
                result["Github"] = {
                    access_token: cryptr.decrypt(creds[key_1].access_token),
                    username: cryptr.decrypt(creds[key_1].username),
                };
                break;
        }
    }
    return result;
};
exports.encryptCredentials = function (creds) {
    var result = {};
    for (var key_2 in creds) {
        switch (key_2) {
            case "Bitbucket":
                result["Bitbucket"] = {
                    username: cryptr.encrypt(creds[key_2].username),
                    password: cryptr.encrypt(creds[key_2].password),
                };
                break;
            case "Github":
                result["Github"] = {
                    access_token: cryptr.encrypt(creds[key_2].access_token),
                    username: cryptr.encrypt(creds[key_2].username),
                };
                break;
        }
    }
    return result;
};
exports.writeToCache = function (newCredentials) {
    var oldCredentials = exports.checkCache();
    var oldEncryptedCredentials = exports.encryptCredentials(oldCredentials);
    var newEncryptedCredentials = exports.encryptCredentials(newCredentials);
    if (oldCredentials) {
        var yamlString_1 = js_yaml_1.default.safeDump(__assign(__assign({}, oldEncryptedCredentials), newEncryptedCredentials), {
            noRefs: true,
        });
        console.log('datapath is ', types_1.DATAPATH);
        fs_1.default.writeFileSync(types_1.DATAPATH, yamlString_1);
        return;
    }
    var yamlString = js_yaml_1.default.dump(newEncryptedCredentials);
    fs_1.default.writeFileSync(types_1.DATAPATH, yamlString);
};
exports.hasCredentials = function (credentials, provider) {
    var _a, _b, _c;
    switch (provider) {
        case types_1.Provider.BITBUCKET:
            if (!((_a = credentials === null || credentials === void 0 ? void 0 : credentials.Bitbucket) === null || _a === void 0 ? void 0 : _a.username) ||
                !((_b = credentials === null || credentials === void 0 ? void 0 : credentials.Bitbucket) === null || _b === void 0 ? void 0 : _b.password))
                return false;
            break;
        case types_1.Provider.GITHUB:
            if (!((_c = credentials === null || credentials === void 0 ? void 0 : credentials.Github) === null || _c === void 0 ? void 0 : _c.access_token))
                return false;
            break;
    }
    return true;
};
exports.checkGithubAuthExpiration = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!((_a = credentials === null || credentials === void 0 ? void 0 : credentials.Github) === null || _a === void 0 ? void 0 : _a.access_token))
                    return [2 /*return*/, undefined];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exports.getGithubUser(credentials.Github)];
            case 2:
                _b.sent();
                return [2 /*return*/, credentials];
            case 3:
                e_1 = _b.sent();
                console.error("credentials expired...reauthorizing");
                return [2 /*return*/, undefined];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.validateCredentials = function (credentials, provider) { return __awaiter(void 0, void 0, void 0, function () {
    var creds, url, res, cmd, start, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('validating...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                url = "";
                if (!(provider === types_1.Provider.BITBUCKET)) return [3 /*break*/, 3];
                url = types_1.BITBUCKET_LOGIN_URL;
                return [4 /*yield*/, axios_1.default.get(url, {
                        auth: {
                            username: credentials.username,
                            password: credentials.password,
                        },
                    })];
            case 2:
                res = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                if (provider === types_1.Provider.GITHUB) {
                    cmd = 'open';
                    if (process.platform === 'linux')
                        cmd = 'sensible-browser';
                    shelljs_1.default.exec(cmd + "  'https://github.com/login/oauth/authorize?scope=user+repo+delete_repo&client_id=" + clientID + "'");
                    start = Date.now();
                    while (!(creds === null || creds === void 0 ? void 0 : creds.Github)) {
                        if (Date.now() - start > 10000) {
                            console.error('request timed-out');
                            break;
                        }
                        creds = exports.checkCache();
                    }
                }
                _a.label = 4;
            case 4: return [2 /*return*/, creds];
            case 5:
                e_2 = _a.sent();
                console.log(e_2);
                console.log("error status is ", e_2.response.status);
                throw e_2;
            case 6: return [2 /*return*/];
        }
    });
}); };
//error was because slug was uppercase
exports.bitbucketCreate = function (credentials, repoName) { return __awaiter(void 0, void 0, void 0, function () {
    var slugifiedRepoName, _a, data, status_1, e_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                slugifiedRepoName = slugify_1.default(repoName.toLowerCase());
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(types_1.BITBUCKET_REPO_URL(credentials.username, slugifiedRepoName), null, {
                        auth: {
                            username: credentials.username,
                            password: credentials.password,
                        },
                    })];
            case 2:
                _a = _b.sent(), data = _a.data, status_1 = _a.status;
                return [2 /*return*/, {
                        repoName: data.name,
                        links: [data.links.clone[0].href, data.links.clone[1].href],
                        statusCode: status_1,
                    }];
            case 3:
                e_3 = _b.sent();
                throw e_3;
            case 4: return [2 /*return*/];
        }
    });
}); };
var axiosErrorTypeGuard = function (tbd) {
    if ("response" in tbd) {
        tbd = tbd;
    }
    return false;
};
exports.throwUnknownError = function (provider, credentials) {
    var err = new Error("Unknown Error with provider " + provider + " and credentials " + credentials);
    err.name = "Unknown";
    throw err;
};
exports.handleError = function (e, provider, repoName) {
    if (e === void 0) { e = {}; }
    if (repoName === void 0) { repoName = ""; }
    if (e.name && e.name === "Unknown") {
        console.error(chalk_1.default.red(e));
        index_1.cli({ reset: true, provider: provider });
        return;
    }
    else if (e.response.status === 400) {
        console.error(chalk_1.default.red("You already have a repo called " + repoName + ". \nTry a different repo name.\n"));
        index_1.cli({ reset: false, provider: provider });
        return;
    }
    else if (e.response.status === 401) {
        console.error(chalk_1.default.red("wrong login credentials\n"));
        index_1.cli({ reset: true, provider: provider });
        return;
    }
    else if (e.response.status === 422) {
        console.error(chalk_1.default.red("You already have a repo called " + repoName + "\nTry a different repo name.\n"));
        index_1.cli({ reset: false, provider: provider });
        return;
    }
    else if (e.response.status === 403) {
        console.error(chalk_1.default.red("Request limit exceeded.  Try again in one hour.\n"));
        return;
    }
    else if (e.response.status === 404) {
        console.error(chalk_1.default.red("Not found.\n"));
        return;
    }
    else {
        console.error(chalk_1.default.red("something went wrong with status " + e.response.status + ", try again\nmessage: " + e.response.data.error + "\n"));
        index_1.cli({ reset: true, provider: provider });
        return;
    }
};
exports.getGithubUser = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, status_2, e_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!credentials)
                    throw new Error("no credentials");
                return [4 /*yield*/, axios_1.default.get(types_1.GITHUB_LOGIN_URL, {
                        headers: {
                            Authorization: "Bearer " + credentials.access_token,
                        },
                    })];
            case 1:
                _a = _b.sent(), data = _a.data, status_2 = _a.status;
                return [2 /*return*/, data.login];
            case 2:
                e_4 = _b.sent();
                throw e_4;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.githubCreate = function (credentials, repoName) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, status_3, e_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post(types_1.GITHUB_REPO_URL, {
                        name: "" + repoName,
                    }, {
                        headers: {
                            Authorization: "Bearer " + credentials.access_token,
                        },
                    })];
            case 1:
                _a = _b.sent(), data = _a.data, status_3 = _a.status;
                return [2 /*return*/, {
                        repoName: data.name,
                        links: [data.clone_url, data.ssh_url],
                        statusCode: status_3,
                    }];
            case 2:
                e_5 = _b.sent();
                throw e_5;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.githubDelete = function (credentials, repoName) { return __awaiter(void 0, void 0, void 0, function () {
    var url, status_4, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                url = types_1.GITHUB_DELETE_URL(credentials.username, repoName);
                return [4 /*yield*/, axios_1.default.delete(url, {
                        headers: {
                            Authorization: "Bearer " + credentials.access_token,
                        },
                    })];
            case 1:
                status_4 = (_a.sent()).status;
                if (status_4 === 204)
                    return [2 /*return*/, repoName + " successfully deleted from Github"];
                return [3 /*break*/, 3];
            case 2:
                e_6 = _a.sent();
                throw e_6;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.bitbucketDelete = function (credentials, repoName) { return __awaiter(void 0, void 0, void 0, function () {
    var url, status_5, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                url = types_1.BITBUCKET_REPO_URL(credentials.username, repoName);
                return [4 /*yield*/, axios_1.default.delete(url, {
                        auth: {
                            username: credentials.username,
                            password: credentials.password,
                        },
                    })];
            case 1:
                status_5 = (_a.sent()).status;
                if (status_5 === 204)
                    return [2 /*return*/, repoName + " successfully deleted from Bitbucket"];
                return [3 /*break*/, 3];
            case 2:
                e_7 = _a.sent();
                throw e_7;
            case 3: return [2 /*return*/];
        }
    });
}); };
