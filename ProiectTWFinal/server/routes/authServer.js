const jwt = require('jsonwebtoken');
require('dotenv').config();

// cheia secreta pentru semnarea si verificarea unui token
const secret = process.env.SECRET_KEY;

// creare token cu datele din parametru si nu seteaza un timp de expirare pentru token
const encodeToken = (tokenData) => {
  return jwt.sign(tokenData, secret);
};

// intoarce datele din token sau un obiect cu campul error in cazul in care token-ul este invalid
const decodeToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    console.error(e.message);
    return { error: 'bad token' };
  }
};

// middleware-ul care va fi folosit de toate functiile unde autentificarea este necesara;
// verifica daca token-ul este valid si, daca da, seteaza in request datele din acesta, 
// altfel intoarce un cod si un obiect de eroare
const authenticationMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (token == null) // daca nu exista niciun token atunci inseamna ca nu s-a facut nicio incercare de autentificare
    return res.status(401).json({ error: 'User not authenticated' });
  const userObject = decodeToken(token);
  if (userObject.error) { // daca token-ul exista, dar este gresit, inseamna ca este invalid
    return res.status(403).json({ error: 'Error when trying to authenticate' });
  }
  console.log(userObject)
  req.userId = userObject.userId;
  req.userType = userObject.userType;
  next();
};

module.exports = {
    encodeToken,
    decodeToken,
    authenticationMiddleware
}