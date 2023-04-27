const express = require('express');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const roleRoute = require('./role.route');

const router = express.Router();

const defaultIRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/role',
    route: roleRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
