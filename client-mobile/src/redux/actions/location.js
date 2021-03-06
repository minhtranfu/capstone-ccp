import { GOOGLE_MAPS_KEY } from "../../config/apiKey";

function getCurrLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
}

export const getAddressByLatLong = async (lat, long) => {
  const address = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_MAPS_KEY}`
  )
    .then(res => res.json())
    .then(res => {
      const result = res.results;
      const currentAddress = result[0] && result[0].formatted_address;
      return currentAddress ? currentAddress : {};
    });
  if (address) return address;
};

export const getCurrentLocation = async () => {
  const position = await getCurrLocation();
  const address = await getAddressByLatLong(
    position.coords.latitude,
    position.coords.longitude
  );
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    address: address
  };
};

export const getLatLongByAddress = async stringAddress => {
  const address = encodeURIComponent(stringAddress);

  const latLong = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_KEY}`
  )
    .then(res => res.json())
    .then(res => {
      const result = res.results;
      const geo = result[0] && result[0].geometry;
      const location = geo && geo.location;
      return location ? location : {};
    });

  if (latLong) return latLong;
};

export const autoCompleteSearch = async (stringAddress, lat, long) => {
  const address = encodeURIComponent(stringAddress);

  const autoComplete = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${address}&language=vi&region=VN&key=${GOOGLE_MAPS_KEY}`
  )
    .then(res => res.json())
    .then(async res => {
      const predictions = res.predictions;
      const autocomplete = await Promise.all(
        predictions.map(async item => {
          const latLong = await getLatLongByAddress(item.description);
          return {
            ...item.structured_formatting,
            ...latLong //lat, lng
          };
        })
      );
      return autocomplete ? autocomplete : [];
    });

  if (autoComplete) return autoComplete;
};

export const getDistance = async (srcLatLong, desLatLong) => {
  const distance = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${
      srcLatLong.lat
    },${srcLatLong.lng}&destinations=${desLatLong.lat},${
      desLatLong.lng
    }&key=${GOOGLE_MAPS_KEY}`
  )
    .then(res => res.json())
    .then(res => {
      const distanceRows = res.rows && res.rows[0];
      const elements = distanceRows && distanceRows.elements;
      const selectedElement = elements && elements[0];
      const distance = selectedElement.distance;
      return distance
        ? {
            ...distance,
            origin_addresses: res.origin_addresses[0],
            destination_addresses: res.destination_addresses[0]
          }
        : {};
    });

  if (distance) return distance;
};
