"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var js_yaml_1 = __importDefault(require("js-yaml"));
exports.checkCache = function () {
    var credentials = js_yaml_1.default.safeLoad(fs_1.default.readFileSync(__dirname + '/../data/login.yaml', 'utf8'));
    console.log(credentials);
    return credentials;
};
