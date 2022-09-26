import { faker } from '@faker-js/faker';

beforeEach(async () => {
  await cy.request('POST', 'http://localhost:5000/e2e/preset', {});
});

describe('testa adição de música', () => {
  it('adiciona música com sucesso', () => {
    const song = {
      name: faker.lorem.words(4),
      youtubeLink: "https://www.youtube.com/watch?v=9tBQ7wqC1BY"
    };

    cy.visit('http://localhost:3000/');

    cy.get("[data-cy=name]").type(song.name);
    cy.get("[data-cy=youtubeLink]").type(song.youtubeLink);

    cy.intercept("POST", 'http://localhost:5000/recommendations').as("postSong");
		cy.intercept("GET", 'http://localhost:5000/recommendations').as("getRecommendations");

    cy.get("[data-cy=send]").click();
    
    cy.wait('@postSong');
    cy.wait('@getRecommendations');

    cy.get("[data-cy=title]").should('contain.text', song.name);
  })
})