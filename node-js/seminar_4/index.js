const express = require('express');

const { idScheme, userScheme } = require('./users/validation/schema');
const { checkParams, checkBody } = require('./users/validation/validate');

const fs = require('fs').promises;
const path = require('path');

const FILE = 'users.json';

const PATH = path.join(__dirname, 'users', FILE);

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/users', async (req, res) => {
	const users = await readUsers();
	res.send({ users });
});

app.get('/users/:id', checkParams(idScheme), async (req, res) => {
	const users = await readUsers();
	const user = users.find((item) => item.id === Number(req.params.id));
	if (user) {
		res.send({ user });
	} else {
		res.status(404).send({ user: null });
	}
});

app.post('/users', checkBody(userScheme), async (req, res) => {
	const users = await readUsers();
	const uniqueId =
		users.reduce((maxId, user) => (user.id > maxId ? user.id : maxId), 0) + 1;
	users.push({ id: uniqueId, ...req.body });
	await writeUsers(users);
	res.status(201).send({ id: uniqueId });
});

app.put(
	'/users/:id',
	checkParams(idScheme),
	checkBody(userScheme),
	async (req, res) => {
		const users = await readUsers();
		const user = users.find((item) => item.id === Number(req.params.id));
		if (user) {
			user.firstName = req.body.firstName;
			user.lastName = req.body.lastName;
			user.age = req.body.age;
			req.body.city ? (user.city = req.body.city) : delete user.city;
			await writeUsers(users);
			res.send({ user });
		} else {
			res.status(404).send({ user: null });
		}
	}
);

app.delete('/users/:id', checkParams(idScheme), async (req, res) => {
	const users = await readUsers();
	const user = users.find((item) => item.id === Number(req.params.id));
	if (user) {
		const deleteUserPos = users.indexOf(user);
		users.splice(deleteUserPos, 1);
		await writeUsers(users);
		res.status(204).send({});
	} else {
		res.status(404).send({ user: null });
	}
});

app.use((req, res) => {
	res.status(404).send({ message: `Ошибка 404, путь ${req.url} не найден!` });
});

app.listen(PORT, () => {
	console.log(`Сервер запущен на порту ${PORT}`);
	console.log(PATH);
});

async function readUsers() {
	try {
		await fs.access(PATH, fs.constants.F_OK);
	} catch (error) {
		await fs.writeFile(PATH, JSON.stringify({}));
		return [];
	}
	const users = await fs.readFile(PATH, 'utf-8');
	return JSON.parse(users);
}

async function writeUsers(users) {
	await fs.writeFile(PATH, JSON.stringify(users, null, 2));
}
