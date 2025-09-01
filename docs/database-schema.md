# Dashboard PostgreSQL Schema

This document describes the database schema for the dashboard application with users, customers, and email addresses tables.

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_department ON users(department);
```

### Customers Table

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_first_name VARCHAR(100) NOT NULL,
    contact_last_name VARCHAR(100) NOT NULL,
    primary_email VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
    revenue DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_customers_company_name ON customers(company_name);
CREATE INDEX idx_customers_primary_email ON customers(primary_email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_industry ON customers(industry);
```

### Email Addresses Table

```sql
CREATE TABLE email_addresses (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('primary', 'secondary', 'billing', 'support')) DEFAULT 'primary',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure email belongs to either user or customer, not both
    CONSTRAINT check_user_or_customer CHECK (
        (user_id IS NOT NULL AND customer_id IS NULL) OR 
        (user_id IS NULL AND customer_id IS NOT NULL)
    )
);

-- Indexes for better performance
CREATE INDEX idx_email_addresses_email ON email_addresses(email);
CREATE INDEX idx_email_addresses_user_id ON email_addresses(user_id);
CREATE INDEX idx_email_addresses_customer_id ON email_addresses(customer_id);
CREATE INDEX idx_email_addresses_type ON email_addresses(type);
CREATE INDEX idx_email_addresses_is_verified ON email_addresses(is_verified);
```

## Sample Data Seeds

### Insert Sample Users

```sql
INSERT INTO users (first_name, last_name, email, department, role, status) VALUES
('John', 'Doe', 'john.doe@company.com', 'Engineering', 'Senior Developer', 'active'),
('Jane', 'Smith', 'jane.smith@company.com', 'Marketing', 'Marketing Manager', 'active'),
('Mike', 'Johnson', 'mike.johnson@company.com', 'Sales', 'Sales Representative', 'inactive'),
('Sarah', 'Wilson', 'sarah.wilson@company.com', 'HR', 'HR Specialist', 'active'),
('David', 'Brown', 'david.brown@company.com', 'Engineering', 'Tech Lead', 'active');
```

### Insert Sample Customers

```sql
INSERT INTO customers (company_name, contact_first_name, contact_last_name, primary_email, industry, status, revenue) VALUES
('TechCorp Inc.', 'Alice', 'Johnson', 'alice@techcorp.com', 'Technology', 'active', 150000.00),
('Global Solutions Ltd.', 'Bob', 'Davis', 'bob@globalsolutions.com', 'Consulting', 'active', 280000.00),
('StartupXYZ', 'Carol', 'White', 'carol@startupxyz.com', 'Technology', 'pending', 45000.00),
('Manufacturing Pro', 'Daniel', 'Miller', 'daniel@manufacturing.com', 'Manufacturing', 'active', 320000.00),
('Retail Chain Inc.', 'Emma', 'Garcia', 'emma@retailchain.com', 'Retail', 'inactive', 180000.00);
```

### Insert Sample Email Addresses

```sql
-- User emails
INSERT INTO email_addresses (email, user_id, type, is_verified) VALUES
('john.doe@company.com', 1, 'primary', true),
('john.personal@gmail.com', 1, 'secondary', true),
('jane.smith@company.com', 2, 'primary', true),
('mike.johnson@company.com', 3, 'primary', false),
('sarah.wilson@company.com', 4, 'primary', true),
('david.brown@company.com', 5, 'primary', true);

-- Customer emails
INSERT INTO email_addresses (email, customer_id, type, is_verified) VALUES
('alice@techcorp.com', 1, 'primary', true),
('billing@techcorp.com', 1, 'billing', true),
('bob@globalsolutions.com', 2, 'primary', true),
('support@globalsolutions.com', 2, 'support', true),
('carol@startupxyz.com', 3, 'primary', false),
('daniel@manufacturing.com', 4, 'primary', true),
('emma@retailchain.com', 5, 'primary', true);
```

## Relationships

1. **Users to Email Addresses**: One-to-Many
   - A user can have multiple email addresses (primary, secondary, etc.)
   - Each email address belongs to exactly one user OR one customer

2. **Customers to Email Addresses**: One-to-Many
   - A customer can have multiple email addresses (primary, billing, support, etc.)
   - Each email address belongs to exactly one user OR one customer

3. **Constraint**: Email addresses cannot belong to both a user and a customer simultaneously

## Query Examples

### Get all users with their email addresses

```sql
SELECT 
    u.first_name,
    u.last_name,
    u.department,
    u.role,
    u.status,
    e.email,
    e.type,
    e.is_verified
FROM users u
LEFT JOIN email_addresses e ON u.id = e.user_id
ORDER BY u.last_name, u.first_name, e.type;
```

### Get all customers with their email addresses

```sql
SELECT 
    c.company_name,
    c.contact_first_name,
    c.contact_last_name,
    c.industry,
    c.status,
    c.revenue,
    e.email,
    e.type,
    e.is_verified
FROM customers c
LEFT JOIN email_addresses e ON c.id = e.customer_id
ORDER BY c.company_name, e.type;
```

### Get dashboard statistics

```sql
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
    (SELECT COUNT(*) FROM customers) as total_customers,
    (SELECT COUNT(*) FROM customers WHERE status = 'active') as active_customers,
    (SELECT SUM(revenue) FROM customers) as total_revenue,
    (SELECT COUNT(*) FROM email_addresses) as total_emails;
```

### Get all email addresses with relationships

```sql
SELECT 
    e.email,
    e.type,
    e.is_verified,
    CONCAT(u.first_name, ' ', u.last_name) as user_name,
    c.company_name as customer_name
FROM email_addresses e
LEFT JOIN users u ON e.user_id = u.id
LEFT JOIN customers c ON e.customer_id = c.id
ORDER BY e.email;
```