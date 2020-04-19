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
var fs_1 = __importDefault(require("fs"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var axios_1 = __importDefault(require("axios"));
var types_1 = require("./types");
var slugify_1 = __importDefault(require("slugify"));
exports.clearCache = function () {
    fs_1.default.writeFileSync(types_1.DATAPATH, '');
};
exports.checkCache = function () {
    var credentials = js_yaml_1.default.safeLoad(fs_1.default.readFileSync(types_1.DATAPATH, 'utf8'));
    return credentials;
};
exports.writeToCache = function (credentials) {
    var yamlString = js_yaml_1.default.safeDump(credentials);
    fs_1.default.writeFileSync(types_1.DATAPATH, yamlString);
};
exports.hasCredentials = function (credentials, provider, reset) {
    var _a, _b;
    if (!credentials ||
        !credentials[provider] ||
        !((_a = credentials[provider]) === null || _a === void 0 ? void 0 : _a.username) ||
        !((_b = credentials[provider]) === null || _b === void 0 ? void 0 : _b.password) ||
        reset) {
        return false;
    }
    return true;
};
//error was because slug was uppercase
exports.bitbucketCreate = function (credentials, repoName) { return __awaiter(void 0, void 0, void 0, function () {
    var slugifiedRepoName, _a, data, status_1, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                slugifiedRepoName = slugify_1.default(repoName.toLowerCase());
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(types_1.BITBUCKET_URL(credentials.username, slugifiedRepoName), null, {
                        auth: {
                            username: credentials.username,
                            password: credentials.password
                        }
                    })];
            case 2:
                _a = _b.sent(), data = _a.data, status_1 = _a.status;
                return [2 /*return*/, {
                        repoName: data.name,
                        links: [data.links.clone[0].href, data.links.clone[1].href],
                        statusCode: status_1
                    }];
            case 3:
                e_1 = _b.sent();
                throw e_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.githubCreate = function (credentials, repoName) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, status_2, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post(types_1.GITHUB_REPO_URL, {
                        name: "" + repoName
                    }, {
                        auth: {
                            username: credentials.username,
                            password: credentials.password
                        }
                    })];
            case 1:
                _a = _b.sent(), data = _a.data, status_2 = _a.status;
                return [2 /*return*/, {
                        repoName: data.name,
                        links: [data.clone_url, data.ssh_url],
                        statusCode: status_2
                    }];
            case 2:
                e_2 = _b.sent();
                throw e_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
