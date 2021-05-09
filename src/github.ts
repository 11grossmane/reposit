import chalk from "chalk";
import { spawn } from "child_process";
import commander from "commander";
import ora from "ora";
import path from "path";
import { deleteQuestions, repoNameQuestion, storeQuestion } from "./questions";
import { PathArgs, Provider } from "./types";
import {
    checkGithubAuthExpiration,
    githubCreate,
    githubDelete,
    handleError,
    hasCredentials,
    removeFromCache,
    throwUnknownError,
    validateCredentials,
    writeToCache,
} from "./util";

export const github = async ({ credentials, del = false }: PathArgs) => {
    credentials = await checkGithubAuthExpiration(credentials);
    let provider = Provider.GITHUB;
    if (!hasCredentials(credentials, provider)) {
        const spinner = ora("Authorizing...");

        let base = path.basename(path.dirname(__filename));
        let cmd = base === "src" ? "ts-node" : "node";
        let executePath = base === "src" ? "src/server" : "lib/server";

        let cp = spawn(cmd, [executePath], {
            detached: true,
            shell: true
        });
        cp.stdout.on('data', (data) => {
            console.log(data.toString())
        })
        spinner.start();

        setTimeout(() => {
            !cp.killed && cp.kill();
        }, 8000);

        try {
            credentials = await validateCredentials(null, provider);
            cp.kill();
            await removeFromCache(provider);
            spinner.stop();
        } catch (e) {
            handleError(e, provider);
            return;
        }

        //if we are just getting credentials, display login and then ask if they want to store
        console.log(
            chalk.yellow(
                `You are logged in with the username: ${chalk.green(
                    `${credentials?.Github?.username}`
                )}.  \nIf you would like to change your login credentials, please run again with the -r flag.\n`
            )
        );
        const storeAnswer = await storeQuestion();
        storeAnswer.storeLocally && (writeToCache(credentials));
    } else {
        //otherwise just display login
        console.log(
            chalk.yellow(
                `You are logged in with the username: ${chalk.green(
                    `${credentials?.Github?.username}`
                )}.  \nIf you would like to change your login credentials, please run again with the -r flag.\n`
            )
        );
    }

    //asking for repo name
    let { repoName } = commander.delete
        ? await repoNameQuestion(provider, "delete")
        : await repoNameQuestion(provider);

    //delete flow
    if (del) {
        let answers = await deleteQuestions(provider, repoName);
        switch (answers.delete) {
            case true:
                try {
                    const response = await githubDelete(
                        credentials.Github,
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
    try {
        let res = await githubCreate(credentials.Github, repoName);
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
