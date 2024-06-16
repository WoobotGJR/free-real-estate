import HomePage from './homePage/homePage';
import Layout from './layout/layout';
import ListPage from './listPage/listPage';
import Login from './login/login';
import ProfilePage from './profilePage/profilePage';
import Register from './register/register';
import SinglePage from './singlePage/singlePage';
import RequireAuth from './layout/RequireAuth';
import ProfileUpdatePage from './profileUpdatePage/profileUpdatePage';
import {
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from '../lib/loaders';

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
        loader: listPageLoader,
      },
      {
        path: '/:id',
        element: <SinglePage />,
        loader: singlePageLoader,
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
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        path: '/profile',
        element: <ProfilePage />,
        loader: profilePageLoader,
      },
      {
        path: '/profile/update',
        element: <ProfileUpdatePage />,
      },
    ],
  },
]);

export default router;
