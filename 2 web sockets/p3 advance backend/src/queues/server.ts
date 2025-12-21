import express from 'express';
import { createClient } from 'redis';

const app = express();
app.use(express.json());

const client = createClient();

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

app.post('/submit', async (req, res) => {
  const problemId: string = req.body.problemId;
  const code: string = req.body.code;
  const language: string = req.body.language;

  try {
    await client.lPush(
      'problems',
      JSON.stringify({ problemId, code, language })
    );

    res.status(200).send('Submission received and stored');
  } catch (error) {
    console.error('Redis error:', error);
    res.status(500).send('Failed to store submission');
  }
});

async function startServer(): Promise<void> {
  try {
    await client.connect();
    console.log('Connected to Redis');

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
}

startServer();
