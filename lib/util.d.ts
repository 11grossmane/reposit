import { Credentials, Provider, BitbucketCredentials, PostResponse, GithubCredentials } from "./types";
export declare const clearCache: () => Promise<void>;
export declare const checkCache: () => Promise<Credentials>;
export declare const decryptCredentials: (creds: Credentials) => Credentials;
export declare const encryptCredentials: (creds: Credentials) => Credentials;
export declare const writeToCache: (newCredentials: Credentials) => Promise<void>;
export declare const hasCredentials: (credentials: Credentials, provider: Provider, reset: boolean) => boolean;
export declare const validateCredentials: (credentials: GithubCredentials | BitbucketCredentials, provider: Provider) => Promise<void>;
export declare const bitbucketCreate: (credentials: BitbucketCredentials, repoName: string) => Promise<PostResponse>;
export declare const throwUnknownError: (provider: Provider, credentials: Credentials) => never;
export declare const handleError: (e: any, provider: Provider, repoName?: string) => void;
export declare const githubCreate: (credentials: GithubCredentials, repoName: string) => Promise<PostResponse>;
export declare const githubDelete: (credentials: GithubCredentials, repoName: string) => Promise<string>;
export declare const bitbucketDelete: (credentials: GithubCredentials, repoName: string) => Promise<string>;
