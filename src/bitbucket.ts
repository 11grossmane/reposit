#!/usr/bin/env node
import chalk from "chalk";
import commander from "commander";
import {
    deleteQuestions,
    loginQuestions,
    repoNameQuestion,
    storeQuestion,
} from "./questions";
import { Credentials, PathArgs, PostResponse, Provider } from "./types";
import {
    bitbucketCreate,
    bitbucketDelete,
    handleError,
    hasCredentials,
    throwUnknownError,
    validateCredentials,
    writeToCache,
} from "./util";

export const bitbucket = async ({ credentials, del = false }: PathArgs) => {
    const provider = Provider.BITBUCKET;
    if (!hasCredentials(credentials, provider)) {
        const loginAnswers = await loginQuestions(provider);
        credentials = <Credentials>{
            Bitbucket: {
                username: loginAnswers.username,
                password: loginAnswers.password,
            },
        };
        try {
            await validateCredentials(credentials.Bitbucket, provider);
        } catch (e) {
            handleError(e, provider);
            return;
        }

        const storeAnswer = await storeQuestion();

        storeAnswer.storeLocally && (writeToCache(credentials));
    }

    //otherwise, only ask for repo name
    console.log(
        chalk.yellow(
            `You are logged in with the username: ${chalk.green(
                `${credentials && credentials[provider]?.username}`
            )}.  \nIf you would like to change your login credentials, please run again with the -r flag.\n`
        )
    );

    //asking for repo name
    let { repoName } = commander.delete
        ? await repoNameQuestion(provider, "delete")
        : await repoNameQuestion(provider);

    if (del) {
        let answers = await deleteQuestions(provider, repoName);
        switch (answers.delete) {
            case true:
                try {
                    const response = await bitbucketDelete(
                        credentials.Bitbucket,
                        repoName
                    );
                    console.log(chalk.green(response));
                    return;
                } catch (e) {
                    handleError(e, provider);
                    return;
                }
            case false:
                return;
            default:
                try {
                    throwUnknownError(provider, credentials);
                } catch (e) {
                    handleError(e, provider);
                    return;
                }
                break;
        }
    }

    //create flow
    let res: PostResponse = { repoName: "", links: [], statusCode: 0 };
    try {
        res = await bitbucketCreate(credentials.Bitbucket, repoName);

        //Success!
        console.log(
            chalk.green(
                `\nRepo successfully created!\nRepo Name: ${res.repoName}\n`
            )
        );
        console.log(
            `Set your remote repo with https: \n${chalk.bold(
                `git remote add origin ${res.links[0]}`
            )} \nOr ssh:\n${chalk.bold(
                `git remote add origin ${res.links[1]}`
            )}`
        );
    } catch (e) {
        handleError(e, provider, repoName);
        return;
    }
};
