import express from 'express';
import { executeSQLQuery } from '../controllers/queryController.js';

const router = express.Router();

// Route to handle SQL queries
router.post('/query', executeSQLQuery,()=>{console.log("in query route");});

export default router;
