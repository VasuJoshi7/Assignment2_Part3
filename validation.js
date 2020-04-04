const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(3)
    });
    // return Joi.validate(data,schema);
    return schema.validate(data);
}

const emailValidation = data => {
    const schema = Joi.object({
       
        email: Joi.string().required().email(),
        password: Joi.string().required().min(3)
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.emailValidation = emailValidation;