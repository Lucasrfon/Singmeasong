import { faker } from "@faker-js/faker";
import { prisma } from "../database.js";

export async function truncate() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendation RESTART IDENTITY`;
}

export async function populate() {
  for(let i = 0; i < 15; i++) {
    await prisma.recommendation.create({
      data: {
        name: faker.lorem.words(4),
        youtubeLink: 'https://www.youtube.com/watch?v=65Th0jPbsrE',
        score: getRandomInteger(-5, 20)
      }
    });
  }
}

function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}