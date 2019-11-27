'use strict'

const Cvs = require('../modules/cv.js')
const Accounts = require('../modules/user.js')

describe('cvObj()', () => {

	test('create a cv object', async done => {
		expect.assertions(2)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		// eslint-disable-next-line max-len
		const body = {name: 'doej', addressLine1: 'Oxford Street', addressLine2: 'Aldbourne Road', postcode: 'CV14EQ', ref: 'Reference', usersWords: 'Some words', Country: 'UK', skills: 'JAVA, PHP and JavaScript', summary: 'A short summary'}
		const cvObject = await cv.cvObj(1, body)
		expect(cvObject.userID).toBe(1)
		expect(cvObject.name).toBe('doej')
		done()
	})

})

describe('edit()', () => {

	test('edit cv data', async done => {
		expect.assertions(2)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		// eslint-disable-next-line max-len
		const cvData = {userID: 1, name: 'doej', addressLine1: 'Oxford Street', addressLine2: 'Aldbourne Road', postcode: 'CV14EQ', ref: 'Reference', usersWords: 'Some words', Country: 'UK', skills: 'JAVA, PHP and JavaScript', summary: 'A short summary'}
		const cvObject = await cv.edit(cvData)
		cvData.name = 'jack'
		cvData.postcode = 'CV11AF'
		const updatedCvObject = await cv.edit(cvData)
		expect(cvObject).toBe(true)
		expect(updatedCvObject).toBe(true)
		done()
	})

})

describe('cvPull()', () => {

	test('pull cv data', async done => {
		expect.assertions(2)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		// eslint-disable-next-line max-len
		const cvData = {userID: 1, name: 'doej', addressLine1: 'Oxford Street', addressLine2: 'Aldbourne Road', postcode: 'CV14EQ', ref: 'Reference', usersWords: 'Some words', Country: 'UK', skills: 'JAVA, PHP and JavaScript', summary: 'A short summary'}
		await cv.edit(cvData)
		const cvObject = await cv.cvPull(1)
		expect(cvObject.name).toBe('doej')
		expect(cvObject.postcode).toBe('CV14EQ')
		done()
	})

	test('pull not exist cv data', async done => {
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		const cvObject = await cv.cvPull(1)
		expect(cvObject).toBe(false)
		done()
	})

})

