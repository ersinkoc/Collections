/**
 * Base error class for collection operations
 */
export class CollectionError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = 'CollectionError';
    this.code = code;
    this.details = details;
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends CollectionError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when a value is out of expected range
 */
export class RangeError extends CollectionError {
  constructor(message: string, details?: unknown) {
    super(message, 'RANGE_ERROR', details);
    this.name = 'RangeError';
  }
}

/**
 * Error thrown when an operation times out
 */
export class TimeoutError extends CollectionError {
  constructor(message: string, details?: unknown) {
    super(message, 'TIMEOUT_ERROR', details);
    this.name = 'TimeoutError';
  }
}

/**
 * Error thrown when plugin operations fail
 */
export class PluginError extends CollectionError {
  constructor(message: string, details?: unknown) {
    super(message, 'PLUGIN_ERROR', details);
    this.name = 'PluginError';
  }
}

/**
 * Error thrown when type checking fails
 */
export class TypeError extends CollectionError {
  constructor(message: string, details?: unknown) {
    super(message, 'TYPE_ERROR', details);
    this.name = 'TypeError';
  }
}

/**
 * Error thrown when an operation is not implemented
 */
export class NotImplementedError extends CollectionError {
  constructor(message: string, details?: unknown) {
    super(message, 'NOT_IMPLEMENTED', details);
    this.name = 'NotImplementedError';
  }
}

/**
 * Error thrown when an invalid argument is provided
 */
export class ArgumentError extends CollectionError {
  constructor(message: string, details?: unknown) {
    super(message, 'ARGUMENT_ERROR', details);
    this.name = 'ArgumentError';
  }
}