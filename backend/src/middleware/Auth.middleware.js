function makeAuthMiddleware(jwtManager) {
  return function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return null;
    }
    res.user_id = jwtManager.verify(token);
    console.log(res.user_id);
    next();
  };
}

export default makeAuthMiddleware;
