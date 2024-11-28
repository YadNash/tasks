import { create } from 'zustand';
import { Task, TaskPriority, TaskStatus } from '../types/task';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: crypto.randomUUID() }]
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id)
  })),
  completeTask: (id) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id
        ? { ...task, status: 'finished' as TaskStatus, endTime: new Date() }
        : task
    )
  }))
}));