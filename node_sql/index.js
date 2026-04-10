const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql2');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

// CONFIGURAÇÃO DA CONEXÃO 
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'teste34',
});

// 1. HOME
app.get('/', (req, res) => {
  res.render('layouts/home');
});

// 2. INSERIR
app.post('/teste/insertteste', (req, res) => {
    const { nome, email, senha } = req.body;
    const sql = `INSERT INTO teste (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}')`;
    
    conn.query(sql, function(err){
        if (err) { console.log(err); return; }
        res.redirect('/teste');
    });
});

// 3. LISTAR
app.get('/teste', (req, res)=> {
  const sql = "SELECT * FROM teste";
  conn.query(sql, function(err, data){
    if (err) { console.log(err); return; }
    res.render('layouts/teste', { teste: data });
  });
});

// 4. BUSCAR PARA EDITAR (GET)
app.get('/teste/edit/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM teste WHERE id = ?`;

    conn.query(sql, [id], (err, data) => {
        if (err) { console.log(err); return; }
        const registro = data[0]; 
        res.render('upd', { registro }); 
    });
});

// 5. SALVAR EDIÇÃO (POST)
app.post('/teste/update', (req, res) => {
    const { id, nome, email, senha } = req.body;
    const sql = `UPDATE teste SET nome = ?, email = ?, senha = ? WHERE id = ?`;

    conn.query(sql, [nome, email, senha, id], (err) => {
        if (err) { console.log(err); return; }
        res.redirect('/teste');
    });
});

// 6. EXCLUIR (POST)
app.post('/teste/remove/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM teste WHERE id = ?`;

    conn.query(sql, [id], (err) => {
        if (err) { console.log(err); return; }
        res.redirect('/teste');
    });
});

conn.connect(function(err) {
  if (err) { console.log(err); return; }
  console.log('Conectado ao MySQL');
  app.listen(3000, () => console.log("Servidor em http://localhost:3000"));
});