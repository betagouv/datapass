describe("DataPass", () => {
  before(() => {
    cy.login("user@yopmail.com", "user@yopmail.com");
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce("_session_id");
  });

  // Make Cypress visit the login domain, so that the "before" hook is run on a test that visit the same single domain
  it("lets the user visit the backend domain", () => {
    cy.visit("https://auth-test.api.gouv.fr/users/sign-in");
  });

  it("lets the user fill a FranceConnect form", () => {
    cy.visit("http://localhost:3000/franceconnect");

    cy.fillField("intitule", "Test de soumission de formulaire");
    cy.fillField(
      "description",
      "Le projet sert à tester de bout en bout la soumission de formulaire",
      "textarea"
    );
    cy.checkScope("family_name");
    cy.checkScope("given_name");
    cy.checkScope("email");
    cy.get(".fr-modal__footer button.fr-btn:not(.fr-btn--secondary)").should("be.visible");
    cy.get(".fr-modal__footer button.fr-btn:not(.fr-btn--secondary)").click();
    cy.fillField("data_recipients", "Le testeur");
    cy.fillField("data_retention_period", "12");
    cy.fillField("fondement_juridique_title", "CRPA L114.8", "textarea");
    cy.fillField(
      "fondement_juridique_url",
      "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033219997/"
    );

    // Do an intermediate save
    cy.get("button.fr-fi-save-line").as("draftSaveButton").click();
    cy.contains("user@yopmail.com a créé la demande");

    cy.fillField("team_members[1].given_name", "Jean");
    cy.fillField("team_members[1].family_name", "Martin");
    cy.fillField("team_members[1].job", "Chef");
    cy.fillField("team_members[1].email", "jeannot_63@mairie-martin.fr");
    cy.fillField("team_members[1].phone_number", "0606060606");

    cy.fillField("team_members[2].given_name", "Jean-Pierre");
    cy.fillField("team_members[2].family_name", "Dépého");
    cy.fillField("team_members[2].job", "Protecteur de la donnée");
    cy.fillField("team_members[2].email", "jp@donnee-protegee.fr");
    cy.fillField("team_members[2].phone_number", "0606060606");

    cy.get(".form__group > button").click();
    cy.fillField("team_members[3].phone_number", "0606060606");

    cy.get('input[name="cgu_approved"]').click();
    cy.get('input[name="dpo_is_informed"]').click();
    cy.get(
      'input[name="additional_content.has_alternative_authentication_methods"]'
    ).click();

    cy.get("button.fr-fi-checkbox-line").click();

    cy.contains("En cours de validation");
  });
});
