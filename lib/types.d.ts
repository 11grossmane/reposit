export interface Answers {
    username?: string;
    password?: string;
    repoName: string;
}
export interface Credentials {
    Github?: GithubCredentials;
    Bitbucket?: BitbucketCredentials;
}
export interface GithubCredentials {
    username: string;
    password: string;
}
export interface BitbucketCredentials {
    username: string;
    password: string;
}
export declare enum Provider {
    GITHUB = "Github",
    BITBUCKET = "Bitbucket"
}
export declare const GITHUB_REPO_URL = "https://api.github.com/user/repos";
export declare const BITBUCKET_URL: (username: string, repoName: string) => string;
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
export declare const DATAPATH: string;
