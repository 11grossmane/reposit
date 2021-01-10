import express from "express";
import axios from "axios";
import { getGithubUser, writeToCache } from "./util";
const app = express();
const port = 9000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/github-redirect", async (req, res) => {
    const {
        data: { id, sec },
    } = await axios.get("https://reposit-server.herokuapp.com/creds");
    const { data } = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id: id,
            client_secret: sec,
            code: req.query["code"],
            accept: "json",
        },
        {
            headers: {
                Accept: "application/json",
            },
        }
    );

    let username = await getGithubUser({ access_token: data["access_token"] });
    console.log("username is", username);
    await writeToCache({
        Github: {
            access_token: data["access_token"],
            username,
        },
    });
    server.close();
});

export const server = app.listen(9000, () => {
    console.log("listening on 9000");
});
