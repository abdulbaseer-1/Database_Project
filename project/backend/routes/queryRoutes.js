import express from 'express';
import { executeSQLQuery } from '../controllers/queryController.js';

const router = express.Router();

// Route to handle SQL queries
router.post('/api/query', executeSQLQuery);

export default router;
