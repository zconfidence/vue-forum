let express = require('express')
let router = express.Router()

const Errors = require('../lib/errors.js')
let User = require('../models').User

router.post('/', async (req, res) => {
	let user, validationErrors = [];

	try {
		//Validations
		if(req.body.username === undefined) {
			validationErrors.push(Errors.missingParameter('username'))
		} else {
			if(typeof req.body.username !== 'string') {
				validationErrors.push(Errors.invalidParameterType('username', 'string'))
			} if(req.body.username.length < 6) {
				validationErrors.push(Errors.parmeterLengthTooSmall('username', 6))
			} if(req.body.username.length > 50) {
				validationErrors.push(Errors.parmeterLengthTooLarge('username', 50))
			}
		}

		if(req.body.password === undefined) {
			validationErrors.push(Errors.missingParameter('password'))
		} else {
			if(typeof req.body.password !== 'string') {
				validationErrors.push(Errors.invalidParameterType('password', 'string'))
			} if(req.body.password.length < 6) {
				validationErrors.push(Errors.parmeterLengthTooSmall('password', 6))
			} if(req.body.password.length > 100) {
				validationErrors.push(Errors.parmeterLengthTooSmall('password', 100))
			}
		}

		if(errors.length) throw Errors.VALIDATION_ERROR

		user = await User.create({
			username: req.body.username,
			hash: req.body.password
		})

		res.json(user.toJSON())
	} catch (err) {
		if(err === Errors.VALIDATION_ERROR) {
			res.status(400)
			res.json({
				errors: validationErrors
			})
		} else {
			res.json(err)
		}
	}
})

module.exports = router