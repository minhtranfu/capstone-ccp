export const EQUIPMETN_TRANSACTION_STATUSES = [
  {
    code: "PENDING",
    title: "Pending" // On Waiting,
  },
  {
    code: "ACCEPTED",
    title: "Accepted"
  },
  {
    code: "PROCESSING",
    title: "Processing"
  },
  {
    code: "FINISHED",
    title: "Finished"
  },
  {
    code: "DENIED",
    title: "Denied"
  },
  {
    code: "CANCEL",
    title: "Cancel"
  }
];

export const TRANSACTION_STATUSES = [
  {
    code: "PENDING",
    title: "Pending"
  },
  {
    code: "ACCEPTED",
    title: "Accepted"
  },
  {
    code: "PROCESSING",
    title: "Processing"
  },
  {
    code: "FINISHED",
    title: "Finished"
  },
  {
    code: "DENIED",
    title: "Denied"
  }
];

export const DROPDOWN_OPTIONS = {
  CATEGORY: [
    {
      id: 0,
      name: "Select equipment caterogy",
      value: "Select equipment category"
    }
  ],
  TYPE: [
    {
      id: 0,
      name: "Select equipment type",
      value: "Select equipment type"
    }
  ],
  CONSTRUCTION: [
    {
      id: 0,
      name: "Select your address",
      value: "Select your address"
    }
  ],
  EQUIPMENT: [
    {
      id: 0,
      name: "All",
      value: "All"
    },
    {
      id: 1,
      name: "Available",
      value: "Available"
    },
    {
      id: 2,
      name: "Delivering",
      value: "Delivering"
    },
    {
      id: 3,
      name: "Pending",
      value: "Pending"
    },
    {
      id: 4,
      name: "Accepted",
      value: "Accepted"
    },
    {
      id: 5,
      name: "Denied",
      value: "Denied"
    },
    {
      id: 6,
      name: "Waiting to returning",
      value: "waiting"
    }
  ],
  REQUEST: [
    {
      id: 0,
      name: "All Statuses",
      value: "All Statuses"
    },
    {
      id: 1,
      name: "Pending",
      value: "Pending"
    },
    {
      id: 2,
      name: "Accepted",
      value: "Accepted"
    },
    {
      id: 3,
      name: "Processing",
      value: "Processing"
    },
    {
      id: 4,
      name: "Finished",
      value: "Finished"
    },
    {
      id: 5,
      name: "Denied",
      value: "Denied"
    }
  ]
};

export const COLORS = {
  AVAILABLE: "#4DB781",
  ACCEPTED: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  CANCEL: "#FF5C5C",
  PENDING: "#F9AA33",
  RENTING: "#7199FE",
  DELIVERING: "#7199FE",
  WAITING_FOR_RETURNING: "#7199FE",
  FINISHED: "#FFDF49",
  PROCESSING: "#7199FE",
  default: "#3E3E3E"
  // blue: 7199FE, yellow: FFDF49
};

export const TABS = {
  manage: ["Equipment", "Material", "Post", "Bid"],
  transaction: ["Equipment", "Material", "Debris"]
};
