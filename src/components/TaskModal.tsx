import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { useTaskStore } from '../store/taskStore';
import { format } from 'date-fns';
import { X } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startTime: z.string(),
  endTime: z.string(),
  priority: z.number().min(1).max(5),
  status: z.enum(['pending', 'finished']),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const { addTask, updateTask } = useTaskStore();
  const isNewTask = !task.id;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      startTime: format(task.startTime, "yyyy-MM-dd'T'HH:mm"),
      endTime: format(task.endTime, "yyyy-MM-dd'T'HH:mm"),
      priority: task.priority,
      status: task.status,
    },
  });

  const currentStatus = watch('status');

  const toggleStatus = () => {
    setValue('status', currentStatus === 'pending' ? 'finished' : 'pending', { 
      shouldValidate: true 
    });
  };

  const onSubmit = (data: TaskFormData) => {
    const taskData = {
      title: data.title,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      priority: data.priority as TaskPriority,
      status: data.status as TaskStatus,
    };

    if (isNewTask) {
      addTask(taskData);
    } else {
      updateTask(task.id, taskData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isNewTask ? 'Add new task' : `Edit task: T-${task.id.slice(0, 5)}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                {...register('title')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  {...register('priority', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {[1, 2, 3, 4, 5].map((p) => (
                    <option key={p} value={p}>
                      Priority {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentStatus === 'finished'}
                      onChange={toggleStatus}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {currentStatus === 'finished' ? 'Finished' : 'Pending'}
                    </span>
                  </label>
                  <input type="hidden" {...register('status')} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  {...register('startTime')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="datetime-local"
                  {...register('endTime')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isNewTask ? 'Add task' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};