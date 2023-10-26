const express = require('express');
const fs = require('fs');
const path = require('path');

const countsFileName = 'counts.json';

let counts = null;

const fullPath = path.join(__dirname, countsFileName);

fs.readFile(fullPath, 'utf-8', (err, data) => {
	if (err) {
		console.error(err);
	} else {
		console.log(`Файл прочитан ${countsFileName} ->`, data);
		counts = JSON.parse(data);
		console.log('Из fs.read ->', counts);
	}
});

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
	console.log('Поступил запрос', req.method, req.url);
	next();
});

app.get('/', (req, res) => {
	counts.index += 1;
	res.send(
		`<h1>Добро пожаловать на страничку Index</h1>
		<a href="/about">About</a>
		<p>Всего посещений странички Index: ${counts.index}`
	);
	writeCounts(counts);
});

app.get('/about', (req, res) => {
	counts.about += 1;
	res.send(
		`<h1>Добро пожаловать на страничку about</h1>
		<a href="/">Index</a>
		<p>Всего посещений странички About: ${counts.about}`
	);
	writeCounts(counts);
});

app.listen(PORT, () => {
	console.log(`Сервер запущен на порту  ${PORT}`);
});

function writeCounts(counts) {
	fs.writeFile(fullPath, JSON.stringify(counts, null, 2), (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`Файл ${countsFileName} записан!`);
		}
	});
}
