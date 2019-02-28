import React from 'react';
import Loadable from 'react-loadable';
import { Switch, Route } from 'react-router-dom';

import NotFound from './notfound/NotFound';
import Loading from 'react-loading-skeleton';
import PageLoader from '../common/PageLoader';

const modules = [
  {
    name: 'Home',
    path: '/',
    modulePath: './home/Home'
  },
  {
    name: 'Login',
    path: '/login',
    modulePath: './login/Login'
  },
  {
    name: 'EquipDetail',
    path: '/equip-detail/:id',
    modulePath: './equip-detail/EquipDetail'
  },
  {
    name: 'AddEquipment',
    path: '/add-equipment',
    modulePath: './add-equipment/AddEquipment'
  },
  // {
  //   name: 'SupplierDashboard',
  //   path: '/dashboard/supplier',
  //   modulePath: './supplier-dashboard'
  // },
  {
    name: 'MyReceivedRequests',
    path: '/dashboard/supplier/',
    modulePath: './supplier-dashboard/MyRequests'
  },
  {
    name: 'RequesterRequests',
    path: '/dashboard/requester/',
    modulePath: './requester-dashboard/MyRequests'
  }
];

const routes = modules.map(module => {
  const component = Loadable({
    loader: () => import(/* webpackPrefetch: true */ `${module.modulePath}`),
    loading: () => <PageLoader/>,
    modules: [module.modulePath],
    webpack: () => [require.resolveWeak(module.modulePath)]
  });

  return (<Route
    exact
    path={module.path}
    component={component}
    key={module.path}
  />);
});

export default (
  <Switch>
    {routes}
    <Route path="*" component={NotFound} />
  </Switch>
);
