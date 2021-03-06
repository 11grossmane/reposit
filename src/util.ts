import fs from "fs";
import yaml from "js-yaml";
import chalk from "chalk";
import axios, { AxiosError } from "axios";
import {
    Credentials,
    Provider,
    DATAPATH,
    BITBUCKET_REPO_URL,
    BitbucketCredentials,
    PostResponse,
    GITHUB_REPO_URL,
    BITBUCKET_LOGIN_URL,
    GITHUB_LOGIN_URL,
    GITHUB_DELETE_URL,
    GithubCredentials,
} from "./types";
import slugify from "slugify";
import { cli } from "./index";
import Cryptr = require("cryptr");
import { machineIdSync } from "node-machine-id";
import shell from "shelljs";
const clientID = "12e328d31a2bc60d5ddd";


const key = machineIdSync();
const cryptr = new Cryptr(key);

export const clearCache = (): void => {
    fs.writeFileSync(DATAPATH, "");
};

export const removeFromCache = (provider: Provider): void => {
    let oldCredentials = checkCache(false);
    let newEncryptedCredentials = oldCredentials;
    delete newEncryptedCredentials[provider];
    const yamlString = yaml.dump(newEncryptedCredentials);
    fs.writeFileSync(DATAPATH, yamlString);
};

export const checkCache = (
    decrypt: boolean = true
): Credentials | null => {
    try {
        const str = fs.readFileSync(DATAPATH, { encoding: "utf8" });
        const credentials: Credentials = yaml.safeLoad(str);

        if (!decrypt) return credentials;
        return decryptCredentials(credentials);
    } catch (e) {
        return null;
    }
};

export const decryptCredentials = (creds: Credentials): Credentials => {
    let result: Credentials = {};
    for (let key in creds) {
        switch (key) {
            case "Bitbucket":
                result["Bitbucket"] = {
                    username: cryptr.decrypt(creds[key].username),
                    password: cryptr.decrypt(creds[key].password),
                };
                break;
            case "Github":
                result["Github"] = {
                    access_token: cryptr.decrypt(creds[key].access_token),
                    username: cryptr.decrypt(creds[key].username),
                };
                break;
        }
    }
    return result;
};

export const encryptCredentials = (creds: Credentials): Credentials => {
    let result: Credentials = {};
    for (let key in creds) {
        switch (key) {
            case "Bitbucket":
                result["Bitbucket"] = {
                    username: cryptr.encrypt(creds[key].username),
                    password: cryptr.encrypt(creds[key].password),
                };
                break;
            case "Github":
                result["Github"] = {
                    access_token: cryptr.encrypt(creds[key].access_token),
                    username: cryptr.encrypt(creds[key].username),
                };
                break;
        }
    }
    return result;
};

export const writeToCache = (
    newCredentials: Credentials
): void => {
    let oldCredentials = checkCache();
    let oldEncryptedCredentials = encryptCredentials(oldCredentials);
    let newEncryptedCredentials = encryptCredentials(newCredentials);
    if (oldCredentials) {
        const yamlString = yaml.safeDump(
            {
                ...oldEncryptedCredentials,
                ...newEncryptedCredentials,
            },
            {
                noRefs: true,
            }
        );
        fs.writeFileSync(DATAPATH, yamlString);
        return;
    }
    const yamlString = yaml.dump(newEncryptedCredentials);
    fs.writeFileSync(DATAPATH, yamlString);
};

export const hasCredentials = (
    credentials: Credentials | null,
    provider: Provider
): boolean => {
    switch (provider) {
        case Provider.BITBUCKET:
            if (
                !credentials?.Bitbucket?.username ||
                !credentials?.Bitbucket?.password
            )
                return false;
            break;
        case Provider.GITHUB:
            if (!credentials?.Github?.access_token) return false;
            break;
    }

    return true;
};

export const checkGithubAuthExpiration = async (
    credentials: Credentials
): Promise<Credentials | undefined> => {
    if (!credentials?.Github?.access_token) return undefined;
    try {
        await getGithubUser(credentials.Github);
        return credentials;
    } catch (e) {
        console.error("credentials expired...reauthorizing");
        return undefined;
    }
};

export const validateCredentials = async (
    credentials: BitbucketCredentials | GithubCredentials,
    provider: Provider
): Promise<Credentials> => {
    let creds: Credentials;
    console.log('Validating...')
    try {
        let url: string = "";
        if (provider === Provider.BITBUCKET) {
            url = BITBUCKET_LOGIN_URL;
            let res = await axios.get(url, {
                auth: {
                    username: credentials.username,
                    password: credentials.password,
                },
            });
        } else if (provider === Provider.GITHUB) {
            let cmd = 'open'
            if (process.platform === 'linux') cmd = 'sensible-browser'
            shell.exec(
                `${cmd}  'https://github.com/login/oauth/authorize?scope=user+repo+delete_repo&client_id=${clientID}'`
            );
            const start = Date.now()
            while (!creds?.Github) {
                if (Date.now() - start > 10000) {
                    console.error('\n request timed-out \n')
                    break
                }

                creds = checkCache();
            }
        }
        return creds;
    } catch (e) {
        console.log(e);
        console.log("error status is ", e.response.status);
        throw e;
    }
};

//error was because slug was uppercase
export const bitbucketCreate = async (
    credentials: BitbucketCredentials,
    repoName: string
): Promise<PostResponse> => {
    const slugifiedRepoName = slugify(repoName.toLowerCase());
    try {
        const { data, status } = await axios.post(
            BITBUCKET_REPO_URL(credentials.username, slugifiedRepoName),
            null,
            {
                auth: {
                    username: credentials.username,
                    password: credentials.password,
                },
            }
        );
        return {
            repoName: data.name,
            links: [data.links.clone[0].href, data.links.clone[1].href],
            statusCode: status,
        };
    } catch (e) {
        throw e;
    }
};

const axiosErrorTypeGuard = (tbd: any): any => {
    if ("response" in tbd) {
        tbd = <AxiosError>tbd;
    }
    return false;
};

export const throwUnknownError = (
    provider: Provider,
    credentials: Credentials
) => {
    let err = new Error(
        `Unknown Error with provider ${provider} and credentials ${credentials}`
    );
    err.name = "Unknown";
    throw err;
};

export const handleError = (
    e: any = {} as AxiosError,
    provider: Provider,
    repoName: string = ""
) => {
    if (e.name && e.name === "Unknown") {
        console.error(chalk.red(e));
        cli({ reset: true, provider: provider });
        return;
    } else if (e.response.status === 400) {
        console.error(
            chalk.red(
                `You already have a repo called ${repoName}. \nTry a different repo name.\n`
            )
        );
        cli({ reset: false, provider: provider });
        return;
    } else if (e.response.status === 401) {
        console.error(chalk.red("wrong login credentials\n"));
        cli({ reset: true, provider: provider });
        return;
    } else if (e.response.status === 422) {
        console.error(
            chalk.red(
                `You already have a repo called ${repoName}\nTry a different repo name.\n`
            )
        );
        cli({ reset: false, provider: provider });
        return;
    } else if (e.response.status === 403) {
        console.error(
            chalk.red(`Request limit exceeded.  Try again in one hour.\n`)
        );
        return;
    } else if (e.response.status === 404) {
        console.error(chalk.red(`Not found.\n`));
        return;
    } else {
        console.error(
            chalk.red(
                `something went wrong with status ${e.response.status}, try again\nmessage: ${e.response.data.error}\n`
            )
        );
        cli({ reset: true, provider: provider });
        return;
    }
};

export const getGithubUser = async (
    credentials: GithubCredentials
): Promise<string> => {
    try {
        if (!credentials) throw new Error("no credentials");
        const { data, status } = await axios.get(GITHUB_LOGIN_URL, {
            headers: {
                Authorization: `Bearer ${credentials.access_token}`,
            },
        });
        return data.login;
    } catch (e) {
        throw e;
    }
};

export const githubCreate = async (
    credentials: GithubCredentials,
    repoName: string
): Promise<PostResponse> => {
    try {
        const { data, status } = await axios.post(
            GITHUB_REPO_URL,
            {
                name: `${repoName}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${credentials.access_token}`,
                },
            }
        );

        return {
            repoName: data.name,
            links: [data.clone_url, data.ssh_url],
            statusCode: status,
        };
    } catch (e) {
        throw e;
    }
};

export const githubDelete = async (
    credentials: GithubCredentials,
    repoName: string
) => {
    try {
        const url = GITHUB_DELETE_URL(credentials.username, repoName);
        const { status } = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${credentials.access_token}`,
            },
        });
        if (status === 204)
            return `${repoName} successfully deleted from Github`;
    } catch (e) {
        throw e;
    }
};
export const bitbucketDelete = async (
    credentials: BitbucketCredentials,
    repoName: string
) => {
    try {
        const url = BITBUCKET_REPO_URL(credentials.username, repoName);
        const { status } = await axios.delete(url, {
            auth: {
                username: credentials.username,
                password: credentials.password,
            },
        });
        if (status === 204)
            return `${repoName} successfully deleted from Bitbucket`;
    } catch (e) {
        throw e;
    }
};
