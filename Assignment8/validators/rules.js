const { body } = require('express-validator');

const emailRule = body('email')
  .exists().withMessage('email is required')
  .bail()
  .isEmail().withMessage('email format is invalid')
  .normalizeEmail();

const fullNameRule = body('fullName')
  .optional({ nullable: true })
  .trim()
  .matches(/^[A-Za-z ]+$/).withMessage('fullName must contain only alphabetic characters and spaces')
  .isLength({ min: 2 }).withMessage('fullName must be at least 2 characters');

const fullNameRequiredRule = body('fullName')
  .exists().withMessage('fullName is required')
  .bail()
  .trim()
  .matches(/^[A-Za-z ]+$/).withMessage('fullName must contain only alphabetic characters and spaces')
  .isLength({ min: 2 }).withMessage('fullName must be at least 2 characters');

const passwordRule = body('password')
  .exists().withMessage('password is required')
  .bail()
  .isLength({ min: 8 }).withMessage('password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('password must include at least one uppercase letter')
  .matches(/[a-z]/).withMessage('password must include at least one lowercase letter')
  .matches(/[0-9]/).withMessage('password must include at least one digit')
  .matches(/[!@#$%^&*(),.?":{}|<>\-_+=\[\]\\\/;'`~]/).withMessage('password must include at least one special character');

const passwordOptionalRule = body('password')
  .optional()
  .isLength({ min: 8 }).withMessage('password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('password must include at least one uppercase letter')
  .matches(/[a-z]/).withMessage('password must include at least one lowercase letter')
  .matches(/[0-9]/).withMessage('password must include at least one digit')
  .matches(/[!@#$%^&*(),.?":{}|<>\-_+=\[\]\\\/;'`~]/).withMessage('password must include at least one special character');

module.exports = {
  emailRule,
  fullNameRule,
  fullNameRequiredRule,
  passwordRule,
  passwordOptionalRule,
};
