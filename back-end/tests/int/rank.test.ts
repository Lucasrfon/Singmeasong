import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import { createSeveralRecommendationsData, getRandomInteger } from "../factories/recommendationFactory";
import { deleteAllData } from "../factories/scenarioFactory";

beforeEach(async () => {
    await deleteAllData();
});

describe('GET /recommendations/top/:amount', () => {
    
    it('Em caso de sucesso deve retornar as (:amount) últimas recomendações', async () => {
        const amount = getRandomInteger(1, 15);
        const recommendations = await createSeveralRecommendationsData();
        const result = await supertest(app).get(`/recommendations/top/${amount}`).send();
        const sortRecommendations = recommendations.sort((a, b) => {return b.score - a.score});

        expect(result.body).toHaveLength(amount);
        expect(result.body[0]).toEqual(sortRecommendations[0]);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});