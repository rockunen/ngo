# NGO Donation Website - Setup Guide

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Payment Gateway**: Razorpay (Primary), Stripe (Optional)
- **CMS**: Sanity (Content Management)
- **Email**: Nodemailer
- **Hosting**: Vercel (recommended for Next.js)

## Environment Setup

### 1. Supabase Setup

```bash
# Create Supabase account at https://supabase.com
# Create a new project
# Get your credentials from Project Settings
```

**Database Schema** (Run in Supabase SQL Editor):

```sql
-- Donors Table
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  pan_number VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  receive_newsletter BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Donations Table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES donors(id),
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  donation_type VARCHAR(20) NOT NULL,
  project_id VARCHAR(255),
  message TEXT,
  razorpay_order_id VARCHAR(255) UNIQUE,
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  receipt_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Donation Receipts Table
CREATE TABLE donation_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES donations(id),
  receipt_number VARCHAR(255) UNIQUE,
  receipt_url TEXT,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  target_amount INTEGER,
  current_amount INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_donors_email ON donors(email);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_razorpay_order ON donations(razorpay_order_id);
```

### 2. Razorpay Setup

```bash
# Create account at https://razorpay.com
# Get API Key ID and Key Secret from Dashboard > Settings > API Keys
# Test mode keys for development, Live keys for production
```

### 3. Sanity CMS Setup

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Create new Sanity project
sanity init

# Create schemas in studio/schemas/
# Example: studio/schemas/project.js
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
    },
  ],
}
```

### 4. Email Setup (Gmail)

```bash
# Enable 2FA in Gmail
# Generate App Password: https://myaccount.google.com/apppasswords
# Use App Password in SMTP_PASSWORD
```

### 5. Local Development

```bash
# Clone repository
git clone <your-repo>
cd ngo

# Install dependencies
npm install

# Create .env.local with credentials from above
cp .env.example .env.local
# Fill in all credentials

# Start development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
ngo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── donations/
│   │   │       ├── create/
│   │   │       └── verify/
│   │   ├── donate/
│   │   │   └── success/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Home)
│   │   └── globals.css
│   ├── components/
│   │   └── DonationForm.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── razorpay.ts
│   │   ├── email.ts
│   │   ├── sanity.ts
│   │   └── types.ts
│   └── styles/
├── public/
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## Key Features

### 1. Donation Flow

- User fills donation form
- Frontend creates order via `/api/donations/create`
- Razorpay modal opens for payment
- After payment, verify signature via `/api/donations/verify`
- Send receipt email automatically
- Redirect to success page

### 2. Database Operations

- Donors stored with contact info
- Donations tracked with payment status
- Receipts generated and sent via email
- Support for one-time and monthly donations

### 3. Payment Security

- Razorpay signature verification
- No payment data stored locally
- Service role key only for server operations
- Anon key for client operations

## Deployment Guide

### Vercel Deployment

```bash
# Connect GitHub repository to Vercel
# Add environment variables in Vercel dashboard
# Deploy automatically on git push
```

### Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
EMAIL_FROM
NEXT_PUBLIC_APP_URL
ADMIN_EMAIL
```

## Testing Payments

### Razorpay Test Mode

Use these test card details:

- Card Number: 4111111111111111
- Expiry: 12/25
- CVV: 123

## Future Enhancements

1. **Admin Dashboard**

   - View all donations
   - Generate reports
   - Manage projects
   - Send newsletters

2. **Advanced Features**

   - Recurring donations
   - Corporate giving
   - Donation matching
   - Donor recognition program

3. **International Support**

   - Stripe integration for international payments
   - Multi-currency support
   - Translation support

4. **Analytics**
   - Donation trends
   - Donor retention analysis
   - Impact metrics

## Support & Resources

- Supabase Docs: https://supabase.com/docs
- Razorpay Docs: https://razorpay.com/docs/
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
