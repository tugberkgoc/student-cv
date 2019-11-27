/* eslint-disable linebreak-style */
'use strict'

const Accounts = require('../modules/user.js')

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('doej', 'email@email.com', '07900568473', 'password')
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password')
		await expect(account.register('doej', 'email@email.com', '07900568473', 'password'))
			.rejects.toEqual(Error('username "doej" already in use'))
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect(account.register('', 'email@email.com', 'password'))
			.rejects.toEqual(Error('missing username'))
		done()
	})

	test('error if blank email', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect(account.register('username', '', 'password'))
			.rejects.toEqual(Error('missing email'))
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect(account.register('doej', 'email@email.com', '07900568473', ''))
			.rejects.toEqual(Error('The password is missing.'))
		done()
	})

	test('error if password is too short', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect(account.register('doej', 'email@email.com', '07900568473', 'pas'))
			.rejects.toEqual(Error('password is too short'))
		done()
	})

	
	test('error if phone number is missing', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect(account.register('doej', 'email@email.com', '', 'pas'))
			.rejects.toEqual(Error('Missing Phone Number'))
		done()
	})

	test('error if phone number is less than 11 digits', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect(account.register('doej', 'email@email.com', '0777889', 'pas'))
			.rejects.toEqual(Error('Phone Number Invalid (length 11)'))
		done()
	})


})

//describe('uploadPicture()', () => {
// this would have to be done by mocking the file system
// perhaps using mock-fs?
//})

describe('login()', () => {
	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password')
		const valid = await account.login('doej', 'password')
		expect(valid).toBe(1)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password')
		await expect(account.login('roej', 'password'))
			.rejects.toEqual(Error('Username "roej" not found'))
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password')
		await expect(account.login('doej', 'bad'))
			.rejects.toEqual(Error('Invalid password for account "doej"'))
		done()
	})

})

describe('getUserUsingID()', () => {
	test('get user with using his/her id', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password')
		const valid = await account.getUserUsingID(1)
		expect(valid.id).toBe(1)
		done()
	})

	test('get user with using his/her id', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password')
		await expect(account.getUserUsingID(''))
		.rejects.toEqual(Error('missing parametere'))
		
		done()
	})
})




describe('getUserEmailWithUsingId()', () => {
	test('get user email with using his/her id', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password')
		const valid = await account.getUserEmailWithUsingId(1)
		expect(valid.email).toBe('email@email.com')
		done()
	})

	test('get user email with using his/her id', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password')
		await expect(account.getUserEmailWithUsingId(''))
		.rejects.toEqual(Error('Can not user email with using user id.'))
		
		done()
	})

})

describe('sendEmail()', () => {
	test('send an email as a contact', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password')
		await account.register('jack', 'jack@gmail.com', '07900322323', 'jack1997')
		const valid = await account.sendEmail('email@email.com', 'jack@gmail.com', {})
		expect(valid).toBe(true)
		done()
	})


	test('error occured, when trying tosend an email as a contact', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password')
		await expect(account.sendEmail('email@email.com', '',))
		.rejects.toEqual(Error('There is an error occurred, when send an email.'))
		done()
	})

})
