describe('Blog list app', function () {
  beforeEach(function () {

    cy.visit('http://localhost:3000')
  })
  it('by default login form is shown', function () {
    cy.contains('username').get('input').should('exist')
    cy.contains('password').get('input').should('exist')
    cy.get('button').should('contain', 'Login')
  })
})