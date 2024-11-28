export type TaskPriority = 1 | 2 | 3 | 4 | 5;
export type TaskStatus = 'pending' | 'finished';

export interface Task {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  priority: TaskPriority;
  status: TaskStatus;
}