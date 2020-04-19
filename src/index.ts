#!/usr/bin/env node
import figlet from 'figlet'
import chalk from 'chalk'
import commander from 'commander'
import { Provider, DATAPATH, Credentials, Answers, PostResponse } from './types'
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

const cli = async (): Promise<void> => {
    let provider: Provider
    if (commander.github && !commander.bitbucket) {
        provider = Provider.GITHUB
    } else if (commander.bitbucket && !commander.github) {
        provider = Provider.BITBUCKET
    } else {
        console.log(
            chalk.yellow(
                'please use either the -g flag for github, OR the -b flag for bitbucket'
            )
        )
        return
    }

    console.log(`your remote provider is set to: ${provider}`)
    let credentials = checkCache()

    let repoName: string
    if (!hasCredentials(credentials, provider, commander.reset)) {
        const answers: Answers = await questionsWithLogin(provider)
        credentials = <Credentials>{
            [provider]: {
                username: answers.username,
                password: answers.password
            }
        }
        writeToCache(credentials)
        repoName = answers.repoName
    } else {
        console.log(
            chalk.yellow(
                `You are logged in with the username: ${chalk.green(
                    `${credentials && credentials[provider]?.username}`
                )}.  \nIf you would like to change your login credentials, please run again with the -r flag.`
            )
        )
        const answers: Answers = await questionsIfCachedLogin(provider)
        repoName = answers.repoName
    }

    credentials = <Credentials>credentials
    //calling bitbucket
    let res: PostResponse = { repoName: '', links: [], statusCode: 0 }
    if (provider == Provider.BITBUCKET && credentials.Bitbucket) {
        try {
            res = await bitbucketCreate(credentials.Bitbucket, repoName)
        } catch (e) {
            console.error(
                chalk.red(
                    `status: ${e.response.status},\nmessage:${e.response.data.error.message}`
                )
            )
            return
        }
    } else if (provider == Provider.GITHUB && credentials.Github) {
        try {
            res = await githubCreate(credentials.Github, repoName)
        } catch (e) {
            console.error(
                chalk.red(
                    `status: ${e.response.status},\nmessage:${e.response.data.error.message}`
                )
            )
            return
        }
    }
    console.log(
        chalk.green(`Repo successfully created!\nRepo Name: ${res.repoName}`)
    )
    console.log(chalk.yellowBright('---------------'))
    console.log(
        chalk.magentaBright(
            `Set your remote repo with https: \ngit remote add origin ${res.links[0]} \nOr ssh:\ngit remote add origin ${res.links[1]}`
        )
    )

    //TODO start over if repo is already created
    //TODO handle wrong username and password error
    //TODO call github api
}
cli()
