
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
      const blogCreatedBySuperuser = {
        title: 'Another Blog',
        author: 'Oppenheimer',
        url: 'https://www.blog.com'
      }
      const blogCreatedByMatti = {
        title: 'Blog',
        author: 'Einstein',
        url: 'https://www.blog.com'
      }
      beforeEach( function () {
        const user = {
          username: 'root',
          name: 'superuser',
          password: 'password'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.get('#logout-button').click()
        cy.login({username: 'root', password: 'password'})
        cy.createBlog(blogCreatedBySuperuser)
        cy.get('#logout-button').click()
        cy.login({username: 'mluukkai', password: 'salainen'})
        cy.createBlog(blogCreatedByMatti)
        cy.visit('')
      })

      it('a user can like a blog', function () {
        cy.contains('Another Blog').contains('likes: 0')
        cy.contains('Another Blog').contains('view').click().get('#add-like').click()
        cy.contains('Another Blog').contains('likes: 1')
      })

      it('the user that posted the blog can delete it', function () {
        cy.contains(`${blogCreatedByMatti.title} by ${blogCreatedByMatti.author}`).contains('delete').click()
        cy.contains(`${blogCreatedByMatti.title} by ${blogCreatedByMatti.author}`).should('not.exist')
      })

      it('the user can delete only its own posts', function () {
        cy.contains(`${blogCreatedByMatti.title} by ${blogCreatedByMatti.author}`).contains('delete')
        cy.contains(`${blogCreatedBySuperuser.title} by ${blogCreatedBySuperuser.author}`)
            .contains('delete')
            .should('not.exist')
      })
    })
    describe('when more blogs exists with different ratings', function () {
      const blog1 = {
        title: 'Blog with less likes',
        author: 'Einstein',
        url: 'https://www.blog.com',
        likes: 0
      }
      const blog2 = {
        title: 'Blog with more likes',
        author: 'Oppenheimer',
        url: 'https://www.blog.com',
        likes: 2
      }
      const blog3 = {
        title: 'Blog middle likes',
        author: 'Heisenberg',
        url: 'https://www.blog.com',
        likes: 1
      }

      beforeEach(function (){
        cy.createBlog(blog1)
        cy.createBlog(blog2)
        cy.createBlog(blog3)
        cy.visit('')
      })

      it('blogs are sorted by likes', () => {
        cy.get('.blog').eq(0).should('contain', 'Blog with more likes')
        cy.get('.blog').eq(2).should('contain', 'Blog with less likes')
      })

      it.only('blogs are sorted by likes also after modifying likes', () => {
        cy.get('.blog').eq(1).contains('view').click()
        cy.get('.blog').eq(1).contains('like').click()
        cy.get('.blog').eq(1).contains('like').click()
        cy.get('.blog').eq(2).should('contain', 'Blog with less likes')
        cy.get('.blog').eq(0).should('contain', 'Blog middle likes')
      })
    })

  })
})