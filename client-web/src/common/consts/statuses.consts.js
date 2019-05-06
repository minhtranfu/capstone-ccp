
/**
 * Equipment, equipment transaction statuses
 */
export const TRANSACTION_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DENIED: 'DENIED',
  PROCESSING: 'PROCESSING',
  CANCELED: 'CANCELED',
  FINISHED: 'FINISHED'
};

export const TRANSACTION_STATUS_CLASSES = {
  PENDING: 'info',
  ACCEPTED: 'success',
  DENIED: 'danger',
  PROCESSING: 'warning',
  CANCELED: 'danger',
  FINISHED: 'success'
};

export const EQUIPMENT_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  DELIVERING: 'DELIVERING',
  RENTING: 'RENTING',
  WAITING_FOR_RETURNING: 'WAITING_FOR_RETURNING'
};

export const EQUIPMENT_SHOWABLE_STATUSES = {
  AVAILABLE: 'Available',
  DELIVERING: 'Delivering',
  RENTING: 'Renting',
  WAITING_FOR_RETURNING: 'Wait for returning'
};

/**
 * Material transaction status
 */
export const MATERIAL_TRANSACTION_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DENIED: 'DENIED',
  DELIVERING: 'DELIVERING',
  CANCELED: 'CANCELED',
  FINISHED: 'FINISHED'
};

export const MATERIAL_TRANSACTION_STATUS_COLORS = {
  PENDING: 'info',
  ACCEPTED: 'success',
  DENIED: 'danger',
  DELIVERING: 'warning',
  CANCELED: 'danger',
  FINISHED: 'success'
};

/**
 * Deris statuses, color of each status
 */
export const DEBRIS_POST_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DELIVERING: 'DELIVERING',
  WORKING: 'WORKING',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED'
};

export const DEBRIS_POST_STATUS_COLORS = {
  ACCEPTED: 'primary',
  DELIVERING: 'warning',
  WORKING: 'warning',
  FINISHED: 'success',
  CANCELED: 'danger'
};

export const DEBRIS_BID_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
};

/**
 * Contactor status
 */
export const CONTRACTOR_STATUSES = {
  NOT_VERIFIED: "NOT_VERIFIED",
  ACTIVATED: "ACTIVATED",
  DEACTIVATED: "DEACTIVATED",
};

export const CONTRACTOR_STATUS_INFOS = {
  [CONTRACTOR_STATUSES.NOT_VERIFIED]: {
    name: 'Not verified',
    bsColor: 'info',
  },
  [CONTRACTOR_STATUSES.ACTIVATED]: {
    name: 'Activated',
    bsColor: 'success',
  },
  [CONTRACTOR_STATUSES.DEACTIVATED]: {
    name: 'Deactivated',
    bsColor: 'danger',
  },
};


/**
 * Date change request statuses
 */
export const DATE_CHANGE_REQUEST_STATUSES = {
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  ACCEPTED: 'ACCEPTED',
  DENIED: 'DENIED',
};

export const DATE_CHANGE_REQUEST_STATUS_COLORS = {
  PENDING: 'info',
  CANCELED: 'danger',
  DENIED: 'danger',
  ACCEPTED: 'success',
};
