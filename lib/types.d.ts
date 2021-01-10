export interface Answers {
    username?: string;
    password?: string;
    repoName: string;
    delete?: boolean;
    storeLocally?: boolean;
}
export interface Credentials {
    [index: string]: GithubCredentials | BitbucketCredentials | undefined;
    Github?: GithubCredentials;
    Bitbucket?: BitbucketCredentials;
}
export interface GithubCredentials {
    [index: string]: string;
    username?: string;
    access_token: string;
}
export interface BitbucketCredentials {
    [index: string]: string;
    username: string;
    password: string;
}
export declare enum Provider {
    GITHUB = "Github",
    BITBUCKET = "Bitbucket"
}
export declare const GITHUB_REPO_URL = "https://api.github.com/user/repos";
export declare const GITHUB_LOGIN_URL = "https://api.github.com/user";
export declare const BITBUCKET_LOGIN_URL = "https://api.bitbucket.org/2.0/user";
export declare const BITBUCKET_REPO_URL: (username: string, repoName: string) => string;
export declare const GITHUB_DELETE_URL: (username: string, repoName: string) => string;
export interface PostResponse {
    repoName: string;
    links: string[];
    statusCode: number;
}
export interface PostResponse {
    repoName: string;
    links: string[];
    statusCode: number;
}
export interface InternalArgs {
    reset: boolean;
    provider: Provider;
}
export interface PathArgs {
    credentials: Credentials;
    del: boolean;
}
export declare const DATAPATH: string;
