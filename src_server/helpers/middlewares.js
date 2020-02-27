function mustBeInteger(req, res, next) {
    next();
}

function checkFieldsPost(req, res, next) {
    const {name, age, brand, plateNumber, country} = req.body;

    if (name && age && brand && plateNumber && country) {
        next();
    } else {
        res.status(400).json({message: 'Fields are not good'});
    }
}

module.exports = {
    mustBeInteger,
    checkFieldsPost
};