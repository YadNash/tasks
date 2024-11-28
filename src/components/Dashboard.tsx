import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { calculateAverageCompletionTime, calculateTaskDuration, calculateTimeRemaining } from '../utils/time';

export const Dashboard: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'finished').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const completionPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingPercentage = totalTasks ? Math.round((pendingTasks / totalTasks) * 100) : 0;

  const averageCompletionTime = calculateAverageCompletionTime(tasks);

  const pendingTasksTimeStats = tasks
    .filter(task => task.status === 'pending')
    .reduce((acc, task) => ({
      timeLapsed: acc.timeLapsed + calculateTaskDuration(task),
      timeToFinish: acc.timeToFinish + calculateTimeRemaining(task),
    }), { timeLapsed: 0, timeToFinish: 0 });

  const priorityStats = [1, 2, 3, 4, 5].map(priority => {
    const priorityTasks = tasks.filter(task => task.priority === priority && task.status === 'pending');
    const timeElapsed = priorityTasks.reduce((sum, task) => sum + calculateTaskDuration(task), 0);
    const timeToFinish = priorityTasks.reduce((sum, task) => sum + calculateTimeRemaining(task), 0);
    
    return {
      priority,
      pendingCount: priorityTasks.length,
      timeElapsed: Math.round(timeElapsed),
      timeToFinish: Math.round(timeToFinish),
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{totalTasks}</div>
            <div className="text-sm text-gray-600">Total tasks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-600">Tasks completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{pendingPercentage}%</div>
            <div className="text-sm text-gray-600">Tasks pending</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{averageCompletionTime.toFixed(1)} hrs</div>
            <div className="text-sm text-gray-600">Average time per completed task</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Pending task summary</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{pendingTasks}</div>
            <div className="text-sm text-gray-600">Pending tasks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {Math.round(pendingTasksTimeStats.timeLapsed)} hrs
            </div>
            <div className="text-sm text-gray-600">Total time lapsed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {Math.round(pendingTasksTimeStats.timeToFinish)} hrs
            </div>
            <div className="text-sm text-gray-600">Total time to finish</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Priority-wise breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time lapsed (hrs)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time to finish (hrs)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {priorityStats.map((stat) => (
                <tr key={stat.priority}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.pendingCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.timeElapsed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.timeToFinish}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};