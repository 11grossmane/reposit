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

// export const questionsWithLogin = async (
//     provider: Provider
// ): Promise<Answers> => {
//     return await inquirer.prompt([
//         {
//             name: 'username',
//             message: `${provider} username: `,
//             type: 'input'
//         },
//         {
//             name: 'password',
//             message: `${provider} password: `,
//             type: 'password'
//         },
//         {
//             name: 'repoName',
//             message: `What is the name of your new ${provider} repo?`,
//             type: 'input'
//         }
//     ])
// }
export const repoNameQuestion = async (
    provider: Provider,
    toDelete: 'delete' | '' = ''
): Promise<Answers> => {
    let message = `What is the name of your new ${provider} repo?`
    if (toDelete === 'delete') {
        message = `What is the name of the repo you would like to delete from ${provider}`
    }
    return await inquirer.prompt([
        {
            name: 'repoName',
            message: message,
            type: 'input'
        }
    ])
}

export const deleteQuestions = async (
    provider: Provider,
    repoName: string
): Promise<Answers> => {
    return await inquirer.prompt([
        {
            name: 'delete',
            message: `Are you sure you want to delete your ${provider} repo: ${repoName}?  This action cannot be undone.`,
            type: 'confirm'
        }
    ])
}
