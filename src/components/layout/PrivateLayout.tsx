import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ClipboardList, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const PrivateLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ClipboardList className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            </div>
            <div className="flex items-center space-x-8">
              <nav className="flex space-x-4">
                <Link
  to="/dashboard"
  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
    isActive('/dashboard')
      ? 'text-indigo-700 bg-indigo-50'
      : 'text-gray-500 hover:text-gray-700'
  }`}
>
  <LayoutDashboard className="w-4 h-4 mr-2" />
  Dashboard
</Link>

<Link
  to="/tasks"
  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
    isActive('/tasks')
      ? 'text-indigo-700 bg-indigo-50'
      : 'text-gray-500 hover:text-gray-700'
  }`}
>
  <LayoutDashboard className="w-4 h-4 mr-2" />
  Tasks
</Link>

              </nav>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user?.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};