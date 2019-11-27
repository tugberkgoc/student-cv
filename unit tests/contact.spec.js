'use strict'

const email = require('../modules/email')


describe('emailSetup()' , () =>{


    test('when the details are valid', async done =>{
        expect.assertions(1)
        const setup = await email.emailSetup('test@example.com', 'example@exapmle.com', 'test')
        expect(setup).toBe(true)
        done()
    })

describe('getDataForSender()' ,()=>{

    test('when the parameters are valid', async done=>{
        expect.assertions(1)
        const setup = await email.getDataForSender('1')
        expect(setup).toBe(fromData)
        done()
    })
})    
})