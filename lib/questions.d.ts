import { Answers, Provider } from './types';
export declare const questionsWithLogin: (provider: Provider) => Promise<Answers>;
export declare const questionsIfCachedLogin: (provider: Provider) => Promise<Answers>;
