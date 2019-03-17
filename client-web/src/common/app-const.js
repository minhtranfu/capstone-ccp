import { increment, decrement, reset } from '../redux/actions/action-creators';

export const appConsts = {
  JWT_KEY: 'JWT_TOKEN',
  NOTI_TOKEN: 'NOTI_TOKEN'
};

export const ENTITY_KEY = {
  FOO: 'foo',
  BAR: 'bar',
  BAZ: 'baz',
  EQUIPMENT_TYPES: 'equipment_types',
  EQUIPMENT_TYPE_INFOS: 'equipment_type_infos',
  FEEDBACK_TYPES: 'feedbackTypes'
};

const jwt = localStorage.getItem(appConsts.JWT_KEY);

export const INITIAL_STATE = {
  entities: {
    [ENTITY_KEY.FOO]: {},
    [ENTITY_KEY.BAR]: {},
    [ENTITY_KEY.BAZ]: {},
    [ENTITY_KEY.EQUIPMENT_TYPES]: {},
    [ENTITY_KEY.EQUIPMENT_TYPE_INFOS]: {},
    [ENTITY_KEY.FEEDBACK_TYPES]: {}
  },
  counter: 0,
  authentication: {
    authenticating: !!jwt,
    isShowLoginModal: false
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
