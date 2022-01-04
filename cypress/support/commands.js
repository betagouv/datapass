Cypress.Commands.add("login", (email, password) => {
  cy.session([email, password], () => {
    cy.visit("http://localhost:3001/users/auth/api_gouv?prompt=login", {
      method: "POST",
    }); // Directly visit the backend login page to avoid CORS issues with the cookies "Same-site: lax" policy

    cy.get('input[name="login"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get("form").submit();
  });
});

Cypress.Commands.add("checkBox", (checkbox) => {
  cy.get(`label[for*="${checkbox}"]`).click({ position: "left" });
});

Cypress.Commands.add("fillField", (fieldName, value, fieldType = "input") => {
  cy.get(`${fieldType}[name="${fieldName}"]`).should("be.visible");
  cy.get(`${fieldType}[name="${fieldName}"]`).clear().type(value);
});
