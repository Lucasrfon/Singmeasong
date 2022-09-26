beforeEach(async () => {
    await cy.request('POST', 'http://localhost:5000/e2e/preset', {});
  });
  
  describe('testa música aleatória', () => {
    it('exibe música aleatória', () => {
      cy.visit('http://localhost:3000/');

      cy.contains("Top").click();
    });
})