const express = require('express');
const authRoute = require('./user.route');
const manhwaRoute = require('./manhwa.route');
const categoryRoute = require('./category.route');
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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
