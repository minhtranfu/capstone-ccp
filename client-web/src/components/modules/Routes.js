import React from 'react';
import Loadable from 'react-loadable';
import { Switch, Route } from 'react-router-dom';

import NotFound from './notfound/NotFound';
import Loading from 'react-loading-skeleton';
import PageLoader from '../common/PageLoader';
import PrivateRoute from '../common/PrivateRoute';

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
    path: '/dashboard/supplier/equipments/add',
    modulePath: './add-equipment/AddEquipment',
    isPrivate: true
  },
  // {
  //   name: 'SupplierDashboard',
  //   path: '/dashboard/supplier',
  //   modulePath: './supplier-dashboard'
  // },
  {
    name: 'MyReceivedRequests',
    path: '/dashboard/supplier/',
    modulePath: './supplier-dashboard/MyRequests',
    isPrivate: true
  },
  {
    name: 'SupplierConstructions',
    path: '/dashboard/supplier/constructions',
    modulePath: './supplier-dashboard/MyConstructions',
    isPrivate: true
  },
  {
    name: 'SupplierEquipments',
    path: '/dashboard/supplier/equipments',
    modulePath: './supplier-dashboard/MyEquipments',
    isPrivate: true
  },
  {
    name: 'RequesterRequests',
    path: '/dashboard/requester/',
    modulePath: './requester-dashboard/MyRequests',
    isPrivate: true
  },
  {
    name: 'TransactionDetail',
    path: '/dashboard/transaction/:id',
    modulePath: './transaction-detail',
    isPrivate: true
  }
];

const routes = modules.map(module => {
  const component = Loadable({
    loader: () => import(/* webpackPrefetch: true */ `${module.modulePath}`),
    loading: () => <PageLoader/>,
    modules: [module.modulePath],
    webpack: () => [require.resolveWeak(module.modulePath)]
  });

  const routeProps = {
    exact: true,
    path: module.path,
    component: component,
    key: module.path
  };

  if (module.isPrivate) {
    return (<PrivateRoute {...routeProps} />)
  }

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
