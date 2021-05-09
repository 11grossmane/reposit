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
var figlet_1 = __importDefault(require("figlet"));
var bitbucket_1 = require("./bitbucket");
var github_1 = require("./github");
var types_1 = require("./types");
var util_1 = require("./util");
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
    var del, reset, provider, _a, credentials;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                del = commander_1.default.delete;
                if (internalArgs) {
                    reset = internalArgs.reset;
                    provider = internalArgs.provider;
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
                console.log("your remote provider is set to: " + provider + "\n");
                //if reset is true wipe credentials
                _a = reset;
                if (!_a) 
                //if reset is true wipe credentials
                return [3 /*break*/, 2];
                return [4 /*yield*/, util_1.clearCache()];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                //if reset is true wipe credentials
                _a;
                return [4 /*yield*/, util_1.checkCache()];
            case 3:
                credentials = _b.sent();
                //enter main flows
                switch (provider) {
                    case types_1.Provider.GITHUB:
                        github_1.github({ credentials: credentials, del: del });
                        break;
                    case types_1.Provider.BITBUCKET:
                        bitbucket_1.bitbucket({ credentials: credentials, del: del });
                        break;
                    default:
                        break;
                }
                return [2 /*return*/];
        }
    });
}); };
exports.cli();
// //If user does not have cached credentials, or he has used -r flag, ask for credential and then cache them
// if (!hasCredentials(credentials, provider, reset)) {
//     let cp: ChildProcess;
//     const spinner = ora("Authorizing...");
//     if (provider === Provider.GITHUB) {
//         cp = spawn("node", ["lib/server"], {
//             detached: true,
//             stdio: "ignore",
//         });
//         spinner.start();
//     }
//     switch (provider) {
//         case Provider.BITBUCKET:
//             const loginAnswers = await loginQuestions(provider);
//             credentials = <Credentials>{
//                 Bitbucket: {
//                     username: loginAnswers.username,
//                     password: loginAnswers.password,
//                 },
//             };
//             break;
//         case Provider.GITHUB:
//             credentials = <Credentials>{
//                 Github: {
//                     access_token: "",
//                 },
//             };
//     }
//     try {
//         if (provider === Provider.BITBUCKET && credentials.Bitbucket) {
//             await validateCredentials(credentials.Bitbucket, provider);
//         } else if (provider === Provider.GITHUB && credentials.Github) {
//             credentials = await validateCredentials(
//                 credentials.Github,
//                 provider
//             );
//             cp.kill();
//             await removeFromCache(Provider.GITHUB);
//             spinner.stop();
//         } else {
//             throwUnknownError(provider, credentials);
//         }
//     } catch (e) {
//         handleError(e, provider);
//         return;
//     }
//     console.log(
//         chalk.yellow(
//             `You are logged in with the username: ${chalk.green(
//                 `${credentials && credentials[provider]?.username}`
//             )}.  \nIf you would like to change your login credentials, please run again with the -r flag.\n`
//         )
//     );
//     const storeAnswer = await storeQuestion();
//     storeAnswer.storeLocally && (await writeToCache(credentials));
// }
// //otherwise, only ask for repo name
// console.log(
//     chalk.yellow(
//         `You are logged in with the username: ${chalk.green(
//             `${credentials && credentials[provider]?.username}`
//         )}.  \nIf you would like to change your login credentials, please run again with the -r flag.\n`
//     )
// );
// //Typecasting to make sure credentials is not null
// credentials = <Credentials>credentials;
// //asking for repo name
// let { repoName } = commander.delete
//     ? await repoNameQuestion(provider, "delete")
//     : await repoNameQuestion(provider);
// //delete flow
// if (commander.delete) {
//     let answers = await deleteQuestions(provider, repoName);
//     //Provider is github
//     if (
//         answers.delete &&
//         provider === Provider.GITHUB &&
//         credentials?.Github
//     ) {
//         try {
//             const response = await githubDelete(
//                 credentials.Github,
//                 repoName
//             );
//             console.log(chalk.green(response));
//             return;
//         } catch (e) {
//             handleError(e, provider);
//             return;
//         }
//     }
//     //Provider is bitbucket
//     else if (
//         answers.delete &&
//         provider == Provider.BITBUCKET &&
//         credentials?.Bitbucket
//     ) {
//         try {
//             const response = await bitbucketDelete(
//                 credentials.Bitbucket,
//                 repoName
//             );
//             console.log(chalk.green(response));
//             return;
//         } catch (e) {
//             handleError(e, provider);
//             return;
//         }
//     } else if (answers.delete == false) {
//         return;
//     } else {
//         try {
//             throwUnknownError(provider, credentials);
//         } catch (e) {
//             handleError(e, provider);
//             return;
//         }
//     }
// }
// //create flow
// let res: PostResponse = { repoName: "", links: [], statusCode: 0 };
// //Provider is Bitbucket
// if (provider == Provider.BITBUCKET && credentials.Bitbucket) {
//     try {
//         res = await bitbucketCreate(credentials.Bitbucket, repoName);
//     } catch (e) {
//         handleError(e, provider, repoName);
//         return;
//     }
// }
// //Provider is Github
// else if (provider == Provider.GITHUB && credentials.Github) {
//     try {
//         res = await githubCreate(credentials.Github, repoName);
//     } catch (e) {
//         handleError(e, provider, repoName);
//         return;
//     }
// }
// //Success!
// console.log(
//     chalk.green(
//         `\nRepo successfully created!\nRepo Name: ${res.repoName}\n`
//     )
// );
// console.log(
//     `Set your remote repo with https: \n${chalk.bold(
//         `git remote add origin ${res.links[0]}`
//     )} \nOr ssh:\n${chalk.bold(`git remote add origin ${res.links[1]}`)}`
// );
// //TODO make README.md
