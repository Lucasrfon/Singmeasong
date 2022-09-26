beforeEach(async () => {
  await cy.request('POST', 'http://localhost:5000/e2e/preset', {});
});

describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
  })
})