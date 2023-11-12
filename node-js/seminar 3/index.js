const express = require('express');
const fs = require('fs');
const path = require('path');

const countsFileName = 'counts.json';

const fullPath = path.join(__dirname, countsFileName);

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
	let counts = {};
	console.log('Поступил запрос', req.method, req.url);
	try {
		fs.accessSync(fullPath, fs.constants.F_OK);
		console.log(`Файл ${countsFileName} может быть прочитан!`);
		try {
			counts = JSON.parse(fs.readFileSync(fullPath));
			console.log(`Файл ${countsFileName} успешно прочитан!`);
		} catch (error) {
			console.log(error);
		}
		if (counts[req.url]) {
			counts[req.url] += 1;
			writeCounts(counts);
		} else {
			counts[req.url] = 1;
			writeCounts(counts);
		}
	} catch (error) {
		console.error(`Файл ${countsFileName} не существует, создаем его!`);
		counts[req.url] = 1;
		writeCounts(counts);
	}
	req.viewCounts = counts[req.url];
	next();
});

app.get('/', (req, res) => {
	res.send(
		`<h1>Добро пожаловать на страничку Index</h1>
		<a href="/about">About</a>
		<a href="/contacts">Contacts</a>

		<p>Всего посещений странички Index: ${req.viewCounts}`
	);
});

app.get('/about', (req, res) => {
	res.send(
		`<h1>Добро пожаловать на страничку about</h1>
		<a href="/">Index</a>
		<a href="/contacts">Contacts</a>
		<p>Всего посещений странички About: ${req.viewCounts}`
	);
});

app.get('/contacts', (req, res) => {
	res.send(
		`<h1>Добро пожаловать на страничку about</h1>
		<a href="/">Index</a>
		<a href="/about">About</a>
		<p>Всего посещений странички Contacts: ${req.viewCounts}`
	);
});

app.listen(PORT, () => {
	console.log(`Сервер запущен на порту ${PORT}`);
});

function writeCounts(counts) {
	try {
		fs.writeFileSync(fullPath, JSON.stringify(counts, null, 2), 'utf-8');
		console.log('Counts = ', counts);
		console.log(`Файл ${countsFileName} успешно записан!`);
	} catch (error) {
		console.log(error);
	}
}
