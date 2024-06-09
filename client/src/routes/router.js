import HomePage from '../routes/homePage/homePage';
import Layout from '../routes/layout/layout';
import ListPage from '../routes/listPage/listPage';
import Login from '../routes/login/login';
import ProfilePage from '../routes/profilePage/profilePage';
import Register from '../routes/register/register';
import SinglePage from '../routes/singlePage/singlePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/list',
        element: <ListPage />,
      },
      {
        path: '/:id',
        element: <SinglePage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
]);

export default router;
