# Setup Checklist

Follow this checklist to get the Smart Bookmarks app running on your own instance.

## Phase 1: Supabase Setup (10 minutes)

- [ ] Create a free Supabase account at [supabase.com](https://supabase.com)
- [ ] Create a new project
- [ ] Save the auto-generated password safely
- [ ] Go to **Project Settings** → **API**
- [ ] Copy and save:
  - [ ] `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Go to **SQL Editor**
- [ ] Click **"New query"**
- [ ] Copy entire contents of `database.sql` file
- [ ] Paste into Supabase SQL editor
- [ ] Click **"Run"** and verify it completes
- [ ] Go to **Database** → **Publications**
- [ ] Enable realtime for `bookmarks` table (toggle ON)

## Phase 2: Google OAuth Setup (10 minutes)

### Google Cloud Console
- [ ] Go to [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Create a new project or use existing
- [ ] Enable "Google+ API"
- [ ] Go to **Credentials**
- [ ] Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
- [ ] Select **"Web application"**
- [ ] Add Authorized JavaScript origins:
  - [ ] `http://localhost:3000` (for local development)
  - [ ] `https://yourdomain.vercel.app` (for your Vercel deployment)
- [ ] Add Authorized redirect URI:
  - [ ] Your Supabase callback URL (you'll see it in Supabase)
- [ ] Copy **Client ID** and **Client Secret**

### Supabase Console
- [ ] Go to **Authentication** → **Providers** → **Google**
- [ ] Toggle Google provider **ON**
- [ ] Paste your Google **Client ID**
- [ ] Paste your Google **Client Secret**
- [ ] Click **"Save"**

## Phase 3: Local Setup (5 minutes)

- [ ] Install Node.js 18+ (if not already installed)
- [ ] Clone this repository: `git clone <repo-url>`
- [ ] `cd bookmark`
- [ ] `npm install`
- [ ] Copy `.env.local.example` to `.env.local`:
  ```bash
  cp .env.local.example .env.local
  ```
- [ ] Open `.env.local` and fill in your values from Phases 1 & 2:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  ```
- [ ] Restart your terminal/IDE
- [ ] Run locally: `npm run dev`
- [ ] Open [http://localhost:3000](http://localhost:3000)
- [ ] Test the sign-in flow with Google
- [ ] Add a bookmark
- [ ] Open a second tab and verify real-time sync

## Phase 4: Deployment to Vercel (5 minutes)

### GitHub Setup
- [ ] Create a GitHub repository (if not already done)
- [ ] Initialize git in project: `git init`
- [ ] Add your remote: `git remote add origin <your-repo-url>`
- [ ] Push to GitHub:
  ```bash
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git push -u origin main
  ```

### Vercel Deployment
- [ ] Go to [vercel.com](https://vercel.com) and sign in
- [ ] Click **"Add New Project"**
- [ ] Import your GitHub repository
- [ ] Select Next.js (should auto-detect)
- [ ] Add Environment Variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Click **"Deploy"**
- [ ] Wait for deployment to complete (2-3 minutes)
- [ ] Click your Vercel project link to test

### Update Google OAuth
- [ ] Go back to Google Cloud Console
- [ ] Edit your OAuth client
- [ ] Add your Vercel domain to **Authorized JavaScript origins**:
  - `https://your-project-name.vercel.app`
- [ ] Save

## Phase 5: Testing (5 minutes)

### Local Testing
- [ ] Sign in with Google
- [ ] Verify you can add bookmarks
- [ ] Verify you can delete bookmarks
- [ ] Open second tab and verify real-time updates

### Remote Testing
- [ ] Open your Vercel URL
- [ ] Sign in with Google
- [ ] Add bookmarks
- [ ] Open second tab with Vercel URL
- [ ] Verify real-time sync

### Multi-user Testing (Optional)
- [ ] Invite a friend to test
- [ ] Have them sign in with their Google account
- [ ] Verify they can't see your bookmarks
- [ ] Verify their bookmarks only appear for them

## File Reference

These are the key files you'll interact with:

| File | Purpose | Editing |
|------|---------|---------|
| `.env.local` | API keys | Edit with your Supabase & Google keys |
| `database.sql` | Database setup | Run once in Supabase SQL editor |
| `DEPLOYMENT.md` | Deploy to Vercel | Reference during deployment |
| `README.md` | Full documentation | Reference for troubleshooting |

## Troubleshooting Quick Links

Having issues? Jump to:
- **Can't sign in with Google** → See README.md → Troubleshooting → "Error signing in with Google"
- **Bookmarks not syncing** → See README.md → Troubleshooting → "Real-time updates not working"
- **Environment variable errors** → See README.md → Troubleshooting → "Environment variables not loading"
- **Database errors** → See README.md → Troubleshooting → "Bookmarks not appearing"

## Success Checklist

Once everything is working, you should be able to:

- [ ] ✅ Sign in with your Google account
- [ ] ✅ Add a bookmark with title and URL
- [ ] ✅ See bookmark appear in real-time across tabs
- [ ] ✅ Delete a bookmark
- [ ] ✅ Sign out and be redirected to login
- [ ] ✅ App is live at your Vercel URL
- [ ] ✅ GitHub repository is public

## Next Steps

Congratulations! Your app is live. Now you can:

1. **Share it** - Give your Vercel URL to friends to test
2. **Customize it** - Add features like categories, search, export
3. **Monitor it** - Set up Vercel analytics and monitoring
4. **Scale it** - Upgrade Supabase plan if needed

## Need Help?

- 📖 Check [README.md](README.md) for detailed documentation
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment tips
- 🐛 Check the Troubleshooting section in README.md
- 💬 Open an issue on GitHub

---

**You've got this! 🚀**
