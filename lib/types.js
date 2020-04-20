"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Provider;
(function (Provider) {
    Provider["GITHUB"] = "Github";
    Provider["BITBUCKET"] = "Bitbucket";
})(Provider = exports.Provider || (exports.Provider = {}));
exports.GITHUB_REPO_URL = 'https://api.github.com/user/repos';
exports.BITBUCKET_URL = function (username, repoName) {
    return "https://api.bitbucket.org/2.0/repositories/" + username + "/" + repoName;
};
exports.DATAPATH = __dirname + '/../data/login.yaml';
