import cron from 'node-cron';
import { collections } from './database';

// Initialize cron jobs
export function initCronJobs() {
  // Run cleanup at midnight every day
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running cleanup cron job...');
      await collections.conversations.deleteMany({
        updatedAt: { 
          $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days old
        }
      });
      console.log('Cleanup complete');
    } catch (err) {
      console.error('Cleanup cron job failed:', err);
    }
  });
}
