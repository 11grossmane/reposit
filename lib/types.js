"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Provider;
(function (Provider) {
    Provider["GITHUB"] = "Github";
    Provider["BITBUCKET"] = "Bitbucket";
})(Provider = exports.Provider || (exports.Provider = {}));
exports.GITHUB_REPO_URL = 'https://api.github.com/user/repos';
exports.GITHUB_LOGIN_URL = 'https://api.github.com/user';
exports.BITBUCKET_LOGIN_URL = 'https://api.bitbucket.org/2.0/user';
exports.BITBUCKET_REPO_URL = function (username, repoName) {
    return "https://api.bitbucket.org/2.0/repositories/" + username + "/" + repoName;
};
exports.GITHUB_DELETE_URL = function (username, repoName) {
    return "https://api.github.com/repos/" + username + "/" + repoName;
};
exports.DATAPATH = __dirname + '/../data/login.yaml';
