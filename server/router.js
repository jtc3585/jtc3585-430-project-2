const controllers = require('./controllers');
const mid = require('./middleware');
const { Account } = require('./models');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getStops', mid.requiresLogin, controllers.Stop.getStops);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.delete('/delete-stop', mid.requiresLogin, controllers.Stop.deleteStop);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Stop.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Stop.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
