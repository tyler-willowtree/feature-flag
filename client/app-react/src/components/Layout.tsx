import { useGetAllFlags } from 'queries';
import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { mainRoutes } from 'routes/mainRoutes';
import { CustomRouteObject } from 'routes/types';

export const Layout: React.FC = () => {
  const [navRoutes, setNavRoutes] = useState<CustomRouteObject[]>([]);
  const { flags } = useGetAllFlags();

  const getFlagIsEnabled = useCallback(
    (name: string) => {
      const exists = flags?.find((f) => f.name === name);
      return exists === undefined ? false : !exists.enabled;
    },
    [flags]
  );

  useEffect(() => {
    if (flags && mainRoutes) {
      const routes = mainRoutes.children?.filter((rte) => {
        if (rte.meta?.inNav) {
          const { flagName } = rte.meta.inNav;
          if (flagName) {
            return getFlagIsEnabled(flagName);
          }
          return true;
        }
        return false;
      });
      if (routes) {
        setNavRoutes(routes);
      }
    }
  }, [flags, getFlagIsEnabled]);

  return (
    <>
      <nav>
        {navRoutes.map((route) => (
          <NavLink key={route.id} to={route.path || '/'}>
            {route.id}
          </NavLink>
        ))}
      </nav>

      <main className="body">
        <p>
          To show/hide "Test Two" page, toggle the flag "a-example-only" on the
          own db option
        </p>

        <Outlet />
      </main>
    </>
  );
};
