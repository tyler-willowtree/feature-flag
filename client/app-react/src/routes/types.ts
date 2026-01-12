import { RouteObject } from 'react-router';

export interface CustomRouteObject extends Omit<RouteObject, 'children'> {
  meta: {
    inNav?: {
      label: string;
      order: number;
      flagName?: string;
    };
  };
  children?: CustomRouteObject[];
}
