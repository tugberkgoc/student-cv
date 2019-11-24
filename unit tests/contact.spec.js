'use strict'

const email = require('../modules/email')


describe('emailSetup()' , () =>{


    test('when the details are valid', async done =>{
        expect.assertions(1)
        const setup = await email.emailSetup('test@example.com', 'example@exapmle.com', 'test')
        expect(setup).toBe(output)
        done()
    })
})