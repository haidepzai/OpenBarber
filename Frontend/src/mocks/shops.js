const barberShops = [
  {
    id: 1,
    name: 'Serkan Barber Shop',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    logo: 'https://ericbarbier.de/wp-content/uploads/2021/09/Eric-Barbier-Friseur-Ausbildung-01.jpg',
    reviews: [
      {
        author: "Hans",
        comment: "War geil",
        rating: 4
      },
      {
        author: "Dieter",
        comment: "War ok",
        rating: 2
      },
      {
        author: "Peter",
        comment: "Naja",
        rating: 1
      },
    ],
    geometry: {
      location: 'Stuttgart',
      lat: 48.783333,
      lng: 9.183333,
    },
    priceCategory: 2,
    services: [
      { targetAudience: 'woman', title: 'Waschen, Schneiden, Föhnen', durationInMin: '60', price: '30,00' },
      { targetAudience: 'woman', title: 'Waschen, Föhnen', durationInMin: '60', price: '10,00' },
      { targetAudience: 'woman', title: 'Waschen, Glätten', durationInMin: '60', price: '20,00' },
      { targetAudience: 'woman', title: 'Haare färben', durationInMin: '60', price: '45,00' },
      { targetAudience: 'woman', title: 'Strähnen', durationInMin: '30', price: '50,00' },
      { targetAudience: 'woman', title: 'Kosmetik - Augenbrauen zupfen', durationInMin: '10', price: '10,00' },
      { targetAudience: 'woman', title: 'Kosmetik - Wimpern', durationInMin: '10', price: '10,00' },
      { targetAudience: 'man', title: 'Waschen, Schneiden und Styling', durationInMin: '30', price: '35,00' },
      { targetAudience: 'man', title: 'Maschinen-Haarschnitt', durationInMin: '20', price: '17,50' },
      { targetAudience: 'man', title: 'Färben, Schneiden und Styling', durationInMin: '60', price: '65,00' },
      { targetAudience: 'man', title: 'Bartschnitt', durationInMin: '20', price: '10,00' },
      { targetAudience: 'man', title: 'Bartschnitt und Pflege', durationInMin: '30', price: '25,00' },
      { targetAudience: 'man', title: 'Kosmetik - Augenbrauen zupfen', durationInMin: '10', price: '10,00' },
      { targetAudience: 'kids', title: 'Kinder-Haarschnitt', durationInMin: '20', price: '12,00' },
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
    recommended: false,
    openingTime: "8:00",
    closingTime: "17:00"
  },
  {
    id: 2,
    name: 'Friseur Müller',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    logo: 'https://cdn.mdr.de/ratgeber/friseur-haare-schneiden-106_v-variantBig16x9_w-576_zc-915c23fa.jpg?version=27611',
    reviews: [
      {
        author: "Hans",
        comment: "War geil",
        rating: 4
      },
      {
        author: "Dieter",
        comment: "War ok",
        rating: 2
      },
      {
        author: "Peter",
        comment: "Naja",
        rating: 1
      },
    ],
    geometry: {
      location: 'Düsseldorf',
      lat: 51.233334,
      lng: 6.783333,
    },
    priceCategory: 1,
    services: [
      { targetAudience: 'woman', title: 'Waschen, Schneiden, Föhnen', durationInMin: '60', price: '30,00' },
      { targetAudience: 'woman', title: 'Waschen, Föhnen', durationInMin: '60', price: '10,00' },
      { targetAudience: 'woman', title: 'Waschen, Glätten', durationInMin: '60', price: '20,00' },
      { targetAudience: 'woman', title: 'Haare färben', durationInMin: '60', price: '45,00' },
      { targetAudience: 'woman', title: 'Strähnen', durationInMin: '30', price: '50,00' },
      { targetAudience: 'woman', title: 'Kosmetik - Augenbrauen zupfen', durationInMin: '10', price: '10,00' },
      { targetAudience: 'woman', title: 'Kosmetik - Wimpern', durationInMin: '10', price: '10,00' },
      { targetAudience: 'man', title: 'Waschen, Schneiden und Styling', durationInMin: '30', price: '35,00' },
      { targetAudience: 'man', title: 'Maschinen-Haarschnitt', durationInMin: '20', price: '17,50' },
      { targetAudience: 'man', title: 'Färben, Schneiden und Styling', durationInMin: '60', price: '65,00' },
      { targetAudience: 'man', title: 'Bartschnitt', durationInMin: '20', price: '10,00' },
      { targetAudience: 'man', title: 'Bartschnitt und Pflege', durationInMin: '30', price: '25,00' },
      { targetAudience: 'man', title: 'Kosmetik - Augenbrauen zupfen', durationInMin: '10', price: '10,00' },
      { targetAudience: 'kids', title: 'Kinder-Haarschnitt', durationInMin: '20', price: '12,00' },
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
    openingTime: "9:00",
    closingTime: "17:00"
  },
  {
    id: 3,
    name: 'Hairstyle 71',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image:
      'https://www.kopflausratgeber.de/fileadmin/_processed_/8/9/csm_2021_1_blog_teaser_Mit_Kopflaeusen_zum_Friseur_LICENER_767x512_0406d0757d.jpg',
    reviews: [
      {
        author: "Hans",
        comment: "War geil",
        rating: 4
      },
      {
        author: "Dieter",
        comment: "War ok",
        rating: 2
      },
      {
        author: "Peter",
        comment: "Naja",
        rating: 1
      },
    ],
    geometry: {
      location: 'Berlin, Germany',
      lat: 52.520008,
      lng: 13.404954,
    },
    priceCategory: 3,
    services: [
      { targetAudience: 'woman', title: 'Waschen, Schneiden, Föhnen', durationInMin: '60', price: '30,00' },
      { targetAudience: 'woman', title: 'Waschen, Föhnen', durationInMin: '60', price: '10,00' },
      { targetAudience: 'woman', title: 'Waschen, Glätten', durationInMin: '60', price: '20,00' },
      { targetAudience: 'woman', title: 'Haare färben', durationInMin: '60', price: '45,00' },
      { targetAudience: 'woman', title: 'Strähnen', durationInMin: '30', price: '50,00' },
      { targetAudience: 'woman', title: 'Kosmetik - Augenbrauen zupfen', durationInMin: '10', price: '10,00' },
      { targetAudience: 'woman', title: 'Kosmetik - Wimpern', durationInMin: '10', price: '10,00' },
      { targetAudience: 'man', title: 'Waschen, Schneiden und Styling', durationInMin: '30', price: '35,00' },
      { targetAudience: 'man', title: 'Maschinen-Haarschnitt', durationInMin: '20', price: '17,50' },
      { targetAudience: 'man', title: 'Färben, Schneiden und Styling', durationInMin: '60', price: '65,00' },
      { targetAudience: 'man', title: 'Bartschnitt', durationInMin: '20', price: '10,00' },
      { targetAudience: 'man', title: 'Bartschnitt und Pflege', durationInMin: '30', price: '25,00' },
      { targetAudience: 'man', title: 'Kosmetik - Augenbrauen zupfen', durationInMin: '10', price: '10,00' },
      { targetAudience: 'kids', title: 'Kinder-Haarschnitt', durationInMin: '20', price: '12,00' },
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
    recommended: false,
    openingTime: "8:00",
    closingTime: "18:00"
  },
  {
    id: 4,
    name: 'Crazy Hair',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    logo: 'https://www.blog.tillhub.de/hubfs/friseur-tipps-guter-service-1.jpg',
    reviews: [
      {
        author: "Hans",
        comment: "War geil",
        rating: 4
      },
      {
        author: "Dieter",
        comment: "War ok",
        rating: 2
      },
      {
        author: "Peter",
        comment: "Naja",
        rating: 1
      },
    ],
    geometry: {
      location: 'Berlin, Germany',
      lat: 52.520008,
      lng: 13.404954,
    },
    priceCategory: 3,
    services: [
      { targetAudience: 'woman', title: 'Waschen, Schneiden, Föhnen', durationInMin: '60', price: '30,00' },
      { targetAudience: 'woman', title: 'Waschen, Föhnen', durationInMin: '60', price: '10,00' },
      { targetAudience: 'woman', title: 'Waschen, Glätten', durationInMin: '60', price: '20,00' },
      { targetAudience: 'woman', title: 'Haare färben', durationInMin: '60', price: '45,00' },
      { targetAudience: 'woman', title: 'Strähnen', durationInMin: '30', price: '50,00' },
      { targetAudience: 'woman', title: 'Kosmetik - Augenbrauen zupfen', durationInMin: '10', price: '10,00' },
      { targetAudience: 'woman', title: 'Kosmetik - Wimpern', durationInMin: '10', price: '10,00' },
      { targetAudience: 'man', title: 'Waschen, Schneiden und Styling', durationInMin: '30', price: '35,00' },
      { targetAudience: 'man', title: 'Maschinen-Haarschnitt', durationInMin: '20', price: '17,50' },
      { targetAudience: 'man', title: 'Färben, Schneiden und Styling', durationInMin: '60', price: '65,00' },
      { targetAudience: 'man', title: 'Bartschnitt', durationInMin: '20', price: '10,00' },
      { targetAudience: 'man', title: 'Bartschnitt und Pflege', durationInMin: '30', price: '25,00' },
      { targetAudience: 'man', title: 'Kosmetik - Augenbrauen zupfen', durationInMin: '10', price: '10,00' },
      { targetAudience: 'kids', title: 'Kinder-Haarschnitt', durationInMin: '20', price: '12,00' },
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
    recommended: false,
    openingTime: "8:00",
    closingTime: "17:00"
  },
  {
    id: 5,
    name: 'Salon Schmidt',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    logo: 'https://bbs-springe.de/wp-content/uploads/2013/08/ausbildungsberuf-friseur.jpg',
    reviews: [
      {
        author: "Hans",
        comment: "War geil",
        rating: 4
      },
      {
        author: "Dieter",
        comment: "War ok",
        rating: 2
      },
      {
        author: "Peter",
        comment: "Naja",
        rating: 1
      },
    ],
    geometry: {
      location: 'Berlin, Germany',
      lat: 52.520008,
      lng: 13.404954,
    },
    priceCategory: 3,
    services: [
      { targetAudience: 'woman', title: 'Waschen, Schneiden, Föhnen', durationInMin: '60', price: '30,00' },
      { targetAudience: 'woman', title: 'Waschen, Föhnen', durationInMin: '60', price: '10,00' },
      { targetAudience: 'woman', title: 'Waschen, Glätten', durationInMin: '60', price: '20,00' },
      { targetAudience: 'woman', title: 'Haare färben', durationInMin: '60', price: '45,00' },
      { targetAudience: 'woman', title: 'Strähnen', durationInMin: '30', price: '50,00' },
      { targetAudience: 'woman', title: 'Kosmetik - Augenbrauen zupfen', durationInMin: '10', price: '10,00' },
      { targetAudience: 'woman', title: 'Kosmetik - Wimpern', durationInMin: '10', price: '10,00' },
      { targetAudience: 'man', title: 'Waschen, Schneiden und Styling', durationInMin: '30', price: '35,00' },
      { targetAudience: 'man', title: 'Maschinen-Haarschnitt', durationInMin: '20', price: '17,50' },
      { targetAudience: 'man', title: 'Färben, Schneiden und Styling', durationInMin: '60', price: '65,00' },
      { targetAudience: 'man', title: 'Bartschnitt', durationInMin: '20', price: '10,00' },
      { targetAudience: 'man', title: 'Bartschnitt und Pflege', durationInMin: '30', price: '25,00' },
      { targetAudience: 'man', title: 'Kosmetik - Augenbrauen zupfen', durationInMin: '10', price: '10,00' },
      { targetAudience: 'kids', title: 'Kinder-Haarschnitt', durationInMin: '20', price: '12,00' },
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
    openingTime: "10:00",
    closingTime: "19:00"
  },
];

export default barberShops;
