const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    "Birthdate": Joi.string(),
    "ContactNumber": Joi.string(),
    "FirstName": Joi.string(),
    "Gender": Joi.string()
        .valid('male', 'female'),
    "LastName": Joi.string()
})
.when(Joi.ref('$action'), {
    "is": validationMiddleware.POST,
    "then": Joi.object({
        "Birthdate": Joi.string(),
        "ContactNumber": Joi.string(),
        "FirstName": Joi.string(),
        "Gender": Joi.string()
            .valid('male', 'female'),
        "LastName": Joi.string()
    })
});

module.exports = {
    schema
}
