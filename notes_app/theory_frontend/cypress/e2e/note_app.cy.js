describe('Note app', function () {
  it('front page can be opened', function () {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Science, University of Helsinki 2022')
  })
  it('login form can be opened', function () {
    cy.visit('http://localhost:3000')
    cy.contains('Log in').click()
  })
})