describe("DataPass", () => {
  it("present the welcome page to an anonymous user", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Bienvenue sur DataPass !");
  });

  it("logs the user in and lets them submit a form", () => {
    cy.visit("http://localhost:3001/users/auth/api_gouv?prompt=login"); // Directly visit the backend login page to avoid CORS issues with the cookies "Same-site: lax" policy

    cy.get('input[name="login"]').type("user@yopmail.com");
    cy.get('input[name="password"]').type("user@yopmail.com");
    cy.get("form").submit();
  });
});
