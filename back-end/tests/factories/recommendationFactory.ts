import { faker } from '@faker-js/faker';
import { prisma } from "../../src/database";

export async function recommendationFactory() {
  return {
    name: faker.lorem.words(4),
    youtubeLink: 'https://www.youtube.com/watch?v=65Th0jPbsrE'
  }
}

export async function createRecommendationData() {
  const recommendation = await prisma.recommendation.create({
    data: {
      name: faker.lorem.words(4),
      youtubeLink: 'https://www.youtube.com/watch?v=65Th0jPbsrE'
    }
  });
    
  return recommendation;
}

export async function createSeveralRecommendationsData() {
  const recommendation = []
  for(let i = 0; i < 15; i++) {
    recommendation[i] = await prisma.recommendation.create({
      data: {
        name: faker.lorem.words(4),
        youtubeLink: 'https://www.youtube.com/watch?v=65Th0jPbsrE',
        score: getRandomInteger(-5, 50)
      }
    });
  }
    
  return recommendation;
}

export async function createBadRecommendationData() {
  const recommendation = await prisma.recommendation.create({
    data: {
      name: faker.lorem.words(4),
      youtubeLink: 'https://www.youtube.com/watch?v=65Th0jPbsrE',
      score: -5
    }
  });
    
  return recommendation;
}

export function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}