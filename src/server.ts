import express from "express";
import axios from "axios";
import { getGithubUser, writeToCache } from "./util";
import jwt from "jsonwebtoken";
const app = express();
const port = 9000;

const token = jwt.sign({ app: "reposit" }, "floppydisk");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/github-redirect", async (req, res) => {
    try {
        const {
            data: { id, sec },
        } = await axios.get("https://reposit-server.herokuapp.com/creds", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const { data, status, } = await axios.post(
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
        writeToCache({
            Github: {
                access_token: data['access_token'],
                username
            },
        });
        res.send(`
            <!DOCTYPE html>
            <html>
            <body>
            <h1>Authorized</h1>
            <h2>You can return to your terminal.</h2>
            </body>
            </html>
    `);
    } catch (e) {
        res.setHeader("Content-Type", "text/html");
        res.status(500)
        console.log(e)
        res.send(e.message)
    }
    server.close();
});

export const server = app.listen(9000, () => {
    // console.log("listening on 9000");
});
