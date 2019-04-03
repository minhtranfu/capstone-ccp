export const DATA_TYPES = {
  DOUBLE: 'DOUBLE',
  INTEGER: 'INTEGER',
  STRING: 'STRING'
};

export const DATA_TYPE_RULES = {
  [DATA_TYPES.DOUBLE]: {
    numericality: {
      greaterThan: 0
    }
  },
  [DATA_TYPES.INTEGER]: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Only allow integer number greater than 0'
    }
  }
};
