import { createClient } from 'redis';

const client = createClient();

async function processSubmission(submission: string): Promise<void> {
  const { problemId, code, language } = JSON.parse(submission) as {
    problemId: string;
    code: string;
    language: string;
  };

  console.log(`Processing submission for problemId ${problemId}`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`Finished processing submission for problemId ${problemId}`);
}

async function startWorker(): Promise<void> {
  try {
    await client.connect();
    console.log('Worker connected to Redis');

    while (true) {
      try {
        const submission = await client.brPop('problems', 0);
        if (submission) {
          await processSubmission(submission.element);
        }
      } catch (error) {
        console.error('Error processing submission:', error);
      }
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
}

startWorker();
