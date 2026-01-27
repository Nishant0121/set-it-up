export const getRouteIndex = (isTypescript) => {
  return `import { Router } from 'express';
import { getExample } from '../controllers/exampleController.js';

const router = Router();

router.get('/example', getExample);

export default router;
`;
};
