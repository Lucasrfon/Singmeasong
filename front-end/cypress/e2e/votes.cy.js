beforeEach(async () => {
  await cy.request('POST', 'http://localhost:5000/e2e/preset', {});
});

describe('testa voto positivo nas música', () => {

    it('adiciona voto com sucesso', () => {
        cy.visit('http://localhost:3000/');
        
        cy.get("[data-cy=upArrow]").first().click();
    });
});

describe('testa voto negativo nas música', () => {

    it('retira voto com sucesso', () => {
        cy.visit('http://localhost:3000/');

        cy.get("[data-cy=downArrow]").first().click();
    });
});