import { increment, decrement, reset } from '../redux/actions/action-creators';

export const authConsts = {
  JWT_KEY: 'JWT_TOKEN'
};

export const ENTITY_KEY = {
  FOO: 'foo',
  BAR: 'bar',
  BAZ: 'baz',
  EQUIPMENT_TYPES: 'equipment_types',
  EQUIPMENT_TYPE_INFOS: 'equipment_type_infos'
};

let user = JSON.parse(localStorage.getItem('user'));
console.log(user);

export const INITIAL_STATE = {
  entities: {
    [ENTITY_KEY.FOO]: {},
    [ENTITY_KEY.BAR]: {},
    [ENTITY_KEY.BAZ]: {},
    [ENTITY_KEY.EQUIPMENT_TYPES]: {},
    [ENTITY_KEY.EQUIPMENT_TYPE_INFOS]: {}
  },
  counter: 0,
  authentication: {
    // TODO: Remove hard code for user data
    user: user || {}
  },
};

export const ROUTES = [
  {
    icon: 'plus',
    path: null,
    label: 'Increment',
    action: increment
  },
  {
    icon: 'minus',
    path: '/decrement',
    label: 'Decrement',
    action: decrement
  },
  {
    icon: 'history',
    path: '/reset',
    label: 'Reset',
    action: reset
  }
];
