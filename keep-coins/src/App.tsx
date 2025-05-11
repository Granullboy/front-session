import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from './pages/Login';
import { Logout } from './pages/Logout';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Stats } from './pages/Stats';
import { Settings } from './pages/Settings';
import { HomePage } from './pages/HomePage';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './components/theme/ThemeProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'logout', element: <Logout /> },
      { path: 'register', element: <Register /> },
      { 
        element: <ProtectedRoute />, // This will protect all child routes
        children: [
          { index: true, element: <HomePage /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'stats', element: <Stats /> },
          { path: 'settings', element: <Settings /> },
        ]
      },
    ],
  },
]);

export const App = () => {
  return (
    <ThemeProvider>
      <div className="transition-colors duration-300">
        <RouterProvider router={router}/>
      </div>
    </ThemeProvider>
  );
};

export default App;