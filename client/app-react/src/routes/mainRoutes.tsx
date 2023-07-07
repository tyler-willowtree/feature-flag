import { FlaggedFeature } from 'components/FlaggedFeature';
import { Layout } from 'components/Layout';
import { Examples } from 'pages/Examples';
import { TestOnePage } from 'pages/TestOnePage';
import { TestTwoPage } from 'pages/TestTwoPage';
import { CustomRouteObject } from 'routes/types';

export const mainRoutes: CustomRouteObject = {
  path: '/',
  element: <Layout />,
  meta: {},
  children: [
    {
      path: '',
      id: 'Home',
      element: <Examples />,
      meta: {
        inNav: {
          label: 'Home',
          order: 1,
        },
      },
    },
    {
      path: 'test-one',
      id: 'Test One',
      element: <TestOnePage />,
      meta: {
        inNav: {
          label: 'Test One',
          order: 2,
        },
      },
    },
    {
      path: 'test-two',
      id: 'Test Two',
      element: (
        <FlaggedFeature
          flagKey="a-example-only"
          elseElement={<div>Page coming soon!</div>}
        >
          <TestTwoPage />
        </FlaggedFeature>
      ),
      meta: {
        inNav: {
          label: 'Test Two',
          order: 3,
          flagName: 'a-example-only',
        },
      },
    },
  ],
};
