# Buffet Timer Monitor

A modern Next.js web application for managing buffet operations with live camera monitoring and intelligent timer system. Designed specifically for iPad vertical orientation.

## Overview

The Buffet Timer Monitor provides a clean, touch-optimized interface for tracking multiple food stations in real-time. It combines a live camera feed for appetizers with an intuitive timer system for both pizzas and appetizers.

## Features

### Timer System
- **4 Fixed Pizza Timers** (bottom section, always visible)
- **3 Fixed Appetizer Timers** (top right, vertically stacked)
- **Up to 4 Additional Pizza Timers** (dynamically added, can be removed)
- **Smart Color Coding**: Automatic transitions based on time elapsed
  - 🟢 0-20 minutes: Green
  - 🟡 20-30 minutes: Yellow
  - 🟠 30-40 minutes: Orange
  - 🔴 40+ minutes: Red

### Touch Controls
- **Single Tap**: Briefly enlarge timer for better readability
- **Double Tap**: Reset timer to 00:00
- **Add Timer**: "+" button in bottom right (max 8 pizza timers)
- **Remove Timer**: "X" button on removable timers

### Camera Integration
- **Live Stream Support**: HLS (.m3u8) and MJPEG formats
- **Easy URL Configuration**: Update camera URL directly in the interface
- **Local Network Ready**: Optimized for same-network camera access
- **Error Handling**: Clear feedback for connection issues

### iPad Optimization
- **Vertical Layout**: Designed for portrait orientation
- **No Zoom**: Disabled pinch-to-zoom for consistent experience
- **Full-Screen**: Works great as a home screen app
- **Responsive Grid**: Timers scale to fill available space

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment to Vercel

### Option 1: CLI (Recommended)

```bash
npm install -g vercel
vercel
# Follow the prompts to deploy
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import this GitHub repository
4. Click "Deploy"

### Option 3: GitHub Integration

1. Connect Vercel to GitHub
2. Push to main branch
3. Automatic deployment triggered

**Your app will be live at**: `https://your-project.vercel.app`

## Camera Setup

### Finding Your Camera URL

1. Find your camera's IP address in your router settings
2. Common default URLs:
   - HLS: `http://192.168.1.100:8080/stream.m3u8`
   - MJPEG: `http://192.168.1.100:8080/video.jpg`
3. Consult your camera's documentation for the exact format

### Updating Camera URL

1. Open the app on your iPad
2. Tap the "Update" button in the camera section
3. Enter your camera's stream URL
4. Press Enter or tap "Update"
5. The feed will load automatically

### Supported Camera Types

- **Hikvision**: `http://camera-ip:8080/stream.m3u8`
- **Reolink**: `http://camera-ip:8080/hls/main.m3u8`
- **Wyze**: `http://camera-ip/live/index.m3u8`
- **Generic IP Cameras**: Varies by model

## Project Structure

```
app/
├── components/
│   ├── BuffetMonitor.tsx      # Main layout (camera + timers)
│   ├── TimerCube.tsx          # Individual timer with gestures
│   ├── TimerGrid.tsx          # Timer grid layout
│   └── VideoPlayer.tsx        # Camera feed & URL config
├── globals.css                # iPad-optimized styles
├── layout.tsx                 # Root metadata & viewport
└── page.tsx                   # Home page (mounts BuffetMonitor)

DEPLOYMENT.md                  # Complete deployment guide
package.json                   # Dependencies & scripts
tsconfig.json                  # TypeScript configuration
tailwind.config.js             # Tailwind CSS setup
```

## Customization

### Change Timer Limits

Edit `app/components/BuffetMonitor.tsx`:

```typescript
// Line 35: Change max from 8 to your desired limit
if (pizzaTimersCount >= 8) return;
```

### Adjust Color Transition Times

Edit `app/components/TimerCube.tsx`:

```typescript
// Modify these values (in seconds)
if (seconds < 1200) {        // 0-20 min: Green
} else if (seconds < 1800) { // 20-30 min: Green→Yellow
} else if (seconds < 2400) { // 30-40 min: Yellow→Red
}
```

### Change Default Camera URL

Edit `app/components/VideoPlayer.tsx`:

```typescript
// Line 10: Update default URL
const [displayUrl, setDisplayUrl] = useState('http://192.168.1.100:8080/video.m3u8');
```

## Browser Support

| Browser | iOS iPad | Android | macOS |
|---------|----------|---------|-------|
| Safari | ✅ | N/A | ✅ |
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |

**Recommended**: Safari on iPad for native HLS support.

## Network Requirements

- **Camera & iPad**: Same local Wi-Fi network
- **Internet**: Required for Vercel frontend (not for camera)
- **Router**: No special configuration needed
- **Firewall**: May need to allow local camera access

## Troubleshooting

### Camera Won't Load

**Check**:
1. Camera is powered on and connected to Wi-Fi
2. Camera IP is correct (check router)
3. iPad is on the same network
4. URL format matches your camera

**Try**:
- Test URL in browser address bar first
- Try MJPEG format instead of HLS
- Restart camera and router

### Timers Not Counting

- Refresh the page
- Check browser console for errors (Safari: Develop > Show Console)
- Clear browser cache (Settings > Safari > Clear History)

### Vercel Deployment Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- No environment variables required

### App Freezes on iPad

- Close other apps
- Force refresh: Swipe down, hold, then refresh
- Restart Safari
- Check Wi-Fi connection

## Performance Tips

- Use HLS format for optimal streaming
- Keep camera on strong Wi-Fi signal
- Use 5GHz network for better bandwidth
- Close unused browser tabs
- Disable other heavy apps

## Add to Home Screen (iPad)

1. Open app in Safari
2. Tap Share icon
3. Select "Add to Home Screen"
4. Name: "Buffet Timer"
5. Tap "Add"

The app launches fullscreen like a native app!

## Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel
- **Video**: Native HTML5 `<video>` element

## Development

### Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

### Dependencies

- `react` & `react-dom` - UI framework
- `next` - React framework
- `typescript` - Type safety
- `tailwindcss` - Styling

## Contributing

Feel free to fork and modify for your needs. Key customization areas:
- Timer count and layout
- Color transition times
- Camera integration
- UI styling and spacing

## License

MIT - Use freely for personal or commercial projects.

## FAQ

**Q: Can I use multiple cameras?**  
A: Currently supports one camera. Modify `VideoPlayer.tsx` to support multiple feeds.

**Q: Will timers persist on refresh?**  
A: No. Timers are in-memory. Add localStorage if you need persistence.

**Q: Can I deploy locally instead of Vercel?**  
A: Yes! It's a standard Next.js app. Deploy to any Node.js host.

**Q: Does it work on Android tablets?**  
A: Yes, with any modern browser (Chrome recommended).

**Q: How do I change the layout?**  
A: Edit `BuffetMonitor.tsx` - the main layout component is clearly organized.

## Support

For deployment questions, see **DEPLOYMENT.md** for detailed instructions.

For technical issues:
1. Check the troubleshooting section above
2. Review browser console (F12 or Safari Develop menu)
3. Verify network connectivity
4. Check Vercel deployment logs

---

**Ready to deploy?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.
