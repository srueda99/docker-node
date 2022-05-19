// --- IMPORTS ---
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// --- SERVER ---
// Corre el servidor por el puerto especificado en la variable de entorno
const app = express();
const port = process.env.PORT || 4040;
app.listen(port, () => {
	console.log('****************************');
    console.log(`Servidor corriendo en el puerto: ${port}`);
});

// --- MIDDLEWARES DE SESIÓN ---
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- RENDER ---
// Renderiza la página html del login
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'./views/index.html'));
});

// Página de management
app.get('/management', (req,res) => {
	if (req.session.loggedin) {
		console.log('******************');
		console.log('Ingreso exitoso');
		return res.sendFile(path.join(__dirname,'./views/management.html'));
	}
	else {
		res.send('Primero debe identificarse para poder acceder a este sitio.');
		console.log('****************************');
		console.log('-- Solicitud no autorizada --');
	}
	res.end();
});

// Usa la carpeta 'public' como carpeta de plantillas por defecto
app.use(express.static(path.join(__dirname, 'public')));

// --- DB CONNECTION ---
// Establece las credenciales de conexión a la base de datos MySQL
const cxn = mysql.createConnection({
    host: process.env.DB_HOST,
	database: process.env.DB_SCHEMA,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Prueba que la conexión funcione a MySQL funcione
cxn.connect(function(err) {
    if (err) throw err;
	console.log('**************************');
    console.log("Conectado a la base de datos.");
});

// --- LOGIN ROUTE ---
app.post('/login', (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		cxn.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
			if (error) throw error;

			if (results.length == 1) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/management');
            }
            else {
				res.send('Login fallido');
				console.log('***************');
				console.log('Login fallido')
			}			
			res.end();
		});
	}
    else {
		res.send('Por favor, ingrese el usuario y la clave.');
		res.end();
	}
});

// --- CREATE ROUTE ---
app.post('/create', (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		cxn.query('INSERT INTO users(username, password) VALUES(?, ?)', [username, password], (error, results) => {
			if (error) throw error;

			if (results) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/management');
				console.log('Usuario creado exitosamente.');
            }
            else {
				res.send('No se pudo crear el usuario.');
				console.log('***************');
				console.log('No se pudo crear el usuario, error de la base de datos.');
			}			
			res.end();
		});
	}
    else {
		res.send('Por favor ingrese el usuario y la clave para el nuevo usuario.');
		res.end();
	}
});

// --- RESET ROUTE ---
app.post('/reset', (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		cxn.query('UPDATE users SET password = ? WHERE username = ?', [password, username], (error, results) => {
			if (error) throw error;

			if (results) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/management');
				console.log('Contraseña actualizada exitosamente.');
            }
            else {
				res.send('No se pudo actualizar la contraseña.');
				console.log('***************');
				console.log('No se pudo actualizar la contraseña, error de la base de datos.');
			}			
			res.end();
		});
	}
    else {
		res.send('Por favor, ingrese el usuario y la nueva contraseña.');
		res.end();
	}
});

// --- DELETE ROUTE ---
app.post('/delete', (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	if (username) {
		cxn.query('DELETE FROM users WHERE username = ?', [username], (error, results) => {
			if (error) throw error;

			if (results) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/management');
				console.log('Usuario borrado exitosamente.');
            }
            else {
				res.send('No se pudo borrar el usuario.');
				console.log('***************');
				console.log('No se pudo borrar el usuario, error de la base de datos.');
			}			
			res.end();
		});
	}
    else {
		res.send('Por favor, escriba el usuario a borrar.');
		res.end();
	}
});