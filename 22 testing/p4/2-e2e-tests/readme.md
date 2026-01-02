End to end tests
Until now, we’re not tested our frontend + backend together. 
End to end tests let you spin up a browser and test things like an end user.
Good reference video - https://www.cypress.io/
 
There are many frameworks that let u do browser based testing
Cypress
Playwright
nightwatchjs
 
We’ll be using cypress


Cypress
Ref - https://www.cypress.io/
Let’s create a simpe test for https://app.100xdevs.com/
 
Init ts project
npm init -y
npx tsc --init
mkdir src

Change rootDir, outDir
"rootDir": "./src",
"outDir": "./dist",

Install cypress (You might face issues here if u dont have a browser)
Linux pre-requisites here - https://docs.cypress.io/guides/getting-started/installing-cypress
npm install cypress --save-dev

Bootstrap cypress
npx cypress open

Select default example to start with
Delete 2-advanced-examples
Try running the todo test
npx cypress run --browser chrome --headed

Update the todo test
describe('Testing app', () => {
  beforeEach(() => {
    cy.visit('https://app.100xdevs.com')
  })

  it('is able to log in', () => {
    cy.contains('Login').should('exist')
    cy.contains('Login').click()
    cy.contains('Signin to your Account').should('exist', { timeout: 10000 })
    cy.get('#email').type('harkirat.iitr@gmail.com');

    // Fill in the password field
    cy.get('#password').type('123random');

    cy.get('button').eq(4).click()

    cy.contains('View Content').should("exist", {timeout: 10000})
  })

})