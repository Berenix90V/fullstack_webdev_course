// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({username, password}) => {
    cy.request('POST', `${Cypress.env('BACKEND')}/api/login`, {
        username: username, password: password
    }).then(response => {
        localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
        cy.visit('')
    })
})

Cypress.Commands.add('createNote', ({content, important}) => {
    cy.request({
        url: `${Cypress.env('BACKEND')}/api/notes`,
        method: 'POST',
        body: {content, important},
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
        }
    })
    cy.visit('')
})