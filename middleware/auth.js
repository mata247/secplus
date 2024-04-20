const jsonwebtoken = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const jwt_payload = jsonwebtoken.verify(accessToken, process.env.jwt_salt);

    // Check if the user is verified
    if (!jwt_payload.isVerified) {
      req.session.message = "Unverified user!";
      res.status(401).redirect('/verify'); // Redirect to the account-activated page
      return;
    }

    // Store user data in the session
    req.session.user = jwt_payload;

    // Save the session after setting user data
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
      }
      next();
    });
  } catch (e) {
    req.session.message = "Unauthorized!";
    res.status(401).redirect('/home'); // Redirect to the home page
  }
};

module.exports = auth;
