// Input validation middleware

export const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (username && username.length > 50) {
    errors.push('Username must not exceed 50 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('Email is required');
  }

  if (!password || !password.trim()) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  next();
};

export const validateHelpRequest = (req, res, next) => {
  const { title, description, category } = req.body;
  const errors = [];

  if (!title || title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }

  if (title && title.length > 200) {
    errors.push('Title must not exceed 200 characters');
  }

  if (description && description.length > 5000) {
    errors.push('Description must not exceed 5000 characters');
  }

  const validCategories = ['Technical Support', 'Development', 'Design', 'Documentation', 'General'];
  if (category && !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  const validUrgencyLevels = ['Low', 'Medium', 'High', 'Critical'];
  if (req.body.urgencyLevel && !validUrgencyLevels.includes(req.body.urgencyLevel)) {
    errors.push(`Urgency level must be one of: ${validUrgencyLevels.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  next();
};

export const validateUpdateRequest = (req, res, next) => {
  const { title, description, status } = req.body;
  const errors = [];

  if (title !== undefined && title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  }

  if (description !== undefined && description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }

  if (title && title.length > 200) {
    errors.push('Title must not exceed 200 characters');
  }

  if (description && description.length > 5000) {
    errors.push('Description must not exceed 5000 characters');
  }

  const validStatuses = ['Open', 'In Progress', 'Completed', 'Closed'];
  if (status && !validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  next();
};

export const sanitizeInput = (req, res, next) => {
  // Trim string inputs to prevent whitespace-only submissions
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};
