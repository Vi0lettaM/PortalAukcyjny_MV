exports.isClient = (req, res, next) => {
    if (req.session.user.role !== "client")
        return res.send("Brak dostępu");
    next();
};

exports.isSeller = (req, res, next) => {
    if (req.session.user.role !== "seller")
        return res.send("Brak dostępu");
    next();
};
