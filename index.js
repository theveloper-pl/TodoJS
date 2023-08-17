import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';

let todos = []

const app = express()
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let todos_file = __dirname + '/todos.json'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.set('view engine', 'ejs');
app.use(express.static("public"))


async function startServer() {
    todos = await get_todos_from_file();
    console.log(`Express started on port ${port}`);
}


async function get_todos_from_file() {
    try {
        const data = await fs.promises.readFile(todos_file, 'utf8');
        return JSON.parse(data)["todos"];
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function save_todos_to_file() {
    const content = JSON.stringify({ todos: todos });
    try {
        await fs.promises.writeFile(todos_file, content);
    } catch (err) {
        console.error(err);
    }
}


app.get('/', function (req, res) {
    res.locals = {todos}
    res.render('index.ejs')
});


app.post('/update/:id', async function(req, res) {
    const todoId = parseInt(req.params.id, 10);
    if (todos[todoId]) {
        todos[todoId].is_done = !(todos[todoId].is_done);
        await save_todos_to_file();
        res.json({ success: true });
    } else {
        res.json({ success: false, error: "Todo not found" });
    }
});

app.post('/add', async function(req, res) {
    const newTodo = {
        title: req.body["todo-title"],
        is_done: false,
    }

    if(newTodo.title.length > 3){
        todos.push(newTodo);
        await save_todos_to_file();
    }
    res.redirect('/');
});





app.listen(port, () => startServer())
