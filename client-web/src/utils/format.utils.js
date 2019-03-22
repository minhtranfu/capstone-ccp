import moment from "moment";

export const formatDate = time => {
  if (!time) {
    return '';
  }

  return moment(time).format('DD-MM-YYYY');
};

export const formatPrice = price => {
  // const currencyConfig = config.get('app.currency');
  const currencyConfig = {
    position: 'postfix',
    unit: 'K'
  }

  if (currencyConfig.position === 'postfix') {
    return `${price}${currencyConfig.unit}`;
  }

  return `${currencyConfig.unit}${price}`;
};
