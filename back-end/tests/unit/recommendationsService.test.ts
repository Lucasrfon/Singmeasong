import { jest } from '@jest/globals';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { fullRecommendationFactory, getRandomInteger, recommendationFactory } from '../factories/recommendationFactory';

beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
});

describe('Testes unitários do recommendations service', () => {

    it('Deve criar uma recomendação', async () => {
        const recommendation = await recommendationFactory();

        jest
        .spyOn(recommendationRepository, 'findByName')
        .mockImplementationOnce((): any => {});

        jest
        .spyOn(recommendationRepository, 'create')
        .mockImplementationOnce((): any => {});

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it('Não deve criar uma recomendação duplicada', async () => {
        const recommendation = await recommendationFactory();

        jest
        .spyOn(recommendationRepository, 'findByName')
        .mockImplementationOnce((): any => {
            return recommendation
        });

        const promise = recommendationService.insert(recommendation);

        expect(promise).rejects.toEqual({
            type: 'conflict',
            message: 'Recommendations names must be unique'
          });
        expect(recommendationRepository.create).not.toBeCalled();
    });

    it('Deve retornar a recomendação', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce((): any => {
            return recommendation
        });

        const result = await recommendationService.getById(recommendation.id);
        
        expect(result).toEqual(recommendation);
    });

    it('Deve dar erro not_found com id não existente', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce((): any => {});

        const promise = recommendationService.getById(recommendation.id);

        expect(promise).rejects.toEqual({
            type: 'not_found',
            message: ''
        });
    });

    it('Deve retorna as recomendações', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce((): any => {
            return recommendation
        });

        await recommendationService.get();
        
        expect(recommendationRepository.findAll).toBeCalled();
    });

    it('Deve retorna as recomendações', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'getAmountByScore')
        .mockImplementationOnce((): any => {
            return recommendation
        });

        await recommendationService.getTop(5);
        
        expect(recommendationRepository.getAmountByScore).toBeCalled();
    });
});