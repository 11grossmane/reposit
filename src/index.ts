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
    InternalArgs,
    GithubCredentials
} from './types'
import {
    checkCache,
    writeToCache,
    hasCredentials,
    bitbucketCreate,
    validateCredentials,
    githubCreate,
    handleError,
    throwUnknownError,
    bitbucketDelete,
    githubDelete
} from './util'
import { loginQuestions, repoNameQuestion, deleteQuestions, storeQuestion } from './questions'
import inquirer from 'inquirer'

console.log(chalk.blue(figlet.textSync('Reposit\n')))

commander
    .version('1.0.0')
    .description('create a remote repo!')
    .option('-g, --github', 'set remote to github')
    .option('-b, --bitbucket', 'set remote to bitbucket')
    .option('-r, --reset', 'remove login credentials from cache')
    .option('-d,--delete', 'delete named repo')
    .parse(process.argv)

export const cli = async (internalArgs?: InternalArgs): Promise<void> => {
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
                throwUnknownError(provider, credentials)
            }
        } catch (e) {
            handleError(e, provider)
            return
        }

        const storeAnswer = await storeQuestion()

        storeAnswer.storeLocally && writeToCache(credentials)
    }

    //otherwise, only ask for repo name
    console.log(
        chalk.yellow(
            `You are logged in with the username: ${chalk.green(
                `${credentials && credentials[provider]?.username}`
            )}.  \nIf you would like to change your login credentials, please run again with the -r flag.\n`
        )
    )

    //Typecasting to make sure credentials is not null
    credentials = <Credentials>credentials

    //asking for repo name
    let { repoName } = commander.delete
        ? await repoNameQuestion(provider, 'delete')
        : await repoNameQuestion(provider)

    //delete flow

    //Provider is github
    if (commander.delete) {
        let answers = await deleteQuestions(provider, repoName)
        if (answers.delete && provider === Provider.GITHUB && credentials?.Github) {
            try {
                const response = await githubDelete(credentials.Github, repoName)
                console.log(chalk.green(response))
                return
            } catch (e) {
                handleError(e, provider)
                return
            }
        }

        //Provider is bitbucket
        else if (answers.delete && provider == Provider.BITBUCKET && credentials?.Bitbucket) {
            try {
                const response = await bitbucketDelete(credentials.Bitbucket, repoName)
                console.log(chalk.green(response))
                return
            } catch (e) {
                handleError(e, provider)
                return
            }
        } else if (answers.delete == false) {
            return
        } else {
            try {
                throwUnknownError(provider, credentials)
            } catch (e) {
                handleError(e, provider)
                return
            }
        }
    }

    //create flow

    let res: PostResponse = { repoName: '', links: [], statusCode: 0 }
    //Provider is Bitbucket
    if (provider == Provider.BITBUCKET && credentials.Bitbucket) {
        try {
            res = await bitbucketCreate(credentials.Bitbucket, repoName)
        } catch (e) {
            handleError(e, provider, repoName)
            return
        }
    }

    //Provider is Github
    else if (provider == Provider.GITHUB && credentials.Github) {
        try {
            res = await githubCreate(credentials.Github, repoName)
        } catch (e) {
            handleError(e, provider, repoName)
            return
        }
    }

    //Success!
    console.log(chalk.green(`\nRepo successfully created!\nRepo Name: ${res.repoName}\n`))
    console.log(
        `Set your remote repo with https: \n${chalk.bold(
            `git remote add origin ${res.links[0]}`
        )} \nOr ssh:\n${chalk.bold(`git remote add origin ${res.links[1]}`)}`
    )

    //TODO make README.md
}
cli()
