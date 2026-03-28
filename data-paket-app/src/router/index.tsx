import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoginPage } from '../pages/Login/LoginPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { PackagesPage } from '../pages/Packages/PackagesPage';
import { PackageDetailPage } from '../pages/PackageDetail/PackageDetailPage';
import { TransactionsPage } from '../pages/Transactions/TransactionsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/packages', element: <PackagesPage /> },
          { path: '/packages/:id', element: <PackageDetailPage /> },
          { path: '/transactions', element: <TransactionsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
