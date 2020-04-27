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

export const questionsWithLogin = async (
    provider: Provider
): Promise<Answers> => {
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
        },
        {
            name: 'repoName',
            message: `What is the name of your new ${provider} repo?`,
            type: 'input'
        }
    ])
}
export const questionsIfCachedLogin = async (
    provider: Provider
): Promise<Answers> => {
    return await inquirer.prompt([
        {
            name: 'repoName',
            message: `What is the name of your new ${provider} repo?`,
            type: 'input'
        }
    ])
}
