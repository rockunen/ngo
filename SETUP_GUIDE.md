# NGO Donation Website - Complete Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

### Local Development Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ngo

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Fill in all environment variables (see below)

# 5. Start development server
npm run dev

# Visit http://localhost:3000
```

---

## 📋 Environment Variables Setup

### 1. **Supabase Setup** (Database)

Visit: https://supabase.com

```bash
# 1. Create new project
# 2. Go to Settings → API
# Copy these values:

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Database Schema** - Run this in Supabase SQL Editor:

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

-- Projects Table (Optional - if not using Sanity)
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

-- Indexes for performance
CREATE INDEX idx_donors_email ON donors(email);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_razorpay_order ON donations(razorpay_order_id);
```

---

### 2. **Razorpay Setup** (Payment Gateway)

Visit: https://razorpay.com

```bash
# 1. Create business account
# 2. Dashboard → Settings → API Keys
# 3. Copy Test/Live keys

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Test Mode Credentials:**

- Card: 4111111111111111
- Expiry: 12/25
- CVV: 123

---

### 3. **Email Setup** (Nodemailer + Gmail)

```bash
# 1. Enable 2FA on Gmail account
# 2. Generate App Password:
#    - Visit: https://myaccount.google.com/apppasswords
#    - Select "Mail" and "Windows Computer"
#    - Copy the 16-character password

EMAIL_FROM=noreply@saverana.org
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

---

### 4. **Sanity CMS Setup** (Optional - Content Management)

```bash
# 1. Visit: https://sanity.io
# 2. Create new project
# 3. Get your Project ID

NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_api_token
```

---

### 5. **Application URLs**

```bash
# For local development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For production
# NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Admin email for notifications
ADMIN_EMAIL=admin@saverana.org
```

---

## 📁 Project Structure

```
ngo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── donations/
│   │   │       ├── create/route.ts
│   │   │       └── verify/route.ts
│   │   ├── about/page.tsx
│   │   ├── donate/page.tsx
│   │   ├── donate/success/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx (Home)
│   │   └── globals.css
│   ├── components/
│   │   └── DonationForm.tsx
│   └── lib/
│       ├── supabase.ts
│       ├── razorpay.ts
│       ├── email.ts
│       ├── sanity.ts
│       ├── types.ts
│       └── useDonation.ts
├── public/
├── .env.local (not in git)
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

---

## 🌐 Deployment Guide

### Option 1: **Vercel** (Recommended for Next.js)

**Benefits:**

- Zero-config deployment
- Automatic SSL
- Edge functions
- Free tier available

**Steps:**

1. Push code to GitHub
2. Visit: https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add Environment Variables:
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`
6. Click Deploy

**Custom Domain:**

- Domains → Add Domain
- Update DNS records (shown on Vercel)

---

### Option 2: **Netlify**

**Steps:**

1. Connect GitHub repository
2. Build settings:
   - Command: `npm run build`
   - Publish: `.next`
3. Deploy settings:
   - Add environment variables
4. Deploy site

---

### Option 3: **Self-hosted on Render/Railway**

**Render.com:**

```bash
# 1. Connect GitHub repo
# 2. Select Node.js environment
# 3. Build command: npm run build
# 4. Start command: npm start
# 5. Add environment variables
# 6. Deploy
```

---

## ✅ Testing Payment Flow

### Development Testing

```bash
# 1. Start dev server
npm run dev

# 2. Go to http://localhost:3000/donate

# 3. Fill donation form:
   - Name: Test Donor
   - Email: test@example.com
   - Phone: 9999999999
   - Amount: ₹500

# 4. Click "Donate"

# 5. Use test card:
   - Card: 4111111111111111
   - Expiry: 12/25
   - CVV: 123
   - OTP: 000000

# 6. Verify:
   - Check Supabase database
   - Check email receipt
   - Verify donation record in dashboard
```

---

## 🔒 Security Best Practices

### Environment Variables

- ✅ Never commit `.env.local`
- ✅ Use `.env.example` for template
- ✅ Rotate secrets regularly
- ✅ Use different keys for dev/prod

### API Security

- ✅ Verify Razorpay signatures server-side
- ✅ Use service role keys only on server
- ✅ Validate input with Zod schemas
- ✅ Set CORS properly

### Database Security

- ✅ Use anon key for client operations
- ✅ Use service role key for server only
- ✅ Enable Row Level Security (RLS)
- ✅ Regular backups

---

## 📊 Monitoring & Analytics

### Recommended Tools

1. **Vercel Analytics** (free with Vercel)
2. **Google Analytics 4**
3. **Sentry** (error tracking)

### Add Google Analytics

```tsx
// src/app/layout.tsx
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

---

## 🚨 Production Checklist

- [ ] Update all environment variables for production
- [ ] Disable debug logging
- [ ] Enable HTTPS
- [ ] Set up custom domain
- [ ] Configure email templates
- [ ] Test payment flow with live keys
- [ ] Set up error monitoring (Sentry)
- [ ] Enable analytics
- [ ] Create backup strategy
- [ ] Set up SSL certificate
- [ ] Configure security headers
- [ ] Test on mobile devices
- [ ] Performance optimization

---

## 🐛 Troubleshooting

### Razorpay Payment Not Working

```
1. Check Razorpay keys are correct
2. Verify NEXT_PUBLIC_RAZORPAY_KEY_ID is public key
3. Check RAZORPAY_KEY_SECRET is secret key
4. Ensure signature verification matches
```

### Email Not Sending

```
1. Enable 2FA on Gmail account
2. Generate App Password (not regular password)
3. Check SMTP credentials
4. Verify firewall allows SMTP 587
5. Check email address format
```

### Database Connection Issues

```
1. Verify Supabase URL and keys
2. Check database tables are created
3. Ensure RLS policies allow access
4. Check network/firewall settings
5. Review Supabase logs
```

### Build Errors

```
1. Delete node_modules and package-lock.json
2. Run: npm install
3. Check Node.js version (18+)
4. Clear .next folder
5. Try: npm run build
```

---

## 🎯 Future Enhancements

### Phase 2 Features

- [ ] Recurring donations / subscriptions
- [ ] Donor dashboard / profile
- [ ] Admin panel for managing donations
- [ ] Advanced analytics and reports
- [ ] Multi-language support
- [ ] Dark mode

### Phase 3 Features

- [ ] Corporate giving programs
- [ ] Matching donations
- [ ] Fundraising campaigns
- [ ] Event management
- [ ] Volunteer tracking
- [ ] Impact tracking dashboard

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Razorpay Docs**: https://razorpay.com/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev

---

## 📄 License & Attribution

This project is built with:

- Next.js 16 + React 19
- Tailwind CSS 4
- Supabase
- Razorpay
- Sanity CMS

---

**Last Updated**: December 2024
**Status**: Production Ready ✅
