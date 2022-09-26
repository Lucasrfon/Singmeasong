import { jest } from '@jest/globals';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationFactory } from '../factories/recommendationFactory';

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
});