#!/usr/bin/env node
import figlet from 'figlet'
import chalk from 'chalk'
import commander from 'commander'
import { Provider, DATAPATH, Credentials, Answers } from './types'
import { checkCache, writeToCache } from './util'
import { questionsWithLogin } from './questions'

console.log(chalk.blue(figlet.textSync('Reposit\n')))

writeToCache(<Credentials>{
    username: '11grossmane',
    password: 'something'
})
checkCache()

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
    console.log(`you have set your remote to: ${provider}`)
    const credentials: Credentials | null = checkCache()

    if (!credentials) {
        const answers: Answers = await questionsWithLogin(provider)
        writeToCache(<Credentials>{
            username: answers.username,
            password: answers.password
        })
        //TODO call github repo
    }
}
cli()
