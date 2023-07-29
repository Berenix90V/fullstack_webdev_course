
describe('Blog list app', function () {

  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('username').find('input').should('exist')
    cy.contains('password').find('input').should('exist')
    cy.get('button').should('contain', 'Login')
  })

  it('Create blog form is not shown', function () {
    cy.contains('create').should('not.exist')
  })

  describe('Login', function () {

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('password')
      cy.get('#login-button').click()
      cy.get('.error').contains('Invalid user or password')
          .should('have.css', 'color', 'rgb(255, 0, 0)')
          .should('have.css', 'border-style', 'solid')
    })

    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
      cy.get('#logout-button').contains('Logout')
    })

  })

  describe('when logged in', function () {
    beforeEach(function (){
      cy.login({username: 'mluukkai', password: 'salainen'})
    })

    it('a new blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('Title')
      cy.get('#author-input').type('Author')
      cy.get('#url-input').type('https://www.blog.com')
      cy.get('#create-blog').click()
      cy.contains("A new blog is created", {exact:false}).should('have.css', 'color', 'rgb(0, 128, 0)')
    })

    describe('when more blogs and users exist', function () {

      beforeEach( function () {
        const user = {
          username: 'root',
          name: 'superuser',
          password: 'password'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.get('#logout-button').click()
        cy.login({username: 'root', password: 'password'})
        const blogCreatedBySuperuser = {
          title: 'Another Blog',
          author: 'Oppenheimer',
          url: 'https://www.blog.com'
        }
        cy.createBlog(blogCreatedBySuperuser)
        cy.get('#logout-button').click()
        cy.login({username: 'mluukkai', password: 'salainen'})
        const blogCreatedByMatti = {
          title: 'Blog',
          author: 'Einstein',
          url: 'https://www.blog.com'
        }
        cy.createBlog(blogCreatedByMatti)
        cy.visit('')
      })

      it.only('a user can like a blog', function () {
        cy.contains('Another Blog').contains('likes: 0')
        cy.contains('Another Blog').contains('view').click().get('#add-like').click()
        cy.contains('Another Blog').contains('likes: 1')
      })

    })

  })
})