// Importez le module `express-session` pour accéder à la session
const session = require('express-session');

// Middleware d'authentification
function authMiddleware(req, res, next) {
  // Be sur the user is connected
  if (req.session.userId) {
    // if the user is connected, pass the request to the next middleware or route au 
    next();
  } else {
    // else redirect the user to the log in page
    res.redirect('/user/login');
  }
}

module.exports = authMiddleware;