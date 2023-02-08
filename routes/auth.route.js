const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const body = { ...req.body };

  if (body.password.length < 8) {
    res.render("auth/signup", {
      errorMessage: "Password too weak",
      body: req.body
    });
  } else {
    const salt = bcrypt.genSaltSync(13);
    const hashedPassword = bcrypt.hashSync(body.password, salt);
    // console.log("hashedPassword...", hashedPassword)
    delete body.password;

    body.passwordHash = hashedPassword;

    try {
      await User.create(body);

      res.send(body);
    } catch (err) {
        if(err.code === 11000){
            res.render("auth/signup", {errorMessage: 'Username already taken !', userInfo: req.body});
        }else{
            res.render("auth/signup", {errorMessage:err, userInfo: req.body})
        }
    }
  }
});

router.post('/login', async (req, res) => {
    // console.log('SESSION =====> ', req.session)
    const body = req.body
   
    const userMatch = await User.find({ username: body.username })
    // console.log(userMatch)

    if (userMatch.length) {
      const user = userMatch[0]
        const passwordMatch = bcrypt.compareSync(body.password, user.passwordHash)
      if (passwordMatch) {
        const userData = {
            username: user.username,
          }
          req.session.user = userData
          res.redirect('/profile')
      } else {
        // Incorrect password
      }
    } else {
      // User not found
    }
  })
  
  
module.exports = router;
