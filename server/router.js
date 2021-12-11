const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getStops', mid.requiresLogin, controllers.Stop.getStops);
  app.get('/getAccounts', mid.requiresLogin, controllers.Account.getAccounts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.delete('/delete-stop', mid.requiresLogin, controllers.Stop.deleteStop);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/passChange', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/stops', mid.requiresSecure, mid.requiresLogin, controllers.Stop.stopsPage);
  app.post('/stops', mid.requiresLogin, controllers.Stop.makeStop);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
