#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var figlet_1 = __importDefault(require("figlet"));
var chalk_1 = __importDefault(require("chalk"));
var commander_1 = __importDefault(require("commander"));
var types_1 = require("./types");
var util_1 = require("./util");
console.log(chalk_1.default.blue(figlet_1.default.textSync('Reposit\n')));
util_1.checkCache();
commander_1.default
    .version('1.0.0')
    .description('create a remote repo!')
    .option('-g, --github', 'set remote to github')
    .option('-b, --bitbucket', 'set remote to bitbucket')
    .option('-r, --reset', 'remove login credentials from cache')
    .parse(process.argv);
var cli = function () {
    var provider;
    if (commander_1.default.github && !commander_1.default.bitbucket) {
        provider = types_1.Provider.GITHUB;
    }
    else if (commander_1.default.bitbucket && !commander_1.default.github) {
        provider = types_1.Provider.BITBUCKET;
    }
    else {
        console.log(chalk_1.default.yellow('please use either the -g flag for github, OR the -b flag for bitbucket'));
        return;
    }
    console.log("you have set your remote to: " + provider);
    var credentials = util_1.checkCache();
};
cli();
