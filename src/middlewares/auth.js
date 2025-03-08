const adminAuth = (req, res, next) => {
  console.log("Admin Auth middleware");
  const token = "Priyanshi";
  if (token !== "Priyanshi") res.status(401).send("Unauthorized access");
  else next();
};

const userAuth = (req, res, next) =>{
    console.log("User Auth middleware");
    const token = "user";
    if(token !== "usr")
        res.status(401).send("user not authorized");
    else next();
}

module.exports = { adminAuth, userAuth };
