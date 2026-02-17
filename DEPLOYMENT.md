# Deployment Guide

This guide walks you through deploying Smart Bookmarks to Vercel in under 5 minutes.

## Prerequisites

- A GitHub account
- A Supabase project with tables created and Google OAuth configured
- A Vercel account (free)

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Smart Bookmarks app"

# Create main branch
git branch -M main

# Add your GitHub repo
git remote add origin <your-github-repo-url>

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repo (you may need to authorize GitHub access)
5. By default, Vercel will detect Next.js - click **"Continue"**
6. Go to **Environment Variables** section:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add `SUPABASE_SERVICE_ROLE_KEY`
7. Click **"Deploy"**
8. Wait for deployment (2-3 minutes)
9. Click your Vercel project link to open your live app!

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy (interactive)
vercel

# For production deployment
vercel --prod
```

### 3. Update Google OAuth Settings

Your app is now live! But we need to update Google OAuth to allow your new domain:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **Credentials** → Your OAuth 2.0 Client
4. Edit the OAuth client
5. Add your Vercel domain to **Authorized JavaScript origins**:
   - `https://your-project-name.vercel.app`
6. Keep the redirect URI the same (Supabase URL)
7. Save

### 4. Test Your Live App

1. Open `https://your-project-name.vercel.app` in your browser
2. Click **"Sign in with Google"**
3. Sign in with your Google account
4. Add a bookmark
5. Open another tab with the same URL
6. You should see your bookmark appear in real-time!

## Custom Domain (Optional)

To use your own domain:

1. In Vercel dashboard, go to your project settings
2. Click **"Domains"**
3. Enter your domain and follow the instructions
4. Update your domain's DNS records (provided by Vercel)
5. Update Google OAuth to allow your custom domain

## Environment Variables

You can manage environment variables in Vercel dashboard:

1. Go to Project Settings
2. Click **"Environment Variables"**
3. Add/edit variables
4. Redeploy for changes to take effect

Or via CLI:
```bash
vercel env ls          # List all variables
vercel env add         # Add a variable
vercel env rm          # Remove a variable
vercel env pull        # Pull to .env.local
```

## Monitoring & Logs

### View Deployment Logs

```bash
vercel logs <project-name>
```

### View Live Logs

```bash
vercel logs <project-name> --follow
```

### Check Function Executions

1. Vercel dashboard → Your project
2. Click **"Functions"** tab
3. See all API calls and their execution times

## Rollback to Previous Deployment

If something goes wrong:

1. Vercel dashboard → **Deployments**
2. Find the previous successful deployment
3. Click the three dots
4. Click **"Promote to Production"**

## Debugging

### App won't load
- Check Vercel deployment logs: `vercel logs <project>`
- Verify environment variables are set in Vercel dashboard
- Check browser console for errors (F12)

### Sign in fails
- Verify Google OAuth redirect URLs include your Vercel domain
- Check that Supabase anon key is correct in `.env.local`
- Check browser console for error messages

### Bookmarks not appearing
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- Check Supabase database RLS policies are enabled
- Check browser console for network errors

## Performance Tips

1. **Enable Vercel Analytics** - Track Core Web Vitals
2. **Check Deployment Size** - Minimize dependencies
3. **Use Vercel Edge Functions** - For faster response times
4. **Enable Image Optimization** - Use Next.js Image component

## Updating Your App

To deploy updates:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel automatically deploys when you push to `main` branch!

## Database Backups

Regular backups are important:

1. Go to Supabase dashboard
2. Click **"Database"** → **"Backups"**
3. Set up automatic backups
4. Download backups regularly for safety

## Health Checks

Monitor your app's health:

```bash
# Check if site is up
curl https://your-project-name.vercel.app/

# Check Google Sign In page
curl https://your-project-name.vercel.app/login
```

## Troubleshooting Deployment Issues

### "Build failed"
- Check the build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Run `npm run build` locally first

### "Environment variable is not defined"
- Verify variable name in Vercel matches your code
- Remember `NEXT_PUBLIC_` prefix for frontend variables
- Redeploy after adding variables

### "Supabase connection refused"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify Supabase project is active
- Check for Supabase project pausing (happens during inactivity)

## Success!

Your app is live! 🎉

Share your link and start bookmarking!

---

**Need help?** Check the main [README.md](../README.md) for detailed troubleshooting.
