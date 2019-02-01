function getCurrLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
}

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
