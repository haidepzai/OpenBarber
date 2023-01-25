const barberShops = [
  {
    id: 1,
    name: 'Serkan Barber Shop',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image: 'https://ericbarbier.de/wp-content/uploads/2021/09/Eric-Barbier-Friseur-Ausbildung-01.jpg',
    rating: 4,
    reviews: 8,
    geometry: {
      location: 'Stuttgart',
      lat: 48.783333,
      lng: 9.183333
    },
    priceCategory: 2,
    services: [
      { gender: 'woman', name: 'Waschen, Schneiden, Föhnen', duration: '60', price: '30,00' },
      { gender: 'woman', name: 'Waschen, Föhnen', duration: '60', price: '10,00' },
      { gender: 'woman', name: 'Waschen, Glätten', duration: '60', price: '20,00' },
      { gender: 'woman', name: 'Haare färben', duration: '60', price: '45,00' },
      { gender: 'woman', name: 'Strähnen', duration: '30', price: '50,00' },
      { gender: 'woman', name: 'Kosmetik - Augenbrauen zupfen', duration: '10', price: '10,00' },
      { gender: 'woman', name: 'Kosmetik - Wimpern', duration: '10', price: '10,00' },
      { gender: 'man', name: 'Waschen, Schneiden und Styling', duration: '30', price: '35,00' },
      { gender: 'man', name: 'Maschinen-Haarschnitt', duration: '20', price: '17,50' },
      { gender: 'man', name: 'Färben, Schneiden und Styling', duration: '60', price: '65,00' },
      { gender: 'man', name: 'Bartschnitt', duration: '20', price: '10,00' },
      { gender: 'man', name: 'Bartschnitt und Pflege', duration: '30', price: '25,00' },
      { gender: 'man', name: 'Kosmetik - Augenbrauen zupfen', duration: '10', price: '10,00' },
      { gender: 'kids', name: 'Kinder-Haarschnitt', duration: '20', price: '12,00' },
    ],
    employees: [
      { name: 'Any' },
      {
        name: 'Alexandra',
        titel: 'Junior Stylist',
        image: 'https://as2.ftcdn.net/v2/jpg/02/48/30/91/1000_F_248309112_rOMWh2P9z4lI5tgDXrB8cAVKCzlNRO88.jpg',
      },
      {
        name: 'Peter',
        titel: 'Junior Stylist',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdVWjI1XVRB5hg9hZ24rMkPtmLCb9jU_NoBQ&usqp=CAU',
      },
      {
        name: 'Laura',
        titel: 'Senior Stylist',
        image: 'https://as2.ftcdn.net/v2/jpg/02/48/30/91/1000_F_248309112_rOMWh2P9z4lI5tgDXrB8cAVKCzlNRO88.jpg',
      },
      {
        name: 'Paul',
        titel: 'Senior Stylist',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdVWjI1XVRB5hg9hZ24rMkPtmLCb9jU_NoBQ&usqp=CAU',
      },
    ],
    paymentMethods: ['On Site (with Cash)', 'On Site (with Card)', 'Paypal', 'Bank Transfer'],
    drinks: ['Coffee', 'Tea', 'Water', 'Sofdrinks', 'Beer', 'Champagne', 'Sparkling Wine'],
    recommended: true,
    openingHours: ['', ''], //Öffnungszeit, Feierabend
  },
  {
    id: 2,
    name: 'Friseur Müller',
    rating: 4.5,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image: 'https://cdn.mdr.de/ratgeber/friseur-haare-schneiden-106_v-variantBig16x9_w-576_zc-915c23fa.jpg?version=27611',
    reviews: 17,
    geometry: {
      location: 'Düsseldorf',
      lat: 51.233334,
      lng: 6.783333
    },
    priceCategory: 1,
    services: [],
    employees: [],
    paymentMethods: [],
    drinks: [],
    recommended: true,
  },
  {
    id: 3,
    name: 'Hairstyle 71',
    rating: 5,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image: 'https://www.kopflausratgeber.de/fileadmin/_processed_/8/9/csm_2021_1_blog_teaser_Mit_Kopflaeusen_zum_Friseur_LICENER_767x512_0406d0757d.jpg',
    reviews: 12,
    geometry: {
      location: 'Berlin, Germany',
      lat: 52.520008,
      lng: 13.404954
    },
    priceCategory: 3,
    services: [],
    employees: [],
    paymentMethods: [],
    drinks: [],
    recommended: true,
  },
  {
    id: 4,
    name: 'Crazy Hair',
    rating: 3,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image: 'https://www.blog.tillhub.de/hubfs/friseur-tipps-guter-service-1.jpg',
    reviews: 10,
    geometry: {
      location: 'Berlin, Germany',
      lat: 52.520008,
      lng: 13.404954
    },
    priceCategory: 3,
    services: [],
    employees: [],
    paymentMethods: [],
    drinks: [],
    recommended: true,
  },
  {
    id: 5,
    name: 'Salon Schmidt',
    rating: 4.5,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image: 'https://bbs-springe.de/wp-content/uploads/2013/08/ausbildungsberuf-friseur.jpg',
    reviews: 20,
    geometry: {
      location: 'Berlin, Germany',
      lat: 52.520008,
      lng: 13.404954
    },
    priceCategory: 3,
    services: [],
    employees: [],
    paymentMethods: [],
    drinks: [],
    recommended: true,
  },
];

export default barberShops;
