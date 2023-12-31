import { Route, createBrowserRouter, createRoutesFromElements, redirect } from 'react-router-dom';
import { MainLayout } from 'src/layouts';
import { Account, Home, Login, NotFound, routes } from 'src/pages';
import { auth, loginAction, loginLoader, protectedLoader } from 'src/utils';

export const router = createBrowserRouter(
  // https://reactrouter.com/en/main/utils/create-routes-from-elements
  createRoutesFromElements(
    <Route>
      <Route path={routes.login} element={<Login />} action={loginAction} loader={loginLoader} />
      <Route
        path={routes.logout}
        action={async () => {
          await auth.logout();
          return redirect(routes.login);
        }}
      />
      <Route
        id='root' // ANCHOR[id=route-root]
        path='/' // parent path
        element={<MainLayout />}
        loader={() => ({ user: auth.username })}
      >
        <Route
          index // index path is the parent path
          element={<Home />}
          loader={protectedLoader}
        />
        <Route
          path={routes.account} // child path is relative to the parent path
          element={<Account />}
          loader={protectedLoader}
        />
        R
      </Route>
      <Route path='*' element={<NotFound />} />
    </Route>,
  ),
);
