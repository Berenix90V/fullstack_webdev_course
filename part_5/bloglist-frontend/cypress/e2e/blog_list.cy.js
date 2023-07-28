describe('Blog list app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.visit('')
  })
  it('by default login form is shown', function () {
    cy.contains('username').get('input').should('exist')
    cy.contains('password').get('input').should('exist')
    cy.get('button').should('contain', 'Login')
  })
})