export interface Answers {
    username?: string
    password?: string
    repoName: string
}

export interface Credentials {
    Github?: GithubCredentials
    Bitbucket?: BitbucketCredentials
}

export interface GithubCredentials {
    username: string
    password: string
}
export interface BitbucketCredentials {
    username: string
    password: string
}

export enum Provider {
    GITHUB = 'Github',
    BITBUCKET = 'Bitbucket'
}

export const GITHUB_REPO_URL = 'https://api.github.com/user/repos'

export const BITBUCKET_URL = (username: string, repoName: string): string => {
    return `https://api.bitbucket.org/2.0/repositories/${username}/${repoName}`
}

export interface BitbucketPostResponse {
    repoName: string
    links: string[]
    statusCode: number
}

export const DATAPATH = __dirname + '/../data/login.yaml'
