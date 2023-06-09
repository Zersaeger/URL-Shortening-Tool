import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const db = await open({
    driver: sqlite3.Database,
    filename: "database.sqlite"
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { message: "" });
});
app.post('/', async (req, res) => {
    const data = req.body;
    const newurl = Math.floor(Math.random() * 1000000);
    await db.run('INSERT INTO URLs (origin, new) VALUES (?,?)', data.url, newurl);
    res.render('index', { message: "Here is your new URL: " + newurl.toString() });
});

app.get('/:url', async (req, res) => {
    const data = await db.get('SELECT origin FROM URLs WHERE new = ?', req.params.url);
    res.redirect(addhttp(data));
});

function addhttp(data) {
    if (!data.origin.startsWith('https://')) {
        return "https://" + data.origin;
    }
    return data.origin;
}
app.listen('3000');