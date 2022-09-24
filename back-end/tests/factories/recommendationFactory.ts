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