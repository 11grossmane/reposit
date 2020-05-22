import { Answers, Provider } from './types';
export declare const loginQuestions: (provider: Provider) => Promise<Answers>;
export declare const repoNameQuestion: (provider: Provider, toDelete?: "" | "delete") => Promise<Answers>;
export declare const storeQuestion: () => Promise<Answers>;
export declare const deleteQuestions: (provider: Provider, repoName: string) => Promise<Answers>;
