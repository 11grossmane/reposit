#!/usr/bin/env node
import chalk from "chalk";
import commander from "commander";
import figlet from "figlet";
import { bitbucket } from "./bitbucket";
import { github } from "./github";
import { InternalArgs, Provider } from "./types";
import { checkCache, clearCache } from "./util";

console.log(chalk.blue(figlet.textSync("Reposit\n")));

commander
    .version("1.0.0")
    .description("create a remote repo!")
    .option("-g, --github", "set remote to github")
    .option("-b, --bitbucket", "set remote to bitbucket")
    .option("-r, --reset", "remove login credentials from cache")
    .option("-d,--delete", "delete named repo")
    .parse(process.argv);

export const cli = async (internalArgs?: InternalArgs): Promise<void> => {
    let del = commander.delete;
    let reset: boolean;
    let provider: Provider;
    if (internalArgs) {
        reset = internalArgs.reset;
        provider = internalArgs.provider;
    } else {
        reset = commander.reset;
        if (commander.github && !commander.bitbucket) {
            provider = Provider.GITHUB;
        } else if (commander.bitbucket && !commander.github) {
            provider = Provider.BITBUCKET;
        } else {
            console.log(
                chalk.yellow(
                    "please use either the -g flag for github, OR the -b flag for bitbucket.  Use -h flag for more options."
                )
            );
            return;
        }
    }

    console.log(`your remote provider is set to: ${provider}\n`);

    //if reset is true wipe credentials
    reset && (await clearCache());

    //check for existing credentials
    let credentials = await checkCache();

    //enter main flows
    switch (provider) {
        case Provider.GITHUB:
            github({ credentials, del });
            break;
        case Provider.BITBUCKET:
            bitbucket({ credentials, del });
            break;
        default:
            break;
    }
};
cli();

// //If user does not have cached credentials, or he has used -r flag, ask for credential and then cache them
// if (!hasCredentials(credentials, provider, reset)) {
//     let cp: ChildProcess;
//     const spinner = ora("Authorizing...");
//     if (provider === Provider.GITHUB) {
//         cp = spawn("node", ["lib/server"], {
//             detached: true,
//             stdio: "ignore",
//         });
//         spinner.start();
//     }

//     switch (provider) {
//         case Provider.BITBUCKET:
//             const loginAnswers = await loginQuestions(provider);
//             credentials = <Credentials>{
//                 Bitbucket: {
//                     username: loginAnswers.username,
//                     password: loginAnswers.password,
//                 },
//             };
//             break;
//         case Provider.GITHUB:
//             credentials = <Credentials>{
//                 Github: {
//                     access_token: "",
//                 },
//             };
//     }
//     try {
//         if (provider === Provider.BITBUCKET && credentials.Bitbucket) {
//             await validateCredentials(credentials.Bitbucket, provider);
//         } else if (provider === Provider.GITHUB && credentials.Github) {
//             credentials = await validateCredentials(
//                 credentials.Github,
//                 provider
//             );
//             cp.kill();
//             await removeFromCache(Provider.GITHUB);
//             spinner.stop();
//         } else {
//             throwUnknownError(provider, credentials);
//         }
//     } catch (e) {
//         handleError(e, provider);
//         return;
//     }
//     console.log(
//         chalk.yellow(
//             `You are logged in with the username: ${chalk.green(
//                 `${credentials && credentials[provider]?.username}`
//             )}.  \nIf you would like to change your login credentials, please run again with the -r flag.\n`
//         )
//     );
//     const storeAnswer = await storeQuestion();

//     storeAnswer.storeLocally && (await writeToCache(credentials));
// }

// //otherwise, only ask for repo name
// console.log(
//     chalk.yellow(
//         `You are logged in with the username: ${chalk.green(
//             `${credentials && credentials[provider]?.username}`
//         )}.  \nIf you would like to change your login credentials, please run again with the -r flag.\n`
//     )
// );

// //Typecasting to make sure credentials is not null
// credentials = <Credentials>credentials;

// //asking for repo name
// let { repoName } = commander.delete
//     ? await repoNameQuestion(provider, "delete")
//     : await repoNameQuestion(provider);

// //delete flow
// if (commander.delete) {
//     let answers = await deleteQuestions(provider, repoName);

//     //Provider is github
//     if (
//         answers.delete &&
//         provider === Provider.GITHUB &&
//         credentials?.Github
//     ) {
//         try {
//             const response = await githubDelete(
//                 credentials.Github,
//                 repoName
//             );
//             console.log(chalk.green(response));
//             return;
//         } catch (e) {
//             handleError(e, provider);
//             return;
//         }
//     }

//     //Provider is bitbucket
//     else if (
//         answers.delete &&
//         provider == Provider.BITBUCKET &&
//         credentials?.Bitbucket
//     ) {
//         try {
//             const response = await bitbucketDelete(
//                 credentials.Bitbucket,
//                 repoName
//             );
//             console.log(chalk.green(response));
//             return;
//         } catch (e) {
//             handleError(e, provider);
//             return;
//         }
//     } else if (answers.delete == false) {
//         return;
//     } else {
//         try {
//             throwUnknownError(provider, credentials);
//         } catch (e) {
//             handleError(e, provider);
//             return;
//         }
//     }
// }

// //create flow

// let res: PostResponse = { repoName: "", links: [], statusCode: 0 };
// //Provider is Bitbucket
// if (provider == Provider.BITBUCKET && credentials.Bitbucket) {
//     try {
//         res = await bitbucketCreate(credentials.Bitbucket, repoName);
//     } catch (e) {
//         handleError(e, provider, repoName);
//         return;
//     }
// }

// //Provider is Github
// else if (provider == Provider.GITHUB && credentials.Github) {
//     try {
//         res = await githubCreate(credentials.Github, repoName);
//     } catch (e) {
//         handleError(e, provider, repoName);
//         return;
//     }
// }

// //Success!
// console.log(
//     chalk.green(
//         `\nRepo successfully created!\nRepo Name: ${res.repoName}\n`
//     )
// );
// console.log(
//     `Set your remote repo with https: \n${chalk.bold(
//         `git remote add origin ${res.links[0]}`
//     )} \nOr ssh:\n${chalk.bold(`git remote add origin ${res.links[1]}`)}`
// );

// //TODO make README.md
