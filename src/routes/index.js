const express = require('express');
const authRoute = require('./user.route');
const manhwaRoute = require('./manhwa.route');
const categoryRoute = require('./category.route');
const librairyRoute = require('./librairy.route');
const manhwaPersonnalRoute = require('./manhwa-personnal.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: authRoute,
  },
  {
    path: '/manhwas',
    route: manhwaRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/librairies',
    route: librairyRoute,
  },
  {
    path: '/manhwas-personnal',
    route: manhwaPersonnalRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
