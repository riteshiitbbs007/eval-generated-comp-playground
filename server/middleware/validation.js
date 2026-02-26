import Joi from 'joi';

// Validation schemas
export const schemas = {
  createNote: Joi.object({
    componentName: Joi.string().required().max(255),
    noteText: Joi.string().required().min(1).max(5000),
    authorName: Joi.string().optional().allow('').max(255)
  }),

  updateNote: Joi.object({
    noteText: Joi.string().required().min(1).max(5000),
    authorName: Joi.string().optional().allow('').max(255)
  }),

  componentName: Joi.object({
    componentName: Joi.string().required().max(255)
  }),

  noteId: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

// Validation middleware factory
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = source === 'params' ? req.params : req.body;

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Replace request data with validated data
    if (source === 'params') {
      req.params = value;
    } else {
      req.body = value;
    }

    next();
  };
}
