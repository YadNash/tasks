import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskList } from './components/TaskList';
import { Dashboard } from './components/Dashboard';
import { SignInForm } from './components/auth/SignInForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { AuthLayout } from './components/auth/AuthLayout';
import { PrivateLayout } from './components/layout/PrivateLayout';
import { PrivateRoute } from './components/layout/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
        <Route element={<PrivateRoute><PrivateLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;