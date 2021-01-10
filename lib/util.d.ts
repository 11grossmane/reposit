import { Credentials, Provider, BitbucketCredentials, PostResponse, GithubCredentials } from "./types";
export declare const clearCache: () => Promise<void>;
export declare const removeFromCache: (provider: Provider) => Promise<void>;
export declare const checkCache: (decrypt?: boolean) => Promise<Credentials>;
export declare const decryptCredentials: (creds: Credentials) => Credentials;
export declare const encryptCredentials: (creds: Credentials) => Credentials;
export declare const writeToCache: (newCredentials: Credentials) => Promise<void>;
export declare const hasCredentials: (credentials: Credentials, provider: Provider) => boolean;
export declare const checkGithubAuthExpiration: (credentials: Credentials) => Promise<Credentials>;
export declare const validateCredentials: (credentials: GithubCredentials | BitbucketCredentials, provider: Provider) => Promise<Credentials>;
export declare const bitbucketCreate: (credentials: BitbucketCredentials, repoName: string) => Promise<PostResponse>;
export declare const throwUnknownError: (provider: Provider, credentials: Credentials) => never;
export declare const handleError: (e: any, provider: Provider, repoName?: string) => void;
export declare const getGithubUser: (credentials: GithubCredentials) => Promise<string>;
export declare const githubCreate: (credentials: GithubCredentials, repoName: string) => Promise<PostResponse>;
export declare const githubDelete: (credentials: GithubCredentials, repoName: string) => Promise<string>;
export declare const bitbucketDelete: (credentials: BitbucketCredentials, repoName: string) => Promise<string>;
