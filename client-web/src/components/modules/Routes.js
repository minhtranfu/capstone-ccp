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
    path: '/dashboard/supplier/equipments/add',
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
    name: 'SupplierConstructions',
    path: '/dashboard/supplier/constructions',
    modulePath: './supplier-dashboard/MyConstructions'
  },
  {
    name: 'SupplierEquipments',
    path: '/dashboard/supplier/equipments',
    modulePath: './supplier-dashboard/MyEquipments'
  },
  {
    name: 'RequesterRequests',
    path: '/dashboard/requester/',
    modulePath: './requester-dashboard/MyRequests'
  },
  {
    name: 'TransactionDetail',
    path: '/dashboard/transaction/:id',
    modulePath: './transaction-detail'
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
