import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import { createBadRecommendationData, createRecommendationData } from "../factories/recommendationFactory";
import { deleteAllData } from "../factories/scenarioFactory";

beforeEach(async () => {
    await deleteAllData();
});

describe('POST /recommendations/:id/upvote', () => {
    
    it('Em caso de sucesso deve retornar status 200 e adicionar o score em 1', async () => {
        const { id } = await createRecommendationData();
        const result = await supertest(app).post(`/recommendations/${id}/upvote`).send();
        const status = result.status;
        const upVoted = await prisma.recommendation.findUnique({where: { id }});
        
        expect(status).toBe(200);
        expect(upVoted.score).toBe(1);
    });

    it('Em caso de id inexistente deve retornar 404', async () => {
        const result = await supertest(app).post(`/recommendations/1/upvote`).send();
        const status = result.status;
        
        expect(status).toBe(404);
    });
});
    
describe('POST /recommendations/:id/downvote', () => {
        
    it('Em caso de sucesso deve retornar status 200 e subtrair o score em 1', async () => {
        const { id } = await createRecommendationData();
        const result = await supertest(app).post(`/recommendations/${id}/downvote`).send();
        const status = result.status;
        const downVoted = await prisma.recommendation.findUnique({where: { id }});
        
        expect(status).toBe(200);
        expect(downVoted.score).toBe(-1);
    });

    it('Em caso de id inexistente deve retornar 404', async () => {
        const result = await supertest(app).post(`/recommendations/1/upvote`).send();
        const status = result.status;
        
        expect(status).toBe(404);
    });

    it('Em caso do score ficar abaixo de -5 deve retornar status 200 e deletar a recomendação', async () => {
        const { id } = await createBadRecommendationData();
        const result = await supertest(app).post(`/recommendations/${id}/downvote`).send();
        const status = result.status;
        const downVoted = await prisma.recommendation.findUnique({where: { id }});
        
        expect(status).toBe(200);
        expect(downVoted).toBeFalsy();
    });
});

afterAll(async () => {
    await prisma.$disconnect();
}); 