export const getIndex = (isTypescript) => {
  const portVar = isTypescript ? 'const PORT: number | string = process.env.PORT || 3000;' : 'const PORT = process.env.PORT || 3000;';

  return `import express${isTypescript ? ', { Express, Request, Response }' : ''} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();

const app${isTypescript ? ': Express' : ''} = express();
${portVar}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api', router);

app.get('/', (req${isTypescript ? ': Request' : ''}, res${isTypescript ? ': Response' : ''}) => {
  res.send('Welcome to your Express.js API!');
});

// Error handling middleware
app.use((err${isTypescript ? ': any' : ''}, req${isTypescript ? ': Request' : ''}, res${isTypescript ? ': Response' : ''}, next${isTypescript ? ': Function' : ''}) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
  console.log('Visit http://localhost:' + PORT);
  console.log('Press CTRL+C to stop the server');
});
`
};