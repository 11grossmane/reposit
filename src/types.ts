export interface Answers {
    username?: string
    password?: string
    repoName: string
}

export interface Credentials {
    username: string
    password: string
}

export enum Provider {
    GITHUB = 'Github',
    BITBUCKET = 'Bitbucket'
}

export const DATAPATH = __dirname + '/../data/login.yaml'
