import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import { createRecommendationData, createSeveralRecommendationsData, getRandomInteger, recommendationFactory } from "../factories/recommendationFactory";
import { deleteAllData } from "../factories/scenarioFactory";

beforeEach(async () => {
    await deleteAllData();
});

describe('POST /recommendations', () => {
    
    it('Em caso de sucesso deve retornar status 201 e cadastrar recomendação', async () => {
        const newRecommendation = await recommendationFactory();
        const result = await supertest(app).post("/recommendations").send(newRecommendation);
        const status = result.status;
        const recommendation = await prisma.recommendation.findFirst({where: { name: newRecommendation.name }});

        expect(status).toBe(201);
        expect(recommendation).not.toBeFalsy();
    });

    it('Em caso de nome já cadastrado deve retornar status 409 e não cadastrar recomendação', async () => {
        const {name, youtubeLink} = await createRecommendationData();
        const result = await supertest(app).post("/recommendations").send({name, youtubeLink});
        const status = result.status;
        const recommendation = await prisma.recommendation.findMany({where: { name }});

        expect(status).toBe(409);
        expect(recommendation).toHaveLength(1);
    });
});

describe('GET /recommendations', () => {
    
    it('Em caso de sucesso deve retornar as 10 últimas recomendações', async () => {
        const recommendations = await createSeveralRecommendationsData();
        const result = await supertest(app).get("/recommendations").send();

        expect(result.body).toHaveLength(10);
        expect(recommendations[recommendations.length - 1]).toEqual(result.body[0]);
    });
});

describe('GET /recommendations/:id', () => {
    
    it('Em caso de sucesso deve retornar a recomendação', async () => {
        const recommendation = await createRecommendationData();
        const findRecommendation = await supertest(app).get(`/recommendations/${recommendation.id}`).send();

        expect(recommendation).toEqual(findRecommendation.body);
    });

    it('Em caso de id não existente deve retornar status 404', async () => {
        const result = await supertest(app).get(`/recommendations/${getRandomInteger(1, 20)}`).send();
        const status = result.status;

        expect(status).toBe(404);
    });
});

describe('GET /recommendations/random', () => {
    
    it('Em caso de sucesso deve retornar uma recomendação', async () => {
        await createSeveralRecommendationsData();
        const result = await supertest(app).get(`/recommendations/random`).send();

        expect(result.body).not.toBeFalsy();
    });

    it('Em caso de não existentir música cadastrada deve retornar status 404', async () => {
        const result = await supertest(app).get(`/recommendations/random`).send();
        const status = result.status;

        expect(status).toBe(404);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});