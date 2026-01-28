export const getPrismaClient = (isTypescript) => {
  return `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
`;
};
