# Buffet Timer Monitor - Deployment Guide

A Next.js web application for monitoring buffet timers with live camera feed support. Optimized for iPad vertical orientation.

## Quick Start

### Features

- **Live Camera Feed**: Display HLS (.m3u8) or MJPEG streams from Wi-Fi IP cameras
- **Timer System**: 4 fixed pizza timers + 3 fixed appetizer timers (up to 8 total)
- **Smart Color Transitions**: Green (0-20min) → Yellow (20-30min) → Red (30min+)
- **Touch Gestures**: Single tap to enlarge, double tap to reset
- **iPad Optimized**: Responsive vertical layout, no zoom/pinch
- **No Backend Required**: Pure frontend, Vercel-deployable

## Installation & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Camera with HLS or MJPEG stream on local network

### Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open http://localhost:3000 in your browser.

## Camera Configuration

### Enter Camera URL

1. Open the app on iPad (or any device)
2. Find the **Appetizer Camera** section (top left)
3. Enter your camera's stream URL in the input field:
   - **HLS Format**: `http://192.168.1.100:8080/stream.m3u8`
   - **MJPEG Format**: `http://192.168.1.100:8080/video.jpg`
4. Click **Update** or press Enter
5. The camera feed will load automatically

### Camera URL Examples

**Hikvision**
```
http://camera-ip:8080/stream.m3u8
```

**Reolink**
```
http://camera-ip:8080/hls/main.m3u8
```

**Generic/Default**
```
http://192.168.1.100:8080/video.m3u8
```

Find your camera's IP address in your router or network settings.

### Troubleshooting Camera Issues

| Issue | Solution |
|-------|----------|
| Camera won't load | Verify camera is on same Wi-Fi network as iPad |
| Wrong URL format | Check camera documentation for correct stream URL |
| Black screen | Try MJPEG format instead of HLS |
| Connection timeout | Ensure camera IP is correct and accessible |

## Timer Functionality

### Controls

- **Single Tap**: Briefly enlarge timer for readability
- **Double Tap**: Reset timer to 00:00
- **Add Timer**: Click "+" button in bottom right (max 8 pizza timers)
- **Remove Timer**: Click "X" on removable timers (fixed timers stay)

### Color Stages

| Time Range | Color | Status |
|-----------|-------|--------|
| 0-20 min | 🟢 Green | Safe |
| 20-30 min | 🟡 Yellow | Warning |
| 30-40 min | 🟠 Orange | Alert |
| 40+ min | 🔴 Red | Expired |

Colors transition smoothly between stages.

## Layout

### Top Half: Appetizers
- **Left**: Live camera feed (2/3 width)
- **Right**: 3 fixed timer stacks (1/3 width)

### Bottom Half: Pizzas
- **Main**: 4-column grid of pizza timers (4 fixed + up to 4 additional)
- **Button**: "+" to add more timers (bottom right)

## Deployment to Vercel

### Step 1: Commit Code

```bash
git add .
git commit -m "Add buffet timer monitor"
git push origin main
```

### Step 2: Deploy (Choose One)

#### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
# Follow prompts
```

#### Option B: Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Click "Deploy"

#### Option C: GitHub Integration

1. Connect Vercel to GitHub
2. Select repository
3. Auto-deploys on every push

### Step 3: After Deployment

Your app is live at: `https://your-project.vercel.app`

### Step 4: Add to iPad Home Screen

```
1. Open the app in Safari
2. Tap Share icon
3. Select "Add to Home Screen"
4. Name: "Buffet Timer"
5. Tap "Add"
```

The app will open fullscreen like a native app.

## Environment & Network

### Network Requirements

- iPad and camera on same local Wi-Fi network
- Camera must support CORS or allow local access
- Internet connection for Vercel (frontend serving)
- No VPN or network isolation between iPad and camera

### Browser Support

| Browser | iPad Support | HLS Support |
|---------|--------------|------------|
| Safari | ✅ Native | ✅ Yes |
| Chrome | ✅ Full | ⚠️ May need plugin |
| Firefox | ✅ Full | ⚠️ May need plugin |

Safari on iOS is recommended for HLS support.

## Customization

### Change Maximum Timers

Edit `app/components/BuffetMonitor.tsx`:

```typescript
// Line 35
if (pizzaTimersCount >= 8) return; // Change 8 to your desired max
```

### Adjust Color Transition Times

Edit `app/components/TimerCube.tsx`:

```typescript
// Modify these values (in seconds)
if (seconds < 1200) {        // 0-20 min: Green
} else if (seconds < 1800) { // 20-30 min: Green→Yellow
} else if (seconds < 2400) { // 30-40 min: Yellow→Red
} else {                       // 40+ min: Red
```

### Change Default Camera URL

Edit `app/components/VideoPlayer.tsx`:

```typescript
// Line 10
const [displayUrl, setDisplayUrl] = useState('http://192.168.1.100:8080/video.m3u8');
// Change to your camera's default URL
```

## Project Structure

```
app/
├── components/
│   ├── BuffetMonitor.tsx      # Main layout (4+4 pizza, 3 appetizer timers)
│   ├── TimerCube.tsx          # Single timer with color transitions
│   ├── TimerGrid.tsx          # Timer grid container
│   └── VideoPlayer.tsx        # Camera feed with URL config
├── globals.css                # iPad-optimized styles
├── layout.tsx                 # Root metadata + viewport
└── page.tsx                   # Home page (mounts BuffetMonitor)
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Timers Not Counting

- Check browser console (Safari: Develop > Show Console)
- Ensure JavaScript is enabled
- Refresh page (pull down in Safari)

### Vercel Deployment Issues

- Check build logs in Vercel dashboard
- Ensure all dependencies in `package.json`
- No environment variables required

### iPad App Issues

- Force refresh: Swipe down and hold, then refresh
- Clear Safari cache: Settings > Safari > Clear History and Website Data
- Reinstall home screen app: Long press > Remove > Re-add

## Performance Tips

- Keep camera URL updated for local network
- Use HLS format for better streaming on iPad
- Disable other heavy apps while running
- Use 5GHz Wi-Fi for better performance
- Close other browser tabs

## API Reference

### VideoPlayer Component

```typescript
<VideoPlayer title="Camera Name" />
// Displays video + URL config input
```

### TimerCube Component

```typescript
<TimerCube
  id="unique-id"
  isRemovable={true}
  onRemove={handleRemove}
/>
// Counts up, color transitions, single/double tap
```

### BuffetMonitor Component

```typescript
<BuffetMonitor />
// Full layout: camera + appetizer timers + pizza timers
```

## Frequently Asked Questions

**Q: Can I use this without a camera?**
A: Yes! The camera section is optional. Just leave it blank or show static images.

**Q: How many timers can I have?**
A: 3 appetizer + up to 8 pizza timers = 11 total maximum.

**Q: Will it work offline?**
A: No, the camera needs to be accessible on your local network. Vercel needs internet to serve the frontend.

**Q: Can I deploy elsewhere (not Vercel)?**
A: Yes! It's a standard Next.js app. Deploy to Netlify, AWS, or any Node.js host.

**Q: How do I backup timer data?**
A: Timers are in-memory. Refresh = reset. Consider adding localStorage if needed.

## License

MIT - Use freely for personal or commercial projects.

## Support & Feedback

Issues? Check:
1. Camera is on same network as iPad
2. Camera URL is correct
3. Browser console for errors
4. Vercel deployment logs

For updates or questions, refer to the main repository README.

