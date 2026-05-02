class User {
  constructor({ id, name, email, password, role }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role || 'user';
  }

  static create({ id, name, email, password, role }) {
    if (!name || name.trim() === '') {
      throw new Error('Name is required');
    }
    if (!email || email.trim() === '') {
      throw new Error('Email is required');
    }
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    return new User({ id, name, email, password, role });
  }
}

module.exports = User;
