import { differenceInHours } from 'date-fns';
import { Task } from '../types/task';

export const calculateTaskDuration = (task: Task): number => {
  if (task.status === 'finished') {
    return differenceInHours(task.endTime, task.startTime);
  }
  
  const now = new Date();
  const timeElapsed = differenceInHours(now, task.startTime);
  return Math.max(0, timeElapsed);
};

export const calculateTimeRemaining = (task: Task): number => {
  if (task.status === 'finished') return 0;
  
  const now = new Date();
  const remaining = differenceInHours(task.endTime, now);
  return Math.max(0, remaining);
};

export const calculateAverageCompletionTime = (tasks: Task[]): number => {
  const completedTasks = tasks.filter(task => task.status === 'finished');
  if (completedTasks.length === 0) return 0;
  
  const totalTime = completedTasks.reduce((sum, task) => 
    sum + differenceInHours(task.endTime, task.startTime), 0);
  
  return totalTime / completedTasks.length;
};