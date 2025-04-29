function errorHandler(error, req, res, next) {
  //   console.log("Request URL:", req, originalUrl);
  //   console.log("Request method:", req.method);

  //   console.log(error, "<<< err");
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({ message: error.errors[0].message });
  }
  if (error.name === "BadRequest") {
    return res.status(400).json({ message: error.message });
  }
  if (error.name === "Unauthorized") {
    return res.status(401).json({ message: error.message });
  }
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (error.name === "Forbidden") {
    return res.status(403).json({ message: error.message });
  }
  if (error.name === "NotFound") {
    return res.status(404).json({ message: error.message });
  }
  // Handling untuk error dengan properti statusCode (seperti yang digunakan di getHeroById)
  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  res.status(500).json({ message: "Internal server error" });
}
module.exports = errorHandler;
