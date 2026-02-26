# Review Notes Feature - Setup Guide

## Overview

This application now includes a Review Notes feature that allows users to add, view, and delete notes for each component. Notes are persisted in a PostgreSQL database.

## Architecture

- **Backend**: Express.js API server
- **Database**: PostgreSQL (Heroku Postgres addon)
- **Frontend**: LWC components
- **Deployment**: Heroku (single dyno, unified server)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Local Database (Optional)

If you want to test with a local PostgreSQL database:

```bash
# Install PostgreSQL (if not already installed)
brew install postgresql  # macOS
# or follow instructions for your OS

# Create a database
createdb lwc_components_dev

# Set DATABASE_URL environment variable
export DATABASE_URL="postgresql://localhost/lwc_components_dev"
```

### 3. Run Development Server

**Option A: With Database**
```bash
# Build the site first
npm run build

# Start the server (will auto-create tables)
npm start
```

**Option B: Without Database** (API won't work but frontend will)
```bash
npm run dev
```

Server will be available at: http://localhost:3000

## Heroku Deployment

### 1. Add PostgreSQL Addon

From Heroku Dashboard:
1. Go to your app: https://dashboard.heroku.com/apps/lwcgenerated-component-gallery
2. Click "Resources" tab
3. In "Add-ons" search box, type "Heroku Postgres"
4. Select "Heroku Postgres" and choose a plan:
   - **Essential-0** ($5/month) - Recommended for production
   - **Mini** ($5/month) - Good for small apps
   - **Essential-1** ($50/month) - For larger apps

Or via CLI (if SSL issue is resolved):
```bash
heroku addons:create heroku-postgresql:essential-0 -a lwcgenerated-component-gallery
```

### 2. Verify Database

```bash
# Check that DATABASE_URL is set
heroku config -a lwcgenerated-component-gallery

# Should see: DATABASE_URL: postgres://...
```

### 3. Deploy

```bash
# Commit all changes
git add .
git commit -m "feat: add review notes feature with PostgreSQL"

# Push to Heroku
git push heroku deploy-playground:main
```

### 4. Verify Deployment

```bash
# Check logs
heroku logs --tail -a lwcgenerated-component-gallery

# Should see:
# ✅ Connected to PostgreSQL database
# ✅ Database migrations completed successfully
# 🚀 Server running on port XXXXX
```

### 5. Test the Feature

1. Open: https://lwcgenerated-component-gallery-da9082b6542e.herokuapp.com/
2. Click on any component to view details
3. Scroll down to "Review Notes" section
4. Add a note and verify it saves
5. Refresh page and verify note persists

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Notes API
```bash
# Get all notes for a component
GET /api/notes/:componentName

# Create a new note
POST /api/notes
Body: { "componentName": "...", "noteText": "...", "authorName": "..." }

# Update a note
PUT /api/notes/:id
Body: { "noteText": "...", "authorName": "..." }

# Delete a note
DELETE /api/notes/:id
```

## Database Schema

```sql
CREATE TABLE component_notes (
  id SERIAL PRIMARY KEY,
  component_name VARCHAR(255) NOT NULL,
  note_text TEXT NOT NULL,
  author_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Issue: "DATABASE_URL not set" warning

**Solution**: Add Heroku Postgres addon (see step 1 above)

### Issue: API returns 500 errors

**Solution**: Check Heroku logs for database connection errors
```bash
heroku logs --tail -a lwcgenerated-component-gallery
```

### Issue: Notes not persisting

**Solution**:
1. Verify DATABASE_URL is set: `heroku config`
2. Check database migrations ran: Look for "✅ Database migrations completed" in logs
3. Restart the app: `heroku restart -a lwcgenerated-component-gallery`

### Issue: Build fails on Heroku

**Solution**: Make sure package.json has all dependencies:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "pg": "^8.11.3",
    "joi": "^17.11.0",
    "express-rate-limit": "^7.1.5"
  }
}
```

## Security Notes

- **Rate Limiting**: API is limited to 100 requests per 15 minutes per IP
- **Input Validation**: All inputs are validated using Joi
- **SQL Injection**: Protected via parameterized queries
- **CORS**: Enabled for frontend-backend communication

## Future Enhancements

- [ ] Add authentication/authorization
- [ ] Add note editing capability
- [ ] Add rich text editor support
- [ ] Add @ mentions
- [ ] Add note threading/replies
- [ ] Add export notes feature
- [ ] Add search/filter notes

## Support

For issues or questions:
1. Check logs: `heroku logs --tail`
2. Verify database: `heroku pg:info`
3. Test API: `curl https://your-app.herokuapp.com/api/health`
