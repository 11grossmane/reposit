import inquirer from 'inquirer'
import { Answers, Provider, Credentials } from './types'

export const loginQuestions = async (provider: Provider): Promise<Answers> => {
    return await inquirer.prompt([
        {
            name: 'username',
            message: `${provider} username: `,
            type: 'input'
        },
        {
            name: 'password',
            message: `${provider} password: `,
            type: 'password'
        }
    ])
}

export const repoNameQuestion = async (
    provider: Provider,
    toDelete: 'delete' | '' = ''
): Promise<Answers> => {
    let message = `What is the name of your new ${provider} repo?`
    if (toDelete === 'delete') {
        message = `What is the name of the repo you would like to \x1b[31mdelete\x1b[0m\u001b[1m from ${provider}?`
    }
    return await inquirer.prompt([
        {
            name: 'repoName',
            message: message,
            type: 'input'
        }
    ])
}

export const storeQuestion = async (): Promise<Answers> => {
    return await inquirer.prompt([
        {
            name: 'storeLocally',
            message: `Do you want to store encrypted credentials on your device for auto-login?`,
            type: 'confirm'
        }
    ])
}

export const deleteQuestions = async (provider: Provider, repoName: string): Promise<Answers> => {
    return await inquirer.prompt([
        {
            name: 'delete',
            message: `Are you sure you want to \x1b[31mdelete\x1b[0m\u001b[1m your ${provider} repo: ${repoName}?  This action cannot be undone.`,
            type: 'confirm'
        }
    ])
}
