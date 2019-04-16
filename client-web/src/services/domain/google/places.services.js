import DataAccessService from 'Services/data/data-access-service';

export const getAddressByLatLong = (lat, lng) => {
  return DataAccessService.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=AIzaSyBE3_QVBkrQMeew-WGni49HWOs1zASQp-o`,
  {
    headers: {},
  });
};
