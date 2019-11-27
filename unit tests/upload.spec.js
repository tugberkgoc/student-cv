'use strict'

const UploadFile = require('../modules/cv')
const mock = require('mock-fs')


mock({
	'sample-file.txt': 'This is file content',
	'path': {
		'to': {
			'sub-dir': {
				'another-file.md': 'Markdown content'
			}
		}
	}
})


describe('uploadPicture', () => {

	/*test('uploading valid file', async done => {
		expect.assertions(1)
		const upload = new UploadFile()
		const picture = await upload.uploadPicture()
		expect(picture).toBe(true)
		done()
	})*/ // needs to be fixed

})

//restore fs after the tests
mock.restore()
