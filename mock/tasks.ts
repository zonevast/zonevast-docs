import { Task } from '../../types';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

export const MOCK_TASKS: Task[] = [
    { id: 't1', projectId: 'p1', title: 'Setup CI/CD Pipeline', description: 'Configure GitHub Actions for auto-deploy. Ensure secrets are managed correctly.', status: 'in_progress', priority: 'high', reward: 150, dueDate: tomorrow.toISOString(), estimatedHours: 4, attachments: ['pipeline_config.yml'], steps: [{id: 's1', text: 'Configure Actions', isCompleted: true}, {id: 's2', text: 'Set Secrets', isCompleted: false}] },
    { id: 't2', projectId: 'p1', title: 'Design Database Schema', description: 'Create ERD for the new inventory module.', status: 'completed', priority: 'medium', reward: 100, dueDate: new Date().toISOString(), estimatedHours: 8 },
    { id: 't3', projectId: 'p1', title: 'Fix Auth Bug', description: 'Login fails when token expires unexpectedly.', status: 'todo', priority: 'urgent', reward: 200, dueDate: nextWeek.toISOString(), estimatedHours: 2 },
    { id: 't4', projectId: 'p1', title: 'Deploy Staging', description: 'Push latest build to staging environment.', status: 'todo', priority: 'high', reward: 120, dueDate: nextWeek.toISOString(), estimatedHours: 1 },
    { id: 't5', projectId: 'p1', title: 'Review Payment Integration', description: 'Code review for payment gateway integration logic.', status: 'in_progress', priority: 'medium', reward: 50, dueDate: tomorrow.toISOString(), estimatedHours: 3, attachments: ['stripe_docs.pdf', 'diagram.png'] },
];