/**
 * Data validation plugin for @oxog/collections
 * Provides comprehensive validation utilities for different data types
 */

const { createPlugin } = require('../../dist/plugins/createPlugin.js');

/**
 * Configuration for the validation plugin
 */
const DEFAULT_CONFIG = {
  strictMode: false,
  customErrorMessages: {},
  enableDetailedErrors: true,
  maxStringLength: 10000,
  maxArrayLength: 10000,
  maxObjectDepth: 100
};

/**
 * Custom validation error class
 */
class ValidationError extends Error {
  constructor(message, field, value, rule) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.rule = rule;
  }
}

/**
 * Validation helpers
 */
const validators = {
  // Type validators
  isString: (value) => typeof value === 'string',
  isNumber: (value) => typeof value === 'number' && !isNaN(value),
  isInteger: (value) => Number.isInteger(value),
  isFloat: (value) => typeof value === 'number' && !isNaN(value) && !Number.isInteger(value),
  isBoolean: (value) => typeof value === 'boolean',
  isArray: (value) => Array.isArray(value),
  isObject: (value) => value !== null && typeof value === 'object' && !Array.isArray(value),
  isFunction: (value) => typeof value === 'function',
  isDate: (value) => value instanceof Date && !isNaN(value),
  isRegExp: (value) => value instanceof RegExp,
  isNull: (value) => value === null,
  isUndefined: (value) => value === undefined,
  isNullish: (value) => value == null,
  
  // String validators
  isEmail: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof value === 'string' && emailRegex.test(value);
  },
  
  isUrl: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  
  isUuid: (value) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return typeof value === 'string' && uuidRegex.test(value);
  },
  
  isPhoneNumber: (value) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return typeof value === 'string' && phoneRegex.test(value);
  },
  
  isAlphanumeric: (value) => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return typeof value === 'string' && alphanumericRegex.test(value);
  },
  
  isAlpha: (value) => {
    const alphaRegex = /^[a-zA-Z]+$/;
    return typeof value === 'string' && alphaRegex.test(value);
  },
  
  isNumeric: (value) => {
    const numericRegex = /^[0-9]+$/;
    return typeof value === 'string' && numericRegex.test(value);
  },
  
  // Number validators
  isPositive: (value) => typeof value === 'number' && value > 0,
  isNegative: (value) => typeof value === 'number' && value < 0,
  isZero: (value) => value === 0,
  isEven: (value) => typeof value === 'number' && value % 2 === 0,
  isOdd: (value) => typeof value === 'number' && value % 2 !== 0,
  
  // Range validators
  inRange: (value, min, max) => {
    return typeof value === 'number' && value >= min && value <= max;
  },
  
  minLength: (value, min) => {
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length >= min;
    }
    return false;
  },
  
  maxLength: (value, max) => {
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length <= max;
    }
    return false;
  },
  
  exactLength: (value, length) => {
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length === length;
    }
    return false;
  },
  
  // Pattern validators
  matches: (value, pattern) => {
    if (typeof value !== 'string') return false;
    const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    return regex.test(value);
  },
  
  // Collection validators
  isEmpty: (value) => {
    if (value == null) return true;
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length === 0;
    }
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
    return false;
  },
  
  isNotEmpty: (value) => !validators.isEmpty(value),
  
  contains: (collection, item) => {
    if (typeof collection === 'string') {
      return collection.includes(item);
    }
    if (Array.isArray(collection)) {
      return collection.includes(item);
    }
    if (typeof collection === 'object' && collection !== null) {
      return Object.values(collection).includes(item);
    }
    return false;
  },
  
  // Custom validators
  oneOf: (value, allowedValues) => {
    return Array.isArray(allowedValues) && allowedValues.includes(value);
  },
  
  instanceOf: (value, constructor) => {
    return value instanceof constructor;
  }
};

/**
 * Schema validator
 */
function validateSchema(data, schema, config) {
  const errors = [];
  
  function validateField(value, rules, fieldPath = '') {
    if (!rules || typeof rules !== 'object') return;
    
    // Handle required validation
    if (rules.required && (value === undefined || value === null)) {
      errors.push(new ValidationError(
        `Field ${fieldPath} is required`,
        fieldPath,
        value,
        'required'
      ));
      return; // Skip other validations if required field is missing
    }
    
    // Skip validation if value is undefined/null and not required
    if (value == null && !rules.required) return;
    
    // Type validation
    if (rules.type) {
      const typeValidator = validators[`is${rules.type.charAt(0).toUpperCase() + rules.type.slice(1)}`];
      if (typeValidator && !typeValidator(value)) {
        errors.push(new ValidationError(
          `Field ${fieldPath} must be of type ${rules.type}`,
          fieldPath,
          value,
          'type'
        ));
      }
    }
    
    // Custom validator functions
    if (rules.validator && typeof rules.validator === 'function') {
      try {
        if (!rules.validator(value)) {
          errors.push(new ValidationError(
            rules.message || `Field ${fieldPath} failed custom validation`,
            fieldPath,
            value,
            'custom'
          ));
        }
      } catch (error) {
        errors.push(new ValidationError(
          `Validation error for field ${fieldPath}: ${error.message}`,
          fieldPath,
          value,
          'custom'
        ));
      }
    }
    
    // Built-in validators
    Object.keys(rules).forEach(rule => {
      if (['required', 'type', 'validator', 'message', 'properties', 'items'].includes(rule)) {
        return; // Skip meta properties
      }
      
      const validator = validators[rule];
      if (validator) {
        const ruleValue = rules[rule];
        let isValid = false;
        
        try {
          if (typeof ruleValue === 'boolean' && ruleValue) {
            isValid = validator(value);
          } else if (Array.isArray(ruleValue)) {
            isValid = validator(value, ...ruleValue);
          } else {
            isValid = validator(value, ruleValue);
          }
        } catch (error) {
          isValid = false;
        }
        
        if (!isValid) {
          errors.push(new ValidationError(
            rules.message || `Field ${fieldPath} failed ${rule} validation`,
            fieldPath,
            value,
            rule
          ));
        }
      }
    });
    
    // Object properties validation
    if (rules.properties && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.keys(rules.properties).forEach(prop => {
        validateField(value[prop], rules.properties[prop], fieldPath ? `${fieldPath}.${prop}` : prop);
      });
    }
    
    // Array items validation
    if (rules.items && Array.isArray(value)) {
      value.forEach((item, index) => {
        validateField(item, rules.items, `${fieldPath}[${index}]`);
      });
    }
  }
  
  validateField(data, schema);
  return errors;
}

/**
 * Create the validation plugin
 */
const validationPlugin = createPlugin('validation-utils', '1.0.0')
  .description('Comprehensive data validation utilities')
  .install((system, config = DEFAULT_CONFIG) => {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    
    // Register all basic validators
    Object.keys(validators).forEach(name => {
      system.registerFunction(name, validators[name]);
    });
    
    // Schema validation
    system.registerFunction('validateSchema', (data, schema) => {
      const errors = validateSchema(data, schema, finalConfig);
      
      if (errors.length > 0) {
        if (finalConfig.strictMode) {
          throw errors[0]; // Throw first error in strict mode
        }
        return { valid: false, errors };
      }
      
      return { valid: true, errors: [] };
    });
    
    // Assertion functions
    system.registerFunction('assert', (condition, message) => {
      if (!condition) {
        throw new ValidationError(message || 'Assertion failed');
      }
    });
    
    system.registerFunction('assertType', (value, type, fieldName = 'value') => {
      const typeValidator = validators[`is${type.charAt(0).toUpperCase() + type.slice(1)}`];
      if (!typeValidator || !typeValidator(value)) {
        throw new ValidationError(`${fieldName} must be of type ${type}`);
      }
    });
    
    system.registerFunction('assertNotNull', (value, fieldName = 'value') => {
      if (value == null) {
        throw new ValidationError(`${fieldName} cannot be null or undefined`);
      }
    });
    
    system.registerFunction('assertInRange', (value, min, max, fieldName = 'value') => {
      if (!validators.inRange(value, min, max)) {
        throw new ValidationError(`${fieldName} must be between ${min} and ${max}`);
      }
    });
    
    // Sanitization functions
    system.registerFunction('sanitizeString', (str) => {
      if (typeof str !== 'string') return str;
      
      return str
        .trim() // Remove whitespace
        .replace(/[<>]/g, '') // Remove basic HTML chars
        .slice(0, finalConfig.maxStringLength); // Limit length
    });
    
    system.registerFunction('sanitizeEmail', (email) => {
      if (typeof email !== 'string') return email;
      return email.toLowerCase().trim();
    });
    
    system.registerFunction('sanitizeObject', (obj, allowedKeys) => {
      if (!validators.isObject(obj)) return obj;
      
      const sanitized = {};
      allowedKeys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = obj[key];
        }
      });
      
      return sanitized;
    });
    
    // Validation chain builder
    system.registerFunction('chain', (value) => {
      const chain = {
        value,
        errors: [],
        
        required() {
          if (value == null) {
            this.errors.push(new ValidationError('Value is required'));
          }
          return this;
        },
        
        type(expectedType) {
          const typeValidator = validators[`is${expectedType.charAt(0).toUpperCase() + expectedType.slice(1)}`];
          if (typeValidator && !typeValidator(value)) {
            this.errors.push(new ValidationError(`Value must be of type ${expectedType}`));
          }
          return this;
        },
        
        custom(validator, message) {
          try {
            if (!validator(value)) {
              this.errors.push(new ValidationError(message || 'Custom validation failed'));
            }
          } catch (error) {
            this.errors.push(new ValidationError(message || error.message));
          }
          return this;
        },
        
        validate() {
          if (this.errors.length > 0) {
            if (finalConfig.strictMode) {
              throw this.errors[0];
            }
            return { valid: false, errors: this.errors };
          }
          return { valid: true, value: this.value, errors: [] };
        }
      };
      
      // Add all validators to chain
      Object.keys(validators).forEach(name => {
        if (name.startsWith('is') || ['inRange', 'minLength', 'maxLength', 'exactLength', 'matches', 'oneOf'].includes(name)) {
          chain[name] = function(...args) {
            try {
              if (!validators[name](this.value, ...args)) {
                this.errors.push(new ValidationError(`Validation ${name} failed`));
              }
            } catch (error) {
              this.errors.push(new ValidationError(`Validation ${name} error: ${error.message}`));
            }
            return this;
          };
        }
      });
      
      return chain;
    });
    
    // Configuration
    system.registerFunction('getValidationConfig', () => finalConfig);
    system.registerFunction('setStrictMode', (strict) => {
      finalConfig.strictMode = Boolean(strict);
    });
    
    console.log(`✅ Validation Plugin installed with config:`, finalConfig);
  })
  
  .uninstall((system) => {
    const functions = [
      // Validators
      ...Object.keys(validators),
      // Schema validation
      'validateSchema',
      // Assertions
      'assert', 'assertType', 'assertNotNull', 'assertInRange',
      // Sanitization
      'sanitizeString', 'sanitizeEmail', 'sanitizeObject',
      // Chain builder
      'chain',
      // Configuration
      'getValidationConfig', 'setStrictMode'
    ];
    
    functions.forEach(fn => {
      try {
        system.unregisterFunction(fn);
      } catch (error) {
        // Function might not exist
      }
    });
    
    console.log('❌ Validation Plugin uninstalled');
  })
  
  .build();

module.exports = validationPlugin;
module.exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
module.exports.ValidationError = ValidationError;