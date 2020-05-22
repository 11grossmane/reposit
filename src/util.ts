import fs from 'fs'
import yaml from 'js-yaml'
import chalk from 'chalk'
import axios, { AxiosError } from 'axios'
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
    GithubCredentials
} from './types'
import slugify from 'slugify'
import { cli } from './index'
import Cryptr = require('cryptr')
import { machineIdSync } from 'node-machine-id'

const key = machineIdSync()
const cryptr = new Cryptr(key)

export const clearCache = (): void => {
    fs.writeFileSync(DATAPATH, '')
}

export const checkCache = (): Credentials | null => {
    try {
        const credentials: Credentials = yaml.safeLoad(fs.readFileSync(DATAPATH, 'utf8'))
        return decryptCredentials(credentials)
    } catch (e) {
        return null
    }
}

export const decryptCredentials = (creds: Credentials): Credentials => {
    let result: Credentials = {}
    for (let key in creds) {
        result[key] = {
            username: cryptr.decrypt(creds[key].username),
            password: cryptr.decrypt(creds[key].password)
        }
    }
    return result
}

export const encryptCredentials = (creds: Credentials): Credentials => {
    let result: Credentials = {}
    for (let key in creds) {
        result[key] = {
            username: cryptr.encrypt(creds[key].username),
            password: cryptr.encrypt(creds[key].password)
        }
    }
    return result
}

export const writeToCache = (newCredentials: Credentials): void => {
    let oldCredentials = checkCache()
    let oldEncryptedCredentials = encryptCredentials(oldCredentials)
    let newEncryptedCredentials = encryptCredentials(newCredentials)
    if (oldCredentials) {
        const yamlString = yaml.safeDump(
            {
                ...oldEncryptedCredentials,
                ...newEncryptedCredentials
            },
            {
                noRefs: true
            }
        )
        fs.writeFileSync(DATAPATH, yamlString)
        return
    }
    const yamlString = yaml.safeDump(newEncryptedCredentials)
    fs.writeFileSync(DATAPATH, yamlString)
}

export const hasCredentials = (
    credentials: Credentials | null,
    provider: Provider,
    reset: boolean
): boolean => {
    if (
        !credentials ||
        !credentials[provider] ||
        !credentials[provider]?.username ||
        !credentials[provider]?.password ||
        reset
    ) {
        return false
    }
    return true
}

export const validateCredentials = async (
    credentials: BitbucketCredentials | GithubCredentials,
    provider: Provider
) => {
    try {
        let url: string = ''
        if (provider === Provider.BITBUCKET) {
            url = BITBUCKET_LOGIN_URL
        } else if (provider === Provider.GITHUB) {
            url = GITHUB_LOGIN_URL
        }
        let res = await axios.get(url, {
            auth: {
                username: credentials.username,
                password: credentials.password
            }
        })
    } catch (e) {
        console.log('error status is ', e.response.status)
        throw e
    }
}

//error was because slug was uppercase
export const bitbucketCreate = async (
    credentials: BitbucketCredentials,
    repoName: string
): Promise<PostResponse> => {
    const slugifiedRepoName = slugify(repoName.toLowerCase())
    try {
        const { data, status } = await axios.post(
            BITBUCKET_REPO_URL(credentials.username, slugifiedRepoName),
            null,
            {
                auth: {
                    username: credentials.username,
                    password: credentials.password
                }
            }
        )
        return {
            repoName: data.name,
            links: [data.links.clone[0].href, data.links.clone[1].href],
            statusCode: status
        }
    } catch (e) {
        throw e
    }
}

const axiosErrorTypeGuard = (tbd: any): any => {
    if ('response' in tbd) {
        tbd = <AxiosError>tbd
    }
    return false
}

export const throwUnknownError = (provider: Provider, credentials: Credentials) => {
    let err = new Error(`Unknown Error with provider ${provider} and credentials ${credentials}`)
    err.name = 'Unknown'
    throw err
}

export const handleError = (
    e: any = {} as AxiosError,
    provider: Provider,
    repoName: string = ''
) => {
    if (e.name && e.name === 'Unknown') {
        console.error(chalk.red(e))
        cli({ reset: true, provider: provider })
        return
    } else if (e.response.status === 400) {
        console.error(
            chalk.red(`You already have a repo called ${repoName}. \nTry a different repo name.\n`)
        )
        cli({ reset: false, provider: provider })
        return
    } else if (e.response.status === 401) {
        console.error(chalk.red('wrong login credentials\n'))
        cli({ reset: true, provider: provider })
        return
    } else if (e.response.status === 422) {
        console.error(
            chalk.red(`You already have a repo called ${repoName}\nTry a different repo name.\n`)
        )
        cli({ reset: false, provider: provider })
        return
    } else if (e.response.status === 403) {
        console.error(chalk.red(`Request limit exceeded.  Try again in one hour.\n`))
        return
    } else {
        console.error(
            chalk.red(
                `something went wrong with status ${e.response.status}, try again\nmessage: ${e.response.data.error}\n`
            )
        )
        cli({ reset: true, provider: provider })
        return
    }
}

export const githubCreate = async (
    credentials: GithubCredentials,
    repoName: string
): Promise<PostResponse> => {
    try {
        const { data, status } = await axios.post(
            GITHUB_REPO_URL,
            {
                name: `${repoName}`
            },
            {
                auth: {
                    username: credentials.username,
                    password: credentials.password
                }
            }
        )

        return {
            repoName: data.name,
            links: [data.clone_url, data.ssh_url],
            statusCode: status
        }
    } catch (e) {
        throw e
    }
}

export const githubDelete = async (credentials: GithubCredentials, repoName: string) => {
    try {
        const url = GITHUB_DELETE_URL(credentials.username, repoName)
        const { status } = await axios.delete(url, {
            auth: {
                username: credentials.username,
                password: credentials.password
            }
        })
        if (status === 204) return `${repoName} successfully deleted from Github`
    } catch (e) {
        throw e
    }
}
export const bitbucketDelete = async (credentials: GithubCredentials, repoName: string) => {
    try {
        const url = BITBUCKET_REPO_URL(credentials.username, repoName)
        const { status } = await axios.delete(url, {
            auth: {
                username: credentials.username,
                password: credentials.password
            }
        })
        if (status === 204) return `${repoName} successfully deleted from Bitbucket`
    } catch (e) {
        throw e
    }
}
