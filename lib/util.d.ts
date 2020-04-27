import { Credentials, Provider, BitbucketCredentials, PostResponse, GithubCredentials } from './types';
export declare const clearCache: () => void;
export declare const checkCache: () => Credentials | null;
export declare const writeToCache: (newCredentials: Credentials) => void;
export declare const hasCredentials: (credentials: Credentials | null, provider: Provider, reset: boolean) => boolean;
export declare const validateCredentials: (credentials: GithubCredentials | BitbucketCredentials, provider: Provider) => Promise<void>;
export declare const bitbucketCreate: (credentials: BitbucketCredentials, repoName: string) => Promise<PostResponse>;
export declare const githubCreate: (credentials: GithubCredentials, repoName: string) => Promise<PostResponse>;
