const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const userSchema = Joi.object().keys({
    "ContactNumber": Joi.string(),
    "FirstName": Joi.string(),
    "Gender": Joi.string(),
    "LastName": Joi.string()
})
.when(Joi.ref('$action'), {
    "is": validationMiddleware.POST,
    "then": Joi.object({
        "ContactNumber": Joi.string(),
        "FirstName": Joi.string(),
        "Gender": Joi.string()
            .valid('ACCEPTED', 'REJECTED', 'PENDING')
            .required(),
        "LastName": Joi.string()
    })
});

module.exports = {
    userSchema
}
