import { jest } from '@jest/globals';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { fullRecommendationFactory, getRandomInteger, recommendationFactory } from '../factories/recommendationFactory';

beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
});

describe('Testes unitários do recommendations service', () => {

    it('(insert) Deve criar uma recomendação', async () => {
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

    it('(insert) Não deve criar uma recomendação duplicada', async () => {
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
    
    it('(getByIdOrFail) Deve retornar a recomendação encontrada por id', async () => {
        const recommendation = await fullRecommendationFactory();
        
        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce((): any => {
            return recommendation
        });
        
        const result = await recommendationService.getById(recommendation.id);
        
        expect(result).toEqual(recommendation);
    });
    
    it('(getByIdOrFail) Deve dar erro not_found com id não existente', async () => {
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
    
    it('(upvote) Deve atualizar o score da recomendação', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce((): any => {return recommendation});

        jest
        .spyOn(recommendationRepository, 'updateScore')
        .mockImplementationOnce((): any => {});

        await recommendationService.upvote(recommendation.id);

        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it('(downvote) Deve atualizar o score da recomendação', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce((): any => {return recommendation});

        jest
        .spyOn(recommendationRepository, 'updateScore')
        .mockImplementationOnce((): any => {return recommendation});

        await recommendationService.downvote(recommendation.id);

        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it('(downvote) Deve apagar o score da recomendação quando ficar abaixo de -5', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce((): any => {
            return {
                ...recommendation,
                score: -5
            }
        });

        jest
        .spyOn(recommendationRepository, 'updateScore')
        .mockImplementationOnce((): any => {
            return {
                ...recommendation,
                score: -6
            }
        });

        jest
        .spyOn(recommendationRepository, 'remove')
        .mockImplementationOnce((): any => {});

        await recommendationService.downvote(recommendation.id);

        expect(recommendationRepository.remove).toBeCalled();
    });

    it('(get) Deve retorna as recomendações', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce((): any => {
            return recommendation
        });

        await recommendationService.get();
        
        expect(recommendationRepository.findAll).toBeCalled();
    });

    it('(getTop) Deve retorna as top recomendações', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'getAmountByScore')
        .mockImplementationOnce((): any => {
            return recommendation
        });

        await recommendationService.getTop(5);
        
        expect(recommendationRepository.getAmountByScore).toBeCalled();
    });

    it('(getRandom) Deve retorna ao menos uma recomendação ao encontrar filtrando pelo score', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce((): any => {
            return [recommendation]
        });

        const result = await recommendationService.getRandom();
        
        expect(result).toEqual(recommendation);
    });

    it('(getRandom) Deve retorna ao menos uma recomendação ao não encontrar pelo score, mas existir', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce((): any => {
            return []
        });

        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce((): any => {
            return [recommendation]
        });

        const result = await recommendationService.getRandom();
        
        expect(result).toEqual(recommendation);
    });

    it('(getRandom) Deve dar erro not_found quando não existirem recomandações', async () => {
        const recommendation = await fullRecommendationFactory();

        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce((): any => { return [] });

        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce((): any => { return [] });

        const promise = recommendationService.getRandom();
        
        expect(promise).rejects.toEqual({
            type: 'not_found',
            message: ''
        });
    });
});