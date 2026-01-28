export const getIndex = (isTypescript, database) => {
  const portVar = isTypescript ? 'const PORT: number | string = process.env.PORT || 3000;' : 'const PORT = process.env.PORT || 3000;';
  
  let dbImport = "";
  let listenBlock = "";

  if (database === 'MongoDB (Mongoose)') {
    dbImport = "import connectDB from './config/db.js';\n";
    listenBlock = `
// Connect to Database and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
    console.log('Visit http://localhost:' + PORT);
    console.log('Press CTRL+C to stop the server');
  });
});`;
  } else if (database === 'PostgreSQL (Prisma)') {
    dbImport = "import prisma from './config/client.js';\n";
    listenBlock = `
// Connect to Database and Start Server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL via Prisma');
    app.listen(PORT, () => {
      console.log(\`Server is running on port \${PORT}\`);
      console.log('Visit http://localhost:' + PORT);
      console.log('Press CTRL+C to stop the server');
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();`;
  } else {
    listenBlock = `
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
  console.log('Visit http://localhost:' + PORT);
  console.log('Press CTRL+C to stop the server');
});`;
  }

  return `import express${isTypescript ? ', { Express, Request, Response }' : ''} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes/index.js';
${dbImport}
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
${listenBlock}
`;
};