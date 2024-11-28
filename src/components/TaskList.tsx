import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { format } from 'date-fns';
import { TaskModal } from './TaskModal';

interface TaskFilters {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  sortBy: 'startTime' | 'endTime';
  sortOrder: 'ASC' | 'DESC';
}

export const TaskList: React.FC = () => {
  const { tasks, deleteTask } = useTaskStore();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    sortBy: 'startTime',
    sortOrder: 'ASC',
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks
    .filter((task) => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = filters.sortBy === 'startTime' ? a.startTime : a.endTime;
      const dateB = filters.sortBy === 'startTime' ? b.startTime : b.endTime;
      return filters.sortOrder === 'ASC' 
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

  const handleSort = (newSortBy: 'startTime' | 'endTime') => {
    if (filters.sortBy === newSortBy) {
      setFilters(prev => ({
        ...prev,
        sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC'
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        sortBy: newSortBy,
        sortOrder: 'ASC'
      }));
    }
  };

  const handleDeleteSelected = () => {
    selectedTasks.forEach(id => deleteTask(id));
    setSelectedTasks([]);
  };

  const calculateTimeToFinish = (task: Task): number => {
    if (task.status === 'finished') return 0;
    const now = new Date();
    const endTime = new Date(task.endTime);
    const hours = (endTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return Math.max(0, hours);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Task list</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setEditingTask({ id: '', title: '', startTime: new Date(), endTime: new Date(), priority: 1, status: 'pending' })}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              + Add task
            </button>
            {selectedTasks.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete selected
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mb-4">
          <select
            value={filters.priority === 'all' ? 'all' : filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value as TaskPriority | 'all' })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>Priority {p}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as TaskStatus | 'all' })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === filteredTasks.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTasks(filteredTasks.map(t => t.id));
                      } else {
                        setSelectedTasks([]);
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('startTime')}
                >
                  Start Time
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('endTime')}
                >
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time to finish (hrs)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTasks([...selectedTasks, task.id]);
                        } else {
                          setSelectedTasks(selectedTasks.filter(id => id !== task.id));
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    T-{task.id.slice(0, 5)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === 'finished' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(task.startTime, 'dd-MMM-yy hh:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(task.endTime, 'dd-MMM-yy hh:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calculateTimeToFinish(task).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingTask && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};