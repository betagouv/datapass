describe("DataPass", () => {
  it("lets the user create a pass", () => {
    cy.visit("http://localhost:4000");
    cy.contains("Bienvenue sur DataPass !");
  });
});
