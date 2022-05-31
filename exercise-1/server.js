'use strict';
import express from 'express';
import path from 'path';
const __dirname = path.resolve();

const app = express();
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
});

const PORT = 3000;
export const server = app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});
