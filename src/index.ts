#!/usr/bin/env node
import figlet from 'figlet'
import chalk from 'chalk'
import slugify from 'slugify'
import commander from 'commander'
import {
    Provider,
    DATAPATH,
    Credentials,
    Answers,
    PostResponse,
    InternalArgs
} from './types'
import {
    checkCache,
    writeToCache,
    hasCredentials,
    bitbucketCreate
} from './util'
import { questionsWithLogin, questionsIfCachedLogin } from './questions'
import { githubCreate } from './util'

console.log(chalk.blue(figlet.textSync('Reposit\n')))

commander
    .version('1.0.0')
    .description('create a remote repo!')
    .option('-g, --github', 'set remote to github')
    .option('-b, --bitbucket', 'set remote to bitbucket')
    .option('-r, --reset', 'remove login credentials from cache')
    .parse(process.argv)

const cli = async (internalArgs?: InternalArgs): Promise<void> => {
    let provider: Provider
    let reset: boolean
    if (internalArgs) {
        provider = internalArgs.provider
        reset = internalArgs.reset
    } else {
        reset = commander.reset
        if (commander.github && !commander.bitbucket) {
            provider = Provider.GITHUB
        } else if (commander.bitbucket && !commander.github) {
            provider = Provider.BITBUCKET
        } else {
            console.log(
                chalk.yellow(
                    'please use either the -g flag for github, OR the -b flag for bitbucket.  Use -h flag for more options.'
                )
            )
            return
        }
    }

    console.log(`your remote provider is set to: ${provider}\n`)
    let credentials = checkCache()
    let repoName: string

    //If user does not have cached credentials, or he has used -r flag, ask for credential and then cache them
    if (!hasCredentials(credentials, provider, reset)) {
        const answers: Answers = await questionsWithLogin(provider)
        credentials = <Credentials>{
            [provider]: {
                username: answers.username,
                password: answers.password
            }
        }
        writeToCache(credentials)
        repoName = answers.repoName
    }
    //otherwise, only ask for repo name
    else {
        console.log(
            chalk.yellow(
                `You are logged in with the username: ${chalk.green(
                    `${credentials && credentials[provider]?.username}`
                )}.  \nIf you would like to change your login credentials, please run again with the -r flag.\n`
            )
        )
        const answers: Answers = await questionsIfCachedLogin(provider)
        repoName = answers.repoName
    }

    //Typecasting to make sure credentials is not null
    credentials = <Credentials>credentials

    let res: PostResponse = { repoName: '', links: [], statusCode: 0 }

    //Provider is Bitbucket
    if (provider == Provider.BITBUCKET && credentials.Bitbucket) {
        try {
            res = await bitbucketCreate(credentials.Bitbucket, repoName)
        } catch (e) {
            if (e.response.status === 401) {
                console.error(chalk.red('wrong login credentials'))
                cli({ reset: true, provider: provider })
                return
            } else if (e.response.status === 400) {
                console.error(
                    chalk.red(
                        `You already have a repo called ${repoName}. \nTry a different repo name.`
                    )
                )
                cli({ reset: false, provider: provider })
                return
            } else {
                console.error(
                    chalk.red(
                        `something went wrong with status ${e.response.status}, try again\nmessage: ${e.response.data.error}`
                    )
                )
                cli({ reset: true, provider: provider })
                return
            }
        }
    }

    //Provider is Github
    else if (provider == Provider.GITHUB && credentials.Github) {
        try {
            res = await githubCreate(credentials.Github, repoName)
        } catch (e) {
            if (e.response.status === 401) {
                console.error(chalk.red('wrong login credentials'))
                cli({ reset: true, provider: provider })
                return
            } else if (e.response.status === 422) {
                console.error(
                    chalk.red(
                        `You already have a repo called ${repoName}\nTry a different repo name.`
                    )
                )
                cli({ reset: false, provider: provider })
                return
            } else {
                console.error(
                    chalk.red(
                        `something went wrong with status ${e.response.status}, try again\nmessage: ${e.response.message}`
                    )
                )
                cli({ reset: true, provider: provider })
                return
            }
        }
    }

    //Success!
    console.log(
        chalk.green(
            `\nRepo successfully created!\nRepo Name: ${res.repoName}\n`
        )
    )
    console.log(
        `Set your remote repo with https: \n${chalk.bold(
            `git remote add origin ${res.links[0]}`
        )} \nOr ssh:\n${chalk.bold(`git remote add origin ${res.links[1]}`)}`
    )

    //TODO make README.md
}
cli()
