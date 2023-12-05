describe('DataPass', () => {
  before(() => {
    cy.login('user@yopmail.com', 'user@yopmail.com');
  });

  it('lets the user copy a validated enrollment', () => {
    cy.visit('http://localhost:3000/copy-authorization-request/12345');
    cy.url().should('match', /http:\/\/localhost:3000\/franceconnect\/.+/);
    cy.get('span#original-copy-number').should('have.text', 'Copie de n°12345');
  });
});
