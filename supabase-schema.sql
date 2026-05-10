-- Loan Lead Management System - Supabase Schema

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS completed_loans;
DROP TABLE IF EXISTS running_loans;
DROP TABLE IF EXISTS admins;

-- Admins table (managed by superadmin, no self-signup)
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Running Loans (Leads) table
CREATE TABLE running_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sno INTEGER,
  customer_name TEXT NOT NULL,
  lap NUMERIC,
  sme NUMERIC,
  hl NUMERIC,
  personal NUMERIC,
  edu_loan NUMERIC,
  bank_1 TEXT,
  bank_2 TEXT,
  bank_3 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Completed Loans table
CREATE TABLE completed_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sno INTEGER,
  customer_name TEXT NOT NULL,
  phone TEXT,
  loan_type TEXT,
  loan_amount NUMERIC,
  interest_rate NUMERIC,
  emi NUMERIC,
  month_label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert hardcoded admin (password: Admin@123)
-- Note: Password is validated in backend service, not stored in DB for MVP
-- For future use, generate bcrypt hash: bcrypt.hashSync('Admin@123', 10)
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2b$10$rOqTW9pQD0aJpQD0aJpQD0OqTW9pQD0aJpQD0aJpQD0aJpQD0aJ');

-- Create indexes for better query performance
CREATE INDEX idx_running_loans_sno ON running_loans(sno);
CREATE INDEX idx_running_loans_customer ON running_loans(customer_name);
CREATE INDEX idx_completed_loans_sno ON completed_loans(sno);
CREATE INDEX idx_completed_loans_customer ON completed_loans(customer_name);

-- Row Level Security (optional - backend uses service role key)
-- ALTER TABLE running_loans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE completed_loans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
