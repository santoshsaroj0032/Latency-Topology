# Latency Topology Visualizer

A modern, interactive web application for visualizing and analyzing exchange latency data across different geographical regions and network providers. Built with Next.js 16, React 19, and Three.js for advanced 3D visualization capabilities.

## Overview

Latency Topology is a powerful dashboard that helps network engineers and traders monitor, analyze, and understand network latency patterns across cryptocurrency exchanges and data centers worldwide. The application provides real-time and historical latency data visualization with interactive filtering and detailed performance metrics.

## Features

### 🗺️ Interactive Map Visualization
- Real-time 3D geographical visualization of exchange nodes and latency connections
- Color-coded latency indicators for quick performance assessment
- Interactive map controls for zooming, panning, and rotating
- Support for regional filtering and provider-specific views

### 📊 Performance Analytics
- Historical and real-time latency tracking
- Time-range selection (1 hour, 24 hours, 7 days, 30 days)
- Interactive charts showing latency trends over time
- Detailed performance metrics and statistics per region

### 🔍 Advanced Filtering
- Filter by exchange and data provider
- Latency range slider for custom thresholds
- Search functionality to quickly locate specific exchanges
- Toggle options for historical data, real-time updates, and regional views

### 📋 Control Panel
- Comprehensive filter management
- Toggle switches for data visibility
- Provider selection dropdown
- Latency range configuration with slider controls

### 🎨 Legend & Documentation
- Color-coded legend for easy interpretation
- Performance metrics explanation
- Exchange information display
- Regional breakdown with detailed statistics

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19.2** - UI library and state management
- **Three.js** - 3D graphics and visualization
- **Recharts** - Interactive charts and graphs
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript development

### State Management & Data
- **React Hooks** - State management (useState)
- **SWR** - Data fetching and caching
- **Radix UI Primitives** - Accessible UI components

### Styling & UI
- **Tailwind CSS** - Responsive design and styling
- **Lucide React** - Icon library
- **CSS Animations** - Smooth transitions and effects
- **Next Themes** - Dark mode support

## Project Structure

\`\`\`
latency-topology/
├── app/
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Main dashboard page
│   └── globals.css          # Global styles and design tokens
├── components/
│   ├── mapviewer.tsx        # 3D map visualization component
│   ├── controlpanel.tsx     # Filter and control panel
│   ├── latencychart.tsx     # Historical latency chart
│   ├── regioninfo.tsx       # Region detail information
│   ├── performancedash.tsx  # Performance metrics dashboard
│   ├── legend.tsx           # Color legend and documentation
│   ├── searchbar.tsx        # Exchange search component
│   └── theme-provider.tsx   # Theme context provider
├── hooks/
│   ├── use-toast.ts         # Toast notification hook
│   └── use-mobile.ts        # Mobile detection hook
├── lib/
│   └── utils.ts             # Utility functions and helpers
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── next.config.mjs          # Next.js configuration
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18+ or higher
- npm or yarn package manager

### Steps

1. **Clone the repository** (or extract the project files)
   \`\`\`bash
   cd latency-topology
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   - Navigate to `http://localhost:3000`

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## Usage Guide

### Dashboard Layout
- **Left Sidebar**: Contains search, filters, control panel, legend, and performance metrics
- **Center**: Interactive 3D map visualization of the network topology
- **Right Panel**: Historical latency charts and detailed region information

### Filtering Data
1. Use the **Search Bar** to find specific exchanges
2. Select an **Exchange** from the dropdown in the Control Panel
3. Choose a **Provider** to filter by network provider
4. Adjust the **Latency Range** slider to set custom thresholds
5. Toggle **Historical Data**, **Real-time Updates**, and **Regional Views** as needed

### Analyzing Performance
1. Click on **Historical** tab to view latency trends
2. Select a time range (1h, 24h, 7d, 30d)
3. View interactive charts showing latency patterns
4. Click on **Details** tab to see region-specific information

### Understanding the Visualization
- **Green**: Low latency (optimal performance)
- **Yellow/Orange**: Moderate latency (acceptable)
- **Red**: High latency (needs attention)
- **Legend**: Displays color coding and metric explanations

## Key Components

### MapViewer
Renders the 3D geographical visualization using Three.js. Displays exchange nodes and connection paths with latency-based coloring.

### ControlPanel
Manages all filtering options including exchange selection, provider filtering, and latency range adjustment.

### LatencyChart
Interactive chart component displaying historical latency data over selected time periods using Recharts.

### RegionInfo
Detailed information panel showing performance metrics and statistics for the selected region or exchange.

### PerformanceDash
Summary dashboard displaying key performance indicators and metrics at a glance.

### SearchBar
Quick search functionality for locating exchanges by name or identifier.

### Legend
Color-coded legend and documentation explaining the visualization and metrics.

## Configuration

### Environment Variables
No environment variables are required for basic functionality. The application works out of the box with mock data.

### Customization
- Modify `/app/globals.css` for color scheme and design tokens
- Update component styles using Tailwind CSS classes
- Extend mock data sources in individual components

## Performance Optimization

- **Server-Side Rendering**: Leverages Next.js App Router for optimal performance
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: SWR for efficient data fetching and caching
- **CSS Optimization**: Tailwind CSS purges unused styles

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Available Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
\`\`\`

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Tailwind CSS for consistent styling

## Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy with one click

### Other Platforms
The application is compatible with any Node.js hosting platform including:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Heroku

## API Integration

The application currently uses mock data for demonstration. To integrate with real latency data:

1. Create API endpoints for latency metrics
2. Update data fetching logic in components
3. Implement real-time updates using WebSockets or Server-Sent Events

## Troubleshooting

### Map not displaying
- Ensure Three.js is properly imported
- Check browser console for WebGL errors
- Try different browser if issue persists

### Performance issues
- Clear browser cache
- Reduce time range in historical view
- Limit number of visible exchanges

### Styling issues
- Verify Tailwind CSS is properly configured
- Check if global styles are loaded
- Clear Next.js cache with `rm -rf .next`

## Contributing

To contribute improvements:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is provided as-is for educational and commercial use.

## Support

For issues, questions, or suggestions:
- Review the documentation above
- Check component comments for implementation details
- Examine mock data structure for integration guidance

## Version History

### v0.1.0
- Initial release
- Core visualization features
- Filter and search functionality
- Historical and real-time data views
- Performance metrics dashboard

---

**Last Updated**: November 2025
**Built with**: Next.js 16, React 19, Three.js, Tailwind CSS 4
