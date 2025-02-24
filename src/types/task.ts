export type Priority = 'low' | 'medium' | 'high';
export type Category = 'design' | 'research' | 'documents';
export type Status = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  status: Status;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  timeSpent: number; // in minutes
  progress: number; // 0-100
  attachments: string[];
}