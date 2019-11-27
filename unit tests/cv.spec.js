/* eslint-disable linebreak-style */
'use strict'

const Cvs = require('../modules/cv.js')
const Accounts = require('../modules/user.js')

describe('cvObj()', () => {

	test('create a cv object', async done => {
		expect.assertions(2)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		const body = {
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
		const cvObject = await cv.cvObj(1, body)
		expect(cvObject.userID).toBe(1)
		expect(cvObject.name).toBe('doej')
		done()
	})

	test('when creating an object, error is occurred', async done => {
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		await expect(cv.cvObj()).rejects.toEqual(Error('There is no id and body.'))
		done()
	})

})

describe('edit()', () => {

	test('edit cv data', async done => {
		expect.assertions(2)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		const cvData = {
			userID: 1,
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
		const cvObject = await cv.edit(cvData)
		cvData.name = 'jack'
		cvData.postcode = 'CV11AF'
		const updatedCvObject = await cv.edit(cvData)
		expect(cvObject).toBe(true)
		expect(updatedCvObject).toBe(true)
		done()
	})

	test('when editing cv, error is occurred', async done => {
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		await expect(cv.edit()).rejects.toEqual(Error('There is no cv data for editing.'))
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
		const cvData = {
			userID: 1,
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
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

	test('pull cv data', async done => {
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		// eslint-disable-next-line max-len
		const cvData = {
			userID: 1,
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
		await cv.edit(cvData)
		await expect(cv.cvPull('')).rejects.toEqual(Error('the param is missing'))
		done()
	})

})


describe('getCVUsingUserID()', () => {

	test('passing valid id', async done => {
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		const cvData = {
			userID: 1,
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
		await cv.edit(cvData)
		const getCVID = await cv.getCVUsingUserID(1)
		expect(getCVID.name).toBe('doej')
		done()
	})

	test('when is not valid', async done => {
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		const cvData = {
			userID: 1,
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
		await cv.edit(cvData)
		await expect(cv.getCVUsingUserID()).rejects.toEqual(Error('Can not get cv data.'))
		done()
	})

	test('missing parameter', async done => {
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		const cvData = {
			userID: 1,
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
		await cv.edit(cvData)
		const valid = await cv.getCVUsingUserID(0)
		expect(valid).toBe(false)
		done()
	})
})


describe('getDataUsingParamsID', () => {

	test('passing valid param id', async done => {
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		const cvData = {
			userID: 1,
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
		await cv.edit(cvData)
		const ParamsData = await cv.getDataUsingParamsID(1)
		expect(ParamsData.userID).toBe(1)
		done()
	})

	test('missing parameter', async done => {
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		const cvData = {
			userID: 1,
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
		await cv.edit(cvData)
		const valid = await cv.getDataUsingParamsID(0)
		expect(valid).toBe(false)
		done()
	})

	test('missing parameter', async done => {
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		const cvData = {
			userID: 1,
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
		await cv.edit(cvData)
		await expect(cv.getDataUsingParamsID(''))
			.rejects.toEqual(Error('Can not get data from cv.'))
		done()
	})

})


describe('getDataFromCv()', () => {

	test('valid data get', async done => { // need to be fixed
		expect.assertions(1)
		const cv = await new Cvs()
		const account = await new Accounts()
		await account.register('doej', 'email@email.com', '07900568473', 'password1453')
		const cvData = {
			userID: 1,
			name: 'doej',
			addressLine1: 'Oxford Street',
			addressLine2: 'Aldbourne Road',
			postcode: 'CV14EQ',
			ref: 'Reference',
			usersWords: 'Some words',
			Country: 'UK',
			skills: 'JAVA, PHP and JavaScript',
			summary: 'A short summary'
		}
		await cv.edit(cvData)
		const valid = await cv.getDataFromCv()
		expect(valid.userID).toBe(undefined)
		done()
	})

})

