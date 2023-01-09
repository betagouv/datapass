Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('http://localhost:3000/');
    cy.get('form').submit();
    cy.get('input[name="login"]').type(email);
    cy.get('form').submit();
    cy.get('input[name="password"]').type(password);
    cy.get('[action="/users/sign-in"]').submit();
  });
});

Cypress.Commands.add('checkBox', (checkbox) => {
  cy.get(`label[for*="${checkbox}"]`).click({ position: 'left' });
});

Cypress.Commands.add('fillField', (fieldName, value, fieldType = 'input') => {
  cy.get(`${fieldType}[name="${fieldName}"]`)
    .clear()
    .focus()
    .should('not.be.disabled')
    .type(value)
    .blur();
});
