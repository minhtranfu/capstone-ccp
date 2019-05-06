import React from 'react';
import Loadable from 'react-loadable';
import { Switch, Route } from 'react-router-dom';

import NotFound from './notfound/NotFound';
import PageLoader from '../common/PageLoader';
import PrivateRoute from '../common/PrivateRoute';
import { routeConsts } from 'Common/consts';

export const modules = [
  {
    name: routeConsts.HOME,
    path: '/',
    modulePath: './home'
  },
  {
    name: routeConsts.PROFILE,
    path: '/me',
    modulePath: './profile',
    isPrivate: true
  },
  {
    name: routeConsts.NOTIFICATIONS,
    path: '/notifications',
    modulePath: './notifications',
    isPrivate: true
  },
  {
    name: routeConsts.CONSTRUCTIONS,
    path: '/constructions',
    modulePath: './supplier-dashboard/MyConstructions',
    isPrivate: true
  },
  {
    name: routeConsts.EQUIPMENTS,
    path: '/equipments',
    modulePath: './equipment/search'
  },
  {
    name: routeConsts.LOGIN,
    path: '/login',
    modulePath: './login/Login'
  },
  {
    name: routeConsts.SIGNUP,
    path: '/signup',
    modulePath: './register'
  },
  {
    name: routeConsts.EQUIPMENT_ADD,
    path: '/equipments/add',
    modulePath: './add-equipment/AddEquipment',
    isPrivate: true
  },
  {
    name: routeConsts.EQUIPMENT_SUPPLY,
    path: '/equipments/supply',
    modulePath: './supplier-dashboard/MyRequests',
    isPrivate: true
  },
  {
    name: routeConsts.EQUIPMENT_MY,
    path: '/equipments/my',
    modulePath: './supplier-dashboard/MyEquipments',
    isPrivate: true
  },
  {
    name: routeConsts.EQUIPMENT_EDIT,
    path: '/equipments/my/:id/edit',
    modulePath: './supplier-dashboard/equipment/edit',
    isPrivate: true
  },
  {
    name: routeConsts.EQUIPMENT_REQUEST,
    path: '/equipments/request',
    modulePath: './requester-dashboard/MyRequests',
    isPrivate: true
  },
  {
    name: routeConsts.EQUIPMENT_TRANSACTION_DETAIL,
    path: '/equipments/transactions/:id',
    modulePath: './equipment/transaction-detail',
    isPrivate: true
  },
  {
    name: routeConsts.SUBSCRIPTION_REQUEST,
    path: '/equipments/subscriptions',
    modulePath: './subscription/requested',
    isPrivate: true,
  },

  // Material
  {
    name: routeConsts.EQUIPMENT_DETAIL,
    path: '/equipments/:id',
    modulePath: './equip-detail/EquipDetail'
  },
  {
    name: routeConsts.MATERIAL_ADD,
    path: '/materials/add',
    modulePath: './add-material',
    isPrivate: true
  },
  {
    name: routeConsts.MATERIAL_MY,
    path: '/materials/my',
    modulePath: './supplier-dashboard/MyMaterials',
    isPrivate: true
  },
  {
    name: routeConsts.MATERIAL_MY_DETAIL,
    path: '/materials/my/:id',
    modulePath: './supplier-dashboard/material-detail',
    isPrivate: true
  },
  {
    name: routeConsts.MATERIAL_EDIT,
    path: '/materials/my/:id/edit',
    modulePath: './material/edit',
    isPrivate: true
  },
  {
    name: routeConsts.MATERIALS,
    path: '/materials',
    modulePath: './material-search'
  },
  {
    name: routeConsts.MATERIAL_SUPPLY,
    path: '/materials/supply',
    modulePath: './supplier-dashboard/MaterialTransactions',
    isPrivate: true
  },
  {
    name: routeConsts.MATERIAL_REQUEST,
    path: '/materials/request',
    modulePath: './requester-dashboard/MaterialTransactions',
    isPrivate: true
  },
  {
    name: routeConsts.MATERIAL_TRANSACTION_DETAIL,
    path: '/materials/transactions/:id',
    modulePath: './material/transaction-detail',
    isPrivate: true
  },
  {
    name: routeConsts.MATERIAL_CART,
    path: '/materials/cart',
    modulePath: './material/cart',
    isPrivate: true
  },
  {
    name: routeConsts.MATERIAL_DETAIL,
    path: '/materials/:id',
    modulePath: './material-detail'
  },

  // Debris
  {
    name: routeConsts.DEBRIS_ADD,
    path: '/debrises/add',
    modulePath: './add-debris',
    isPrivate: true,
  },
  {
    name: routeConsts.DEBRISES,
    path: '/debrises',
    modulePath: './debris-search'
  },
  {
    name: routeConsts.DEBRIS_MY,
    path: '/debrises/my',
    modulePath: './debrises/my',
    isPrivate: true,
  },
  {
    name: routeConsts.DEBRIS_SUPPLY,
    path: '/debrises/supply',
    modulePath: './debrises/supply',
    isPrivate: true,
  },
  {
    name: routeConsts.DEBRIS_SUPPLY_STATUS,
    path: '/debrises/supply/:status',
    modulePath: './debrises/supply',
    isPrivate: true,
  },
  {
    name: routeConsts.DEBRIS_REQUEST,
    path: '/debrises/request',
    modulePath: './debrises/request',
    isPrivate: true,
  },
  {
    name: routeConsts.DEBRIS_REQUEST_STATUS,
    path: '/debrises/request/:status',
    modulePath: './debrises/request',
    isPrivate: true,
  },
  {
    name: routeConsts.DEBRIS_DETAIL,
    path: '/debrises/:id',
    modulePath: './debris-detail'
  },
  {
    name: routeConsts.PROFILE_CONTRACTOR,
    path: '/contractors/:id',
    modulePath: './profile/view/index'
  },
];

const routes = modules.map(module => {
  const component = Loadable({
    loader: () => import(/* webpackPrefetch: true */ `${module.modulePath}`),
    loading: PageLoader,
    modules: [module.modulePath],
    webpack: () => [require.resolveWeak(module.modulePath)],

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
