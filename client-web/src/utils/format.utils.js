import moment from "moment";

export const formatDate = time => {
  if (!time) {
    return '';
  }

  if (time.format) {
    return time.format('DD-MM-YYYY');
  }

  return moment(time).format('DD-MM-YYYY');
};

export const formatPrice = (price, decimalCount = 2, decimal = ".", thousands = ",") => {
  // const currencyConfig = config.get('app.currency');
  const currencyConfig = {
    position: 'postfix',
    unit: 'K'
  }

  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = price < 0 ? "-" : "";

    let i = parseInt(price = Math.abs(Number(price) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    price = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(price - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e);
  }

  price = price.replace('.00', '');

  if (currencyConfig.position === 'postfix') {
    return `${price}${currencyConfig.unit}`;
  }

  return `${currencyConfig.unit}${price}`;
};
