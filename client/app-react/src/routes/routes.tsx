import { RouteObject } from 'react-router-dom';
import { NotFound } from 'pages/NotFound';
import { mainRoutes } from 'routes/mainRoutes';

export const routes: RouteObject[] = [
  mainRoutes as RouteObject,
  {
    path: '404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
