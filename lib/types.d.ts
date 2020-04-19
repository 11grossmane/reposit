export interface Answer {
    username?: string;
    password?: string;
}
export interface Credentials {
    username: string;
    password: string;
}
export declare enum Provider {
    GITHUB = "Github",
    BITBUCKET = "Bitbucket"
}
