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
    bitbucketCreate,
    validateCredentials,
    githubCreate
} from './util'
import { loginQuestions, repoNameQuestion } from './questions'

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

    //If user does not have cached credentials, or he has used -r flag, ask for credential and then cache them
    if (!hasCredentials(credentials, provider, reset)) {
        const loginAnswers = await loginQuestions(provider)

        credentials = <Credentials>{
            [provider]: {
                username: loginAnswers.username,
                password: loginAnswers.password
            }
        }
        try {
            if (provider === Provider.BITBUCKET && credentials.Bitbucket) {
                await validateCredentials(credentials.Bitbucket, provider)
            } else if (provider === Provider.GITHUB && credentials.Github) {
                await validateCredentials(credentials.Github, provider)
            } else {
                let err = new Error(
                    `Unknown Error with provider ${provider} and credentials ${credentials}`
                )
                err.name = 'Unknown'
                throw err
            }
        } catch (e) {
            if (e.name === 'Unknown') {
                console.error(chalk.red(e))
                cli({ reset: true, provider: provider })
                return
            } else if (e.response.status === 401) {
                console.error(chalk.red('wrong login credentials\n'))
                cli({ reset: true, provider: provider })
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
        writeToCache(credentials)
    }

    //otherwise, only ask for repo name
    console.log(
        chalk.yellow(
            `You are logged in with the username: ${chalk.green(
                `${credentials && credentials[provider]?.username}`
            )}.  \nIf you would like to change your login credentials, please run again with the -r flag.\n`
        )
    )

    //asking for repo name
    let { repoName } = await repoNameQuestion(provider)

    //Typecasting to make sure credentials is not null
    credentials = <Credentials>credentials

    let res: PostResponse = { repoName: '', links: [], statusCode: 0 }

    //Provider is Bitbucket
    if (provider == Provider.BITBUCKET && credentials.Bitbucket) {
        try {
            res = await bitbucketCreate(credentials.Bitbucket, repoName)
        } catch (e) {
            if (e.response.status === 401) {
                console.error(chalk.red('wrong login credentials\n'))
                cli({ reset: true, provider: provider })
                return
            } else if (e.response.status === 400) {
                console.error(
                    chalk.red(
                        `You already have a repo called ${repoName}. \nTry a different repo name.\n`
                    )
                )
                cli({ reset: false, provider: provider })
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
    }

    //Provider is Github
    else if (provider == Provider.GITHUB && credentials.Github) {
        try {
            res = await githubCreate(credentials.Github, repoName)
        } catch (e) {
            if (e.response.status === 401) {
                console.error(chalk.red('wrong login credentials\n'))
                cli({ reset: true, provider: provider })
                return
            } else if (e.response.status === 422) {
                console.error(
                    chalk.red(
                        `You already have a repo called ${repoName}\nTry a different repo name.\n`
                    )
                )
                cli({ reset: false, provider: provider })
                return
            } else if (e.response.status === 403) {
                console.error(
                    chalk.red(
                        `Request limit exceeded.  Try again in one hour.\n`
                    )
                )
                return
            } else {
                console.error(
                    chalk.red(
                        `something went wrong with status ${e.response.status}, try again\nmessage: ${e.response.message}\n`
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
