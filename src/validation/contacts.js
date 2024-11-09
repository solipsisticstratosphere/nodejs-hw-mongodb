import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Имя должно быть строкой',
    'string.min': 'Имя должно содержать не менее {#limit} символов',
    'string.max': 'Имя должно содержать не более {#limit} символов',
    'any.required': 'Имя обязательно для заполнения',
  }),
  phoneNumber: Joi.string().min(6).max(16).required().messages({
    'string.base': 'Номер телефона должен быть строкой',
    'number.min': 'Номер телефона должен содержать не менее {#limit} цифр',
    'number.max': 'Номер телефона должен содержать не более {#limit} цифр',
    'any.required': 'Номер телефона обязателен для заполнения',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email должен быть строкой',
    'string.email': 'Email должен быть действительным',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Поле "Избранный" должно быть логическим значением',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'string.base': 'Тип контакта должен быть строкой',
      'any.only':
        'Тип контакта должен быть одним из следующих: work, home, personal',
      'any.required': 'Тип контакта обязателен для заполнения',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.base': 'Имя должно быть строкой',
    'string.min': 'Имя должно содержать не менее {#limit} символов',
    'string.max': 'Имя должно содержать не более {#limit} символов',
  }),
  phoneNumber: Joi.number().integer().min(6).max(16).messages({
    'number.base': 'Номер телефона должен быть числом',
    'number.integer': 'Номер телефона должен быть целым числом',
    'number.min': 'Номер телефона должен содержать не менее {#limit} цифр',
    'number.max': 'Номер телефона должен содержать не более {#limit} цифр',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email должен быть строкой',
    'string.email': 'Email должен быть действительным',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Поле "Избранный" должно быть логическим значением',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')

    .messages({
      'string.base': 'Тип контакта должен быть строкой',
      'any.only':
        'Тип контакта должен быть одним из следующих: work, home, personal',
    }),
});
