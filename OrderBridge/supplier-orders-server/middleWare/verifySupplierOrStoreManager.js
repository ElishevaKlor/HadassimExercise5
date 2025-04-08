const verifyUserOrAdmin = (req, res, next) => {
    if (req.user?.role !== "storeManager" && req.user?.role !== "supplier") {
      return res.status(401).json({ error: true, message: "UnAuthorized Admin", data: null });
    }
    next();
  };
  
  module.exports = verifyUserOrAdmin;
  