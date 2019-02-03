import { Permissions } from "expo";

export async function grantPermission(type) {
  let permissionType = null;
  switch (type) {
    case "location": {
      permissionType = Permissions.LOCATION;
      break;
    }
    case "notification": {
      permissionType = Permissions.NOTIFICATIONS;
      break;
    }
    case "calendar": {
      permissionType = Permissions.CALENDAR;
      break;
    }
    default: {
      permissionType = Permissions.LOCATION;
    }
  }

  const { status } = await Permissions.askAsync(permissionType);
  return status;
}
