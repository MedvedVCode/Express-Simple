const Joi = require('joi');

const idScheme = Joi.object({
	id: Joi.number().required(),
});

const userScheme = Joi.object({
	firstName: Joi.string().min(1).required(),
	lastName: Joi.string().min(1).required(),
	age: Joi.number().greater(-1).less(151).required(),
	city: Joi.string().min(1),
});

module.exports = { idScheme, userScheme };
