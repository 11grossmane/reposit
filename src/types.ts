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

export const GITHUB_LOGIN_URL = 'https://api.github.com/user'

export const BITBUCKET_LOGIN_URL = 'https://api.bitbucket.org/2.0/user'

export const BITBUCKET_URL = (username: string, repoName: string): string => {
    return `https://api.bitbucket.org/2.0/repositories/${username}/${repoName}`
}

export interface PostResponse {
    repoName: string
    links: string[]
    statusCode: number
}
export interface PostResponse {
    repoName: string
    links: string[]
    statusCode: number
}

export interface InternalArgs {
    reset: boolean
    provider: Provider
}

export const DATAPATH = __dirname + '/../data/login.yaml'
