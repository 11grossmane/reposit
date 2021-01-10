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

export enum Provider {
    GITHUB = "Github",
    BITBUCKET = "Bitbucket",
}

export const GITHUB_REPO_URL = "https://api.github.com/user/repos";

export const GITHUB_LOGIN_URL = "https://api.github.com/user";

export const BITBUCKET_LOGIN_URL = "https://api.bitbucket.org/2.0/user";

export const BITBUCKET_REPO_URL = (
    username: string,
    repoName: string
): string => {
    return `https://api.bitbucket.org/2.0/repositories/${username}/${repoName}`;
};

export const GITHUB_DELETE_URL = (
    username: string,
    repoName: string
): string => {
    return `https://api.github.com/repos/${username}/${repoName}`;
};

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

export const DATAPATH = __dirname + "/../data/login.yaml";
