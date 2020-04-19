import fs from 'fs'
import yaml from 'js-yaml'
import axios from 'axios'
import {
    Credentials,
    Provider,
    DATAPATH,
    BITBUCKET_URL,
    BitbucketCredentials,
    PostResponse,
    GITHUB_REPO_URL,
    GithubCredentials
} from './types'
import slugify from 'slugify'

export const clearCache = (): void => {
    fs.writeFileSync(DATAPATH, '')
}

export const checkCache = (): Credentials | null => {
    const credentials: Credentials = yaml.safeLoad(
        fs.readFileSync(DATAPATH, 'utf8')
    )
    return credentials
}

export const writeToCache = (credentials: Credentials): void => {
    const yamlString = yaml.safeDump(credentials)
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

//error was because slug was uppercase
export const bitbucketCreate = async (
    credentials: BitbucketCredentials,
    repoName: string
): Promise<PostResponse> => {
    const slugifiedRepoName = slugify(repoName.toLowerCase())
    try {
        const { data, status } = await axios.post(
            BITBUCKET_URL(credentials.username, slugifiedRepoName),
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
