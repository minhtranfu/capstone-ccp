export const discoverData = [
  {
    id: 1,
    name: "Forklift",
    image: "",
    price: 100,
    author: "Hoa Binh Construction",
    location: "340 abcssss",
    uploaded: "12-01-2019",
    rate: 4.5
  },
  {
    id: 2,
    name: "Forklift",
    image: "",
    price: 110,
    author: "Hoa Binh Construction",
    location: "340 abcssss",
    uploaded: "12-01-2019",
    rate: 4.5
  },
  {
    id: 3,
    name: "Forklift",
    image: "",
    price: 125,
    author: "Hoa Binh Construction",
    location: "340 abcssss",
    uploaded: "12-01-2019",
    rate: 4.5
  },
  {
    id: 4,
    name: "Forklift",
    image: "",
    price: 120,
    author: "Hoa Binh Construction",
    location: "340 abcssss",
    uploaded: "12-01-2019",
    rate: 4.5
  }
];

export const itemDetail = {
  id: 1,
  name: "Forklift",
  images: [
    require("../../assets/images/forklift1.png"),
    require("../../assets/images/forklift2.png"),
    require("../../assets/images/forklift1.png"),
    require("../../assets/images/forklift1.png"),
    require("../../assets/images/forklift2.png"),
    require("../../assets/images/forklift1.png")
  ],
  prices: [
    { duration: "day", price: 100 },
    { duration: "week", price: 110 },
    { duration: "month", price: 120 }
  ],
  author: "Hoa Binh Construction",
  location: "340 Truong Chinh Street, Ward 4, Tan Binh District, HCM city",
  availableFrom: "15/01/2019",
  availableTo: "15/02/2019",
  uploaded: "12-01-2019",
  rate: 4.5,
  isRented: true,
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
};

export const detail = {
  data: {
    name: "xe sửa chữa",
    id: 15,
    description: "hihi",
    status: "available",
    dailyPrice: 12,
    deliveryPrice: 12,
    equipmentType: {
      generalEquipmentTypeId: 1,
      id: 1,
      name: "Xe test thử "
    },
    constructor: {
      email: null,
      id: 1,
      name: "Nghia",
      phoneNumber: "091231231",
      thumbnailImage: null
    },
    constructionId: 1,
    location: {
      id: 20,
      latitude: 134.2,
      longitude: 11.3,
      query: "Cà mau "
    },
    description: "hihi",
    descriptionImages: [],
    availableTimeRanges: [
      { endDate: 1519232400000, beginDate: 1518973200000 },
      { endDate: 1521046800000, beginDate: 1519750800000 }
    ],
    status: "available"
  }
};
