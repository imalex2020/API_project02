import { postRequestBody, putRequestBody, patchRequestBody } from '../../fixtures/StuentsTestData.json'


describe('API project02 Create, Read, Update, Delete operations', () => {

    let studentsId

    it('1. Retrieve a list of all students using GET', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('baseUrl')
        }).then((response) => {
            const students = response.body;
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(200)
            expect((students).length).to.be.at.least(2)
            expect(students[1].firstName).to.eq('John');
            expect(students[1].lastName).to.eq('Doe');
            cy.log(JSON.stringify(students, null, 2))

        })
    })

    it('2. POST new student', function () {
        cy.request({
            method: 'POST',
            url: Cypress.env('baseUrl'),
            body: postRequestBody

        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(200)

            cy.log(JSON.stringify(response.body, null, 2))

            cy.validateResponse(response, postRequestBody)

            studentsId = response.body.id
        })

        cy.task('runQuery', `SELECT * FROM student WHERE email = \'testtest@gmail.com\' `).then((rows) => {

            expect(rows).to.have.length(1)

        })

    })

    it('3. retrieve student using GET', function () {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('baseUrl')}/${studentsId}`
        }).then((response) => {
            cy.log(JSON.stringify(response.body, null, 2))
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(200)
            cy.validateResponse(response, postRequestBody)

        })

    })

    it('4. update student using PUT', function () {
        cy.request({
            method: 'PUT',
            url: `${Cypress.env('baseUrl')}/${studentsId}`,
            body: putRequestBody
        }).then((response) => {

            cy.log(JSON.stringify(response.body, null, 2))
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(200)
            cy.validateResponse(response, putRequestBody)
        })

        cy.task('runQuery', `SELECT * FROM student WHERE id = ${studentsId}`).then((rows) => {

            expect(rows).to.have.length(1)

        })
    })

    it('5. update student using PATCH', function () {
        cy.request({
            method: 'PATCH',
            url: `${Cypress.env('baseUrl')}/${studentsId}`,
            body: patchRequestBody
        }).then((response) => {

            cy.log(JSON.stringify(response.body, null, 2))
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(200)
            expect(response.body.firstName).to.equal(putRequestBody.firstName)
            expect(response.body.lastName).to.equal(putRequestBody.lastName)
            cy.validateResponse(response, patchRequestBody)
        })

        cy.task('runQuery', `SELECT * FROM student WHERE id = ${studentsId}`).then((rows) => {

            expect(rows).to.have.length(1)

        })
    })

    it('6. Retrieve a list of all students using GET', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('baseUrl')
        }).then((response) => {
            const students = response.body;
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(200)
            expect((students).length).to.be.at.least(3)


        })
    })

    it('7. retrieve student using GET', function () {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('baseUrl')}/${studentsId}`
        }).then((response) => {
            cy.log(JSON.stringify(response.body, null, 2))
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(200)
            cy.validateResponse(response, patchRequestBody)
            expect(response.body.firstName).to.equal(putRequestBody.firstName)
            expect(response.body.lastName).to.equal(putRequestBody.lastName)

        })

    })

    it('8. delete student using DELETE', () => {
        cy.request({
            method: 'DELETE',
            url: `${Cypress.env('baseUrl')}/${studentsId}`
        }).then((response => {
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(200)
        }))

        cy.task('runQuery', `SELECT * FROM student WHERE id = ${studentsId}`).then((rows) => {

            expect(rows).to.have.length(0)
        })
    })
})