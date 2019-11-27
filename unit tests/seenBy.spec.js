'use strict'

const Cvs = require('../modules/cv.js')
const Accounts = require('../modules/user.js')
const Viewer = require('../modules/seenBy')


describe('postSeenUsingCvIdAndUsername()', () =>{


    test('if the parameters are valid', async done =>{
        expect.assertions(1)
        const account = await new Accounts()
        const cv = await new Cvs()
        const view = await new Viewer()
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
        const InsertData = await view.postSeenUsingCvIdAndUsername(1,'doej')
        expect(InsertData).toBe(true)
        done()
    })

    test('if cvID is missing', async done =>{
        expect.assertions(1)
        const account = await new Accounts()
        const cv = await new Cvs()
        const view = await new Viewer()
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
        await expect(view.postSeenUsingCvIdAndUsername('','doej'))
        .rejects.toEqual(Error('missing parameter cvId'))
       
        done()
    })


    test('if username is missing', async done =>{
        expect.assertions(1)
        const account = await new Accounts()
        const cv = await new Cvs()
        const view = await new Viewer()
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
        await expect(view.postSeenUsingCvIdAndUsername(1,''))
        .rejects.toEqual(Error('missing parameter username'))
       
        done()
    })
})


describe('getSeenUsingID', () =>{
    test('when parameter is valid', async done =>{ // need to be fixed
        expect.assertions(1)
        const account = await new Accounts()
        const cv = await new Cvs()
        const view = await new Viewer()
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
        const getData = view.getSeenUsingID(1)
        expect(getData.userSeen).toBe(undefined)
        done()

    })

    
    test('if parameter is missing', async done =>{
        expect.assertions(1)
        const account = await new Accounts()
        const cv = await new Cvs()
        const view = await new Viewer()
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
        await expect(view.getSeenUsingID(''))
        .rejects.toEqual(Error('Can not get seen data with using user id.'))
       
        done()
    })
})