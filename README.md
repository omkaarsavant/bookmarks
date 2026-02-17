# 📌 Smart Bookmarks App

A modern bookmark manager built with Next.js, Supabase, and Tailwind CSS. Sign in with Google, save your favorite links, and sync them in real-time across all your devices.

## Features

✅ **Google OAuth Authentication** - Secure login without passwords  
✅ **Private Bookmarks** - Each user's bookmarks are completely private  
✅ **Real-time Sync** - Updates across tabs without page refresh  
✅ **One-Click Delete** - Remove bookmarks instantly  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Zero Configuration** - Just add your API keys!

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + React
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL Database)
- **Authentication**: Supabase Auth + Google OAuth
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase project (free tier works great)
- A Google Cloud project for OAuth

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd bookmark
npm install
```

### Step 2: Set Up Supabase

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name and password
   - Wait for it to be created (2-3 minutes)

2. **Set up the database**:
   - In Supabase dashboard, go to **SQL Editor**
   - Click **"New query"**
   - Copy the entire contents of `database.sql` from this repo
   - Paste into the query editor
   - Click **"Run"**

3. **Configure Google OAuth**:
   - Go to **Supabase Dashboard** → **Authentication** → **Providers** → **Google**
   - You'll see your **Callback URL** (something like `https://xxxxx.supabase.co/auth/v1/callback`)
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project (or use existing)
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application):
     - Authorized JavaScript origins: `http://localhost:3000`, `https://yourdomain.vercel.app`
     - Authorized redirect URIs: `https://xxxxx.supabase.co/auth/v1/callback`
   - Copy **Client ID** and **Client Secret**
   - Paste them into Supabase Google provider settings
   - **Enable** the Google provider

### Step 3: Add Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in the values:
   - Get them from Supabase **Project Settings** → **API**:
     - `NEXT_PUBLIC_SUPABASE_URL` - Your project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key (public, safe for frontend)
     - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)

3. Your `.env.local` should look like:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

### Step 4: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Click **"Sign in with Google"**
- Add some bookmarks
- Open another tab and watch them sync in real-time! 🎉

## Deploy on Vercel

### Option 1: Deploy from GitHub (Recommended)

1. Push your code to GitHub:
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
   - Click **"Add New"** → **"Project"**
   - Select your GitHub repo
   - Framework: Next.js (auto-detected)
   - Click **"Deploy"**

3. Set environment variables in Vercel:
   - Go to **Settings** → **Environment Variables**
   - Add the three variables from `.env.local`
   - Click Deploy again

4. Update your Google OAuth redirect URIs to include your Vercel domain:
   - Authorized JavaScript origins: `https://yourproject.vercel.app`
   - Authorized redirect URIs: stays the same (Supabase URL)

### Option 2: Install Vercel CLI

```bash
npm i -g vercel
vercel env pull  # Pulls environment from Vercel
npm run build
vercel --prod
```

## Troubleshooting

### "Error signing in with Google"

**Problem**: OAuth popup closes immediately or shows error

**Solutions**:
1. ✓ Make sure Google provider is **enabled** in Supabase
2. ✓ Verify redirect URLs match exactly (including http:// or https://)
3. ✓ Check that Client ID and Secret are correct in Supabase
4. ✓ Clear browser cache and cookies, try incognito window
5. ✓ Check browser console for detailed error messages

### "Bookmarks not appearing"

**Problem**: Added a bookmark but it doesn't show

**Solutions**:
1. ✓ Check browser console for errors
2. ✓ Verify you're logged in (email should appear in header)
3. ✓ Verify `database.sql` was executed and table was created
4. ✓ Check that RLS policies are enabled
5. ✓ Try refreshing the page

### "Real-time updates not working"

**Problem**: Added bookmark in one tab, doesn't appear in another

**Solutions**:
1. ✓ Verify `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;` was executed
2. ✓ Check that Realtime is enabled in Supabase project settings
3. ✓ Try closing and reopening the tab
4. ✓ Check browser console for WebSocket errors

### "Environment variables not loading"

**Problem**: "NEXT_PUBLIC_SUPABASE_URL is required"

**Solutions**:
1. ✓ Restart dev server after updating `.env.local`
2. ✓ Make sure `.env.local` is in the project root (not in a folder)
3. ✓ Don't forget the `NEXT_PUBLIC_` prefix for frontend variables
4. ✓ Verify no spaces in variable values

### "Cannot delete bookmarks"

**Problem**: Delete button doesn't work or shows error

**Solutions**:
1. ✓ Verify RLS delete policy is created
2. ✓ Make sure your user_id matches in the bookmarks row
3. ✓ Check browser DevTools Network tab for 403 errors

## Architecture Notes

### Security

- **Row Level Security (RLS)**: Database policies ensure users only see their own bookmarks
- **Service Role Key**: Only used server-side for admin operations (never exposed to frontend)
- **Anon Key**: Public key only allows authenticated users to access their data
- **Google OAuth**: Managed securely by Supabase

### Real-time Sync

Uses Supabase Realtime subscriptions via PostgreSQL's LISTEN/NOTIFY:

1. User adds bookmark → PostgreSQL fires INSERT event
2. Supabase broadcast event to all clients
3. React hook receives event and updates state instantly
4. No page refresh needed!

### Database Schema

```sql
bookmarks table:
- id (UUID primary key)
- user_id (UUID, references auth.users)
- title (TEXT, required)
- url (TEXT, required)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

RLS Policies:
- SELECT: Users can only see bookmarks where `user_id = auth.uid()`
- INSERT: Users can only insert with their own `user_id`
- DELETE: Users can only delete their own bookmarks

## File Structure

```
bookmark/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── login/page.tsx        # Login page
│   ├── auth/callback/route.ts # OAuth callback
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── Header.tsx            # App header + sign out
│   ├── BookmarkForm.tsx      # Add bookmark form
│   ├── BookmarkCard.tsx      # Individual bookmark
│   └── BookmarkList.tsx      # List of bookmarks
├── hooks/
│   ├── useAuth.ts            # Auth state & methods
│   └── useBookmarks.ts       # Bookmarks & real-time sync
├── lib/
│   └── supabase.ts           # Supabase client
├── .env.local.example        # Environment template
├── database.sql              # Database setup script
└── vercel.json               # Vercel deployment config
```

## Key Implementation Details

### useAuth Hook

- Manages authentication state
- Handles Google OAuth sign-in
- Auto-redirects to login if not authenticated
- Provides `signOut` function

### useBookmarks Hook

- Fetches user's bookmarks on mount
- Subscribes to real-time changes via Supabase channel
- Updates local state instantly when bookmarks change
- Provides `addBookmark` and `deleteBookmark` functions
- Handles errors gracefully

### Real-time Flow

```
Database change → Supabase monitors table → 
Browser receives event → useBookmarks updates state → 
Component re-renders with new bookmark
```

## Environment Variables Reference

| Variable | Type | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Anon key from Supabase (safe for frontend) |
| `SUPABASE_SERVICE_ROLE_KEY` | Private | Service role key (for server-only operations) |

**Note**: Variables starting with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets in them.

## Performance Optimizations

- Lazy loading bookmarks with loading states
- Optimistic UI updates (delete shows immediately)
- Debounced real-time subscriptions
- Memoized components to prevent unnecessary re-renders
- CSS modules and Tailwind for minimal bundle size

## Future Enhancements

- Search/filter bookmarks
- Categories/tags for organization
- Import/export bookmarks
- Dark mode
- Custom icons for bookmarks
- Sharing bookmarks with others
- Edit existing bookmarks
- Bulk operations

## License

MIT - Feel free to use this project for personal or commercial use.

## Support

If you run into issues:

1. Check the **Troubleshooting** section above
2. Review Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
3. Check Next.js documentation: [nextjs.org](https://nextjs.org)
4. Open an issue on GitHub

## Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Deployed on Vercel** - Lightning-fast performance  

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Authentication**: Google OAuth via Supabase
- **Deployment**: Vercel

## Quick Start Setup

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great)
- A Google Cloud project for OAuth

### Step 1: Clone or Download the Project

```bash
# If cloning from GitHub
git clone <your-repo-url>
cd bookmark

# Or just download this folder
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Supabase

#### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose a name (e.g., "smart-bookmarks")
4. Create a password for the database
5. Select your region
6. Wait for the project to be created

#### 3.2 Get Your API Keys

1. Once created, go to **Project Settings** → **API**
2. Copy `Project URL` (this is `NEXT_PUBLIC_SUPABASE_URL`)
3. Copy `anon` key (this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Copy `service_role` key (this is `SUPABASE_SERVICE_ROLE_KEY`)

#### 3.3 Create the Database Tables

1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste this SQL:

```sql
-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(id)
);

-- Create index for faster queries
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX bookmarks_created_at_idx ON bookmarks(created_at DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy: Users can only insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
ON bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can only delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
ON bookmarks
FOR DELETE
USING (auth.uid() = user_id);

-- Create policy: Users can only update their own bookmarks
CREATE POLICY "Users can update their own bookmarks"
ON bookmarks
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

4. Click "Run" to execute the SQL
5. You should see "Success" messages

#### 3.4 Enable Realtime for Bookmarks Table

1. In Supabase, go to **Database** → **Publications**
2. Under "supabase_realtime", toggle the `bookmarks` table ON
3. This enables real-time updates

### Step 4: Set Up Google OAuth

#### 4.1 Create a Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Enable the "Google+ API"
4. Go to **Credentials**
5. Click "Create Credentials" → "OAuth client ID"
6. Choose "Web application"
7. Add authorized redirect URIs:
   - For local testing: `http://localhost:3000/auth/callback`
   - For production: `https://your-vercel-url.vercel.app/auth/callback`
8. Save your **Client ID** and **Client Secret**

#### 4.2 Configure Google OAuth in Supabase

1. In Supabase, go to **Authentication** → **Providers**
2. Find "Google" and toggle it ON
3. Paste your Google OAuth **Client ID**
4. Paste your Google OAuth **Client Secret**
5. Click "Save"

### Step 5: Configure Environment Variables

1. Rename `.env.local.example` to `.env.local` (or copy it):
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

   > **Note**: The variables starting with `NEXT_PUBLIC_` are exposed to the browser (safe for public API keys). The `SUPABASE_SERVICE_ROLE_KEY` stays private and is only used on the server.

### Step 6: Test Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

1. Click "Sign in with Google"
2. Authorize with your Google account
3. Add a bookmark
4. Open another tab with the same URL to test real-time sync
5. Changes should appear instantly

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Select your repository
5. Configure environment variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add `SUPABASE_SERVICE_ROLE_KEY`
6. Click "Deploy"

### Step 3: Update Google OAuth Redirect URL

1. Go to Google Cloud Console
2. Update the redirect URI to your Vercel URL:
   ```
   https://your-project-name.vercel.app/auth/callback
   ```
3. Update the same URL in Supabase settings

## Troubleshooting

### Issue: "Not authenticated" error when trying to add bookmarks

**Solution:** Ensure you're logged in. If you see a blank page, clear your browser cache and refresh.

### Issue: Bookmarks not appearing in real-time

**Solution:** 
- Check that the `bookmarks` table is enabled in Supabase Realtime publications
- Verify that Row Level Security (RLS) policies are correctly applied
- Check browser console for errors

### Issue: Google Sign-in shows redirect error

**Solution:**
- Verify the redirect URI in Google Cloud Console matches your app URL
- Ensure you've updated both Google Cloud Console AND Supabase settings
- Check that `.env.local` has the correct Supabase keys

### Issue: Database errors when adding bookmarks

**Solution:**
- Verify all SQL has been run in Supabase SQL Editor
- Check that RLS policies are enabled (`ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY`)
- Ensure the `bookmarks` table exists with correct columns

### Issue: "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Solution:**
- Create `.env.local` file with all required environment variables
- Make sure you restarted the dev server after creating the file
- Variable names are case-sensitive

## Problems Encountered & Solutions

### 1. **Deprecated Auth Helpers Package**
   - **Problem**: The initial `@supabase/auth-helpers-nextjs` package was showing deprecation warnings
   - **Solution**: Simplified the auth approach using direct `@supabase/supabase-js` client with custom `createClient` exports

### 2. **Real-time Subscriptions Cleanup**
   - **Problem**: Real-time listeners weren't properly cleaning up, causing memory leaks
   - **Solution**: Added proper cleanup in the `useEffect` hook by calling `supabase.removeChannel()` in the return function

### 3. **Row Level Security (RLS) Initial Confusion**
   - **Problem**: Users could see all bookmarks initially because RLS wasn't properly configured
   - **Solution**: Added comprehensive RLS policies that check `auth.uid() = user_id` for all operations

### 4. **OAuth Redirect Flow**
   - **Problem**: The callback route wasn't properly handling the OAuth code exchange
   - **Solution**: Implemented proper `exchangeCodeForSession` method in the callback handler

### 5. **Real-time Channel Subscription Pattern**
   - **Problem**: Subscribing to realtime changes without filtering by user_id would load all changes
   - **Solution**: Added proper filter in the subscription: `filter: 'user_id=eq.${userId}'`

### 6. **Type Safety with Supabase Clients**
   - **Problem**: TypeScript was having issues with the `createClient` function signature
   - **Solution**: Used explicit types from `@supabase/supabase-js` and properly typed the client

## Project Structure

```
bookmark/
├── app/
│   ├── auth/
│   │   └── callback/           # OAuth callback handler
│   │       └── route.ts
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main app page
│   └── globals.css             # Global styles
├── components/
│   ├── BookmarkCard.tsx        # Bookmark display
│   ├── BookmarkForm.tsx        # Add bookmark form
│   ├── BookmarkList.tsx        # Bookmarks list
│   └── Header.tsx              # Header/nav
├── hooks/
│   ├── useAuth.ts              # Authentication hook
│   └── useBookmarks.ts         # Bookmarks management hook
├── lib/
│   └── supabase.ts             # Supabase client initialization
├── .env.local                  # Environment variables (not committed)
├── .env.local.example          # Environment variables template
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md                   # This file
```

## API Endpoints

The app uses Supabase directly via the client SDK. No custom API routes are needed (except for OAuth callback).

- `POST /auth/signin` → Handled by Supabase SDK
- `POST /auth/logout` → Handled by Supabase SDK
- `GET /api/bookmarks` → Read from Supabase table
- `POST /api/bookmarks` → Insert into Supabase table
- `DELETE /api/bookmarks/:id` → Delete from Supabase table

All database operations go through the Supabase JS client with RLS enforcing security.

## Security Considerations

- **RLS (Row Level Security)**: Enforces that users can only see/edit their own bookmarks
- **OAuth 2.0**: Google OAuth handles authentication securely
- **API Keys**: 
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose (only allows user operations)
  - `SUPABASE_SERVICE_ROLE_KEY` must be kept secret (used only on server)
- **HTTPS**: All communications are encrypted in production

## Future Enhancements

- [ ] Add bookmark categories/tags
- [ ] Search functionality
- [ ] Bulk operations
- [ ] Export bookmarks
- [ ] Dark mode toggle
- [ ] Browser extension
- [ ] Mobile app

## License

MIT

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check Next.js documentation: https://nextjs.org/docs

---

**Happy bookmarking! 📌**
