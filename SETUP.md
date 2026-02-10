# 🚀 Multi-User Daily Planner Setup - 100% FREE

## ✨ Free Forever Tech Stack
- **Database + Auth**: Supabase (500MB, 50K users)
- **Hosting**: Vercel (Unlimited bandwidth)
- **Total Cost**: $0/month forever

---

## Step 1: Create Supabase Project (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project**
3. Choose:
   - **Project Name**: planner (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Closest to you
4. Click **Create new project** and wait ~2 minutes

---

## Step 2: Get Supabase Credentials

### Get API Keys:
1. In your Supabase dashboard, go to **Project Settings** (⚙️) → **API**
2. Copy these values to your `.env` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Get Database URLs:
1. Go to **Project Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **Connection pooling** mode
4. Copy both URLs to `.env`:
```bash
# Connection pooler (for Prisma migrations)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for Prisma migrations)
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

**IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password!

---

## Step 3: Set Up Database Tables

Run these commands in your terminal:

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push
```

You should see: ✅ Database synchronized successfully!

---

## Step 4: Enable Email Auth in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Optional: Customize email templates in **Authentication** → **Email Templates**

---

## Step 5: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login)

1. Sign up with your email
2. Check your email for confirmation link
3. Click the link and you're in!

---

## Step 6: Deploy to Vercel (FREE Hosting)

### Quick Deploy:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Import Project**
4. Select your repository
5. **Add Environment Variables**:
   - Click **Environment Variables**
   - Copy all variables from your `.env` file
   - Paste them one by one
6. Click **Deploy**

Your app will be live at: `https://your-app.vercel.app` 🎉

---

## Enable Production Email Links

1. In Vercel, copy your deployment URL (e.g., `https://planner.vercel.app`)
2. Go to Supabase → **Authentication** → **URL Configuration**
3. Add your Vercel URL as:
   - **Site URL**: `https://planner.vercel.app`
   - **Redirect URLs**: `https://planner.vercel.app/**`

---

## ✅ You're Done!

Your multi-user daily planner is now:
- ✅ Deployed to production
- ✅ Accessible by anyone with the URL
- ✅ 100% free forever (within generous limits)
- ✅ Secure with email authentication
- ✅ Each user has their own isolated data

## Free Tier Limits (Supabase + Vercel)

**Supabase Free:**
- 500MB database storage
- 50,000 monthly active users
- 2GB file storage
- Unlimited API requests

**Vercel Free:**
- Unlimited bandwidth
- 100 GB-hours compute/month
- 1 custom domain per project

These limits are more than enough for thousands of users!

---

## Troubleshooting

**Can't sign in?** Make sure you clicked the confirmation link in your email. (Check your spam folder if you don't see it!)

**Database connection error?** Double-check your `DATABASE_URL` and `DIRECT_URL` in `.env` and Vercel environment variables.

**Deployment failed?** Make sure all environment variables are set in Vercel settings.
