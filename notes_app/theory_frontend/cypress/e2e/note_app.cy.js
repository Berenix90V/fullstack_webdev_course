describe('Note app', function () {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Notes')
    cy.contains('Note app, Department of Science, University of Helsinki 2022')
  })

  it('login form can be opened', function () {
    cy.contains('Log in').click()
  })

  it('user can login', function () {
    cy.contains('Log in').click()
    cy.get('input:first').type('mluukkai')
    cy.get('input:last').type('salainen')
  })
})