import { ReviewItem } from '../../types';

export const MOCK_REVIEWS: ReviewItem[] = [
  { 
    id: 'rev_1', 
    taskId: 't5', 
    taskTitle: 'Payment Integration', 
    status: 'changes_requested', 
    feedback: 'Please use environment variables for keys.', 
    reviewer: 'Project Owner', 
    date: new Date().toISOString(),
    diff: [
      { type: 'unchanged', content: 'const stripe = require("stripe");', lineNumber: 1 },
      { type: 'removed', content: 'const key = "sk_test_12345";', lineNumber: 2 },
      { type: 'added', content: 'const key = process.env.STRIPE_KEY;', lineNumber: 2 },
      { type: 'unchanged', content: 'const client = stripe(key);', lineNumber: 3 }
    ],
    comments: [
        { id: 'c1', author: 'Reviewer', text: 'Never hardcode keys!', timestamp: new Date(Date.now() - 100000).toISOString() }
    ]
  },
  { 
    id: 'rev_2', 
    taskId: 't2', 
    taskTitle: 'Database Schema', 
    status: 'approved', 
    feedback: 'Looks good to me.', 
    reviewer: 'Lead Arch', 
    date: new Date().toISOString(),
    diff: [
        { type: 'added', content: 'CREATE TABLE users (id SERIAL PRIMARY KEY);', lineNumber: 1 }
    ]
  }
];