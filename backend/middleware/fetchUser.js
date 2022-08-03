var jwt = require("jsonwebtoken");
const JWT_secret = "priyansh$200205";

const fetchUser = (req, res, next) => {
  // get the user from jwt token and add id to req obj.
  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_secret);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
