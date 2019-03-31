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

export const DROPDOWN_OPTIONS = {
  CATEGORY: [
    {
      id: 0,
      name: "Select your caterogy",
      value: "Select your category"
    }
  ],
  TYPE: [
    {
      id: 0,
      name: "Select your type",
      value: "Select your type"
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
