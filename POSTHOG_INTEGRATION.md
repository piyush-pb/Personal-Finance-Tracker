# PostHog Integration Demo

This project now includes PostHog analytics integration as a demonstration. Here's what was added:

## 🚀 What's Included

### 1. PostHog Provider (`src/components/PostHogProvider.tsx`)
- Initializes PostHog with demo configuration
- Handles page view tracking automatically
- Provides PostHog instance to the entire app

### 2. Analytics Dashboard (`src/components/AnalyticsDashboard.tsx`)
- Floating analytics widget (bottom-right corner)
- Shows simulated analytics data
- Tracks user interactions with the analytics panel

### 3. Event Tracking
The following events are tracked:
- `dashboard_viewed` - When the finance dashboard is loaded
- `transaction_added` - When a new transaction is added
- `budget_updated` - When budget settings are modified
- `analytics_toggled` - When the analytics panel is shown/hidden
- `data_exported` - When analytics data export is requested

## 🔧 Configuration

### Environment Variables
Add these to your `.env.local` file:
```env
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Demo Mode
If no environment variables are set, it uses demo keys:
- Key: `phc_demo_key_for_show`
- Host: `https://app.posthog.com`

## 📊 Features

### Automatic Tracking
- Page views with URL and pathname
- Session recording (enabled)
- Console log recording
- Network payload recording
- Page leave tracking

### Manual Event Tracking
- Custom events with properties
- Timestamp tracking
- User action tracking

### Analytics Dashboard
- Real-time data simulation
- Interactive analytics panel
- Export functionality (demo)

## 🛠️ Usage

### Basic Event Tracking
```typescript
import { PostHog } from '@/components/PostHogProvider';

// Track a simple event
PostHog.capture('button_clicked');

// Track event with properties
PostHog.capture('purchase_made', {
  amount: 99.99,
  currency: 'USD',
  product: 'premium_plan'
});
```

### User Identification
```typescript
// Identify a user
PostHog.identify('user_123', {
  name: 'John Doe',
  email: 'john@example.com',
  plan: 'premium'
});
```

## 🎯 Demo Events

The app automatically tracks:
1. **Dashboard Views** - Every time the finance dashboard loads
2. **Transaction Actions** - When users add transactions
3. **Budget Updates** - When budget settings change
4. **Analytics Interactions** - When users interact with the analytics panel

## 📈 PostHog Dashboard

To view the actual analytics data:
1. Sign up at [posthog.com](https://posthog.com)
2. Create a new project
3. Get your project API key
4. Add it to your environment variables
5. View events in the PostHog dashboard

## 🔍 Testing

1. Run the development server: `npm run dev`
2. Open the app in your browser
3. Click the "📊 Show Analytics" button in the bottom-right
4. Interact with the finance features to see events being tracked
5. Check the browser console for PostHog initialization messages

## 📝 Notes

- This is a demo integration for educational purposes
- Uses demo API keys by default
- Session recording and autocapture are enabled
- All tracking respects user privacy settings
- Analytics data is simulated in the dashboard component

## 🚀 Next Steps

To make this production-ready:
1. Replace demo keys with real PostHog project keys
2. Add proper user consent management
3. Configure data retention policies
4. Set up proper event naming conventions
5. Add more sophisticated analytics queries 