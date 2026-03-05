# Alfa App 2026 Overview

A real-time financial market analysis and portfolio management platform powered by AI agents.

**Live:** [https://alfa-app-flame.vercel.app](https://alfa-app-flame.vercel.app)

## Features

- **Multi-Agent Debate System** - Market analysis powered by Analyst Ashley, Tom Tracker, and Monitor Mike
- **Real-Time Market Intelligence** - Trending topics, earnings alerts, sector rotation signals
- **Portfolio Management** - Track holdings, rebalance recommendations, dividend analysis
- **Interactive Chat Interface** - Ask agents about stocks, sectors, market conditions
- **Artifact Generation** - Auto-generate charts and data visualizations from queries
- **Dark/Light/Classic Themes** - Customizable UI with smooth animations

## Project Structure

- `/app` - Page routes (Chat, Discover, History, Settings, Context, Artifacts)
- `/components` - Reusable UI components
- `/lib` - Utilities and animations
- `/public` - Static assets

## Design System

Alfa uses the [Design System](https://github.com/asl677/design-system) for consistent UI components and patterns.

### Using the Design System in Your LLM Project

The design system provides reusable components built with React and Tailwind CSS:

1. **Clone or reference** the design system repository
2. **Import components** like `PageHeader`, `AgentsSheet`, `ToneOptions` into your pages
3. **Leverage animations** from `/lib/animations.ts` (fadeUp, containerStagger, itemStagger)
4. **Use color tokens** from CSS variables (--coral, --cream, --bg, etc.)
5. **Follow typography standards**: EB Garamond (serif), Space Grotesk (UI), DM Mono (technical)

Components are production-ready and designed for financial/data-heavy applications.

## Integrations

- [Pencil Design File](./alfa.pen) - Alfa UI design in Pencil MCP
- [Figma MCP Server](https://github.com/asl677/figma-mcp-server) - Design-to-code integration

## Quick Start

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

- **Production:** [https://alfa-app-flame.vercel.app](https://alfa-app-flame.vercel.app)
- **Deployed on:** [Vercel](https://vercel.com)
- **Auto-deploys** on push to main branch

## Resources

- [Alfa 2026 Proposal](https://claude.ai/public/artifacts/43876b57-51de-48ce-a7c3-73f1b63c4c23)
