# PWRbyte Frontend

> **Modern Web Interface for AI-Powered Project Risk Analysis**  
> Next.js application with real-time predictions, interactive visualizations, and explainable AI insights.

---

## 🎯 Overview

The PWRbyte frontend is a sleek, dark-themed web application built for **Smart India Hackathon 2025** (PS25192). It provides an intuitive interface for analyzing POWERGRID infrastructure project risks with ML-powered predictions and visual explanations.

### Key Features

- 📊 **Interactive Dashboard**: Real-time risk predictions with beautiful visualizations
- 🎯 **Hotspot Analysis**: SHAP-based feature importance displayed as interactive charts
- 📈 **Historical Trends**: Distribution charts showing project overrun patterns
- 🔄 **What-If Scenarios**: Mitigation modeling to explore risk reduction strategies
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS for premium aesthetics
- ⚡ **Fast Performance**: Next.js 14 with React 19 for optimal speed

---

## 🏗️ Architecture

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with theme provider
│   └── page.tsx              # Main application page
├── components/               # React components
│   ├── prediction-form.tsx   # Project input form
│   ├── results-display.tsx   # Main results dashboard
│   ├── hotspot-chart.tsx     # SHAP value visualization
│   ├── historical-distribution-chart.tsx
│   ├── risk-category-donut.tsx
│   ├── mitigation-scenarios.tsx
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utilities
│   ├── api.ts                # Backend API client
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # Helper functions
├── hooks/                    # Custom React hooks
│   └── use-toast.ts          # Toast notifications
├── styles/                   # Global styles
│   └── globals.css           # Tailwind + custom CSS
└── public/                   # Static assets
    └── logo.png              # PWRbyte logo
```

---

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | Next.js | 14.2.25 |
| **Runtime** | React | 19 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.1.9 |
| **UI Components** | shadcn/ui | Latest |
| **Charts** | Recharts + Plotly.js | 2.15.4 / 2.6.0 |
| **Forms** | React Hook Form + Zod | 7.60 / 3.25 |
| **Icons** | Lucide React | 0.454 |
| **Fonts** | Geist (Vercel) | 1.3.1 |

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: Recommended package manager (or npm/yarn)

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install
# or: npm install
# or: yarn install
```

### Environment Configuration

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Configure the API URL in `.env.local`:

```env
# For local development
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# For production (deployed demo backend, use your own)
# NEXT_PUBLIC_API_URL=https://notpwrbyteapi.onrender.com
```

> [!IMPORTANT]
> The `NEXT_PUBLIC_API_URL` environment variable is **required** and must point to a running instance of the PWRbyte backend API.

### Development Server

```bash
pnpm dev
# or: npm run dev
```

**Application URL**: http://localhost:3000

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 🧩 Key Components

### `prediction-form.tsx`

User input form for project parameters:
- **Project Name**: Text input
- **Project Type**: Select (Substation, Overhead Line, Underground Cable)
- **Terrain**: Select (Plains, Hilly, Coastal, Forest)
- **Vendor Performance**: Select (Excellent, Good, Average, Poor)
- **Material Availability**: Select (High, Medium, Low)

Uses React Hook Form with Zod validation for type-safe form handling.

### `results-display.tsx`

Main dashboard displaying:
- **Prediction Summary**: Cost/time overrun predictions with confidence score
- **Risk Gauge**: Visual indicator of risk severity
- **Tabs**: Organized view of hotspots, trends, and scenarios

### `hotspot-chart.tsx`

SHAP-based feature importance visualization:
- Horizontal bar chart showing impact of each feature
- Color-coded positive (red) and negative (green) impacts
- Sortable by absolute impact magnitude
- Built with Plotly.js for interactive exploration

### `historical-distribution-chart.tsx`

Historical overrun trend analysis:
- Distribution chart of past project overruns
- Current prediction marker for contextual comparison
- Dynamically generated based on project type
- Uses Recharts area chart

### `risk-category-donut.tsx`

Risk categorization breakdown:
- **Categories**: Geospatial, Vendor-Related, Supply Chain, Execution
- Donut chart with percentage distribution
- Visual risk profiling

### `mitigation-scenarios.tsx`

What-if scenario modeling:
- **Scenarios**: Improved vendor, better material access, alternative terrain
- Predicted impact of risk mitigation strategies
- Comparative analysis with baseline prediction

---

## 🎨 Design System

### Color Palette

```css
/* Dark theme with vibrant accents */
--background: 220 13% 5%;        /* Zinc 950 */
--foreground: 240 5% 96%;        /* Zinc 50 */
--primary: 217 91% 60%;          /* Blue accent */
--destructive: 0 63% 31%;        /* Red for high risk */
--success: 142 71% 45%;          /* Green for low risk */
```

### Typography

- **Primary Font**: Geist (sans-serif)
- **Headings**: Bold weights with proper hierarchy
- **Body**: Regular weight with optimal line-height

### Components

All UI components follow shadcn/ui conventions:
- Consistent spacing and sizing
- Accessible by default
- Dark mode optimized
- Fully customizable via Tailwind

---

## 📡 API Integration

The frontend communicates with the backend via `lib/api.ts`:

```typescript
export async function predictProjectRisk(
  projectData: ProjectInput
): Promise<PredictionOutput>
```

**Flow**:
1. User submits form → `prediction-form.tsx`
2. Form data validated → React Hook Form + Zod
3. API call triggered → `lib/api.ts`
4. Response received → `results-display.tsx`
5. Visualizations rendered → Chart components

**Error Handling**:
- Network errors displayed via toast notifications
- API errors parsed and shown to user
- Loading states with skeleton UI

---

## 🌐 Deployment

The demo frontend is deployed on **Vercel**: https://pwrbyte.vercel.app

### Deploy Your Own

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variable in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: Your backend API URL

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 💻 Development Guide

### Adding New Components

```bash
# Using shadcn/ui CLI
npx shadcn-ui@latest add [component-name]
```

### Type Safety

All data models defined in `lib/types.ts`:

```typescript
interface ProjectInput {
  projectName: string
  projectType: string
  terrain: string
  vendorPerformance: string
  materialAvailability: string
}

interface PredictionOutput {
  predictedCostOverrun: number
  predictedTimeOverrun: number
  confidenceScore: number
  hotspots: Hotspot[]
  historicalData: HistoricalData
  riskCategories: RiskCategory[]
}
```

### Styling Conventions

- Use Tailwind utility classes
- Custom styles in `globals.css` only for CSS variables
- Follow dark theme palette
- Maintain consistent spacing (4px grid)

---

## 🧪 Testing

```bash
# Linting
pnpm lint

# Type checking
pnpm tsc --noEmit
```

---

## 📂 Project Structure Details

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout, theme provider, fonts
│   ├── page.tsx            # Homepage with prediction workflow
│   └── globals.css         # Global styles (imported in layout)
├── components/
│   ├── prediction-form.tsx        # Form component
│   ├── results-display.tsx        # Results container
│   ├── hotspot-chart.tsx          # SHAP visualization
│   ├── historical-distribution-chart.tsx
│   ├── risk-category-donut.tsx
│   ├── mitigation-scenarios.tsx
│   └── ui/                        # 50+ shadcn components
├── lib/
│   ├── api.ts              # API client functions
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # cn() utility for class merging
├── hooks/
│   └── use-toast.ts        # Toast notification hook
├── public/
│   └── logo.png            # Application logo
├── .env.example            # Environment variable template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── next.config.mjs         # Next.js configuration
```

---

## 🤝 Contributing

This project was built for **Smart India Hackathon 2025** by **Team That1Bit**.

### Team
- Rudransh Joshi (That1Bit)

### Problem Statement
**PS25192**: Predicting Project Costs and Timeline for POWERGRID

---

## 📄 License

Built for Smart India Hackathon 2025 • Ministry of Power • POWERGRID Corporation of India Limited

---

## 🔗 Related Documentation

- [Backend README](../backend/README.md)
- [Main Project README](../README.md)

---

## 📺 Demo

- **Live Application**: https://pwrbyte.vercel.app
- **Presentation Video**: https://www.youtube.com/watch?v=EpEy6MQPAgs
- **API Endpoint**: https://notpwrbyteapi.onrender.com
