const express = require('express');
const authRoute = require('../../controller/auth');
const postRoute = require('../../controller/post');
const seoRoute = require('../../controller/seoGenrater');
const userRoutes = require('../../controller/user');
const newsletterRoute = require('../../controller/newsletter');
const categoryRoute = require('../../controller/category');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoutes
  },
   {
    path: '/post',
    route: postRoute,
  },
   {
    path: '/seo',
    route: seoRoute,
  },
   {
    path: '/newsletter',
    route: newsletterRoute,
  },
   {
    path: '/category',
    route: categoryRoute,
  },

];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
