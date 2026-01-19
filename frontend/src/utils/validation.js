// Shared validation constants
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TITLE_MAX_LENGTH: 255,
};

export const ERROR_MESSAGES = {
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_EMAIL: 'Please provide a valid email',
  TITLE_REQUIRED: 'Title is required',
};
