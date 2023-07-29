describe('Blog list app', function () {

  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.visit('')
  })

  it('by default login form is shown', function () {
    cy.contains('username').find('input').should('exist')
    cy.contains('password').find('input').should('exist')
    cy.get('button').should('contain', 'Login')
  })

  describe('when at least one user exist in database', function () {

    beforeEach(function () {
      const user = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
      cy.visit('')
    })

    it('and login with not valid credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('password')
      cy.get('#login-button').click()
      cy.contains('Invalid user or password')
          .should('have.css', 'color', 'rgb(255, 0, 0)')
          .should('have.css', 'border-style', 'solid')
    })

    it('and login successful with the right credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
      cy.get('#logout-button').contains('Logout')
    })

  })
})