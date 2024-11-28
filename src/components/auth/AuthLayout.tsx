import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ClipboardList className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Task Manager
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {window.location.pathname === '/signin' ? (
                    <>
                      New to Task Manager?{' '}
                      <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Create an account
                      </Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                      </Link>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};