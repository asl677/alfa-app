# ALFA System Standards

## Animation Standards

### Page Transitions
- **Pattern**: 0.5s fade between all page route changes
- **Implementation**: Use `PageTransition` component wrapping all children in layout
- **Easing**: CSS cubic-bezier `[0.25, 0.46, 0.45, 0.94]`
- **File**: `components/PageTransition.tsx`

### Message & List Animations
- **Pattern**: Smooth entrance without stagger delays
- **Duration**: 0.4s for each item
- **Easing**: `[0.25, 0.46, 0.45, 0.94]` (organic cubic-bezier)
- **Entry**: `opacity: 0, y: 12` → `opacity: 1, y: 0`
- **Exit**: `opacity: 0, y: -4`
- **Note**: NO `delay: idx * 0.08` or index-based stagger for message lists

### Micro-Animations
- **Spinner**: 3.5s linear rotation with stroke-dasharray
- **Loading Gradient**: 1.5s pulse opacity `[0.5, 1]`
- **Spring Physics**: Avoided in favor of duration-based easing (more predictable on mobile)

## Design System Standards

### Typography & Spacing
- **Serif Headlines**: `EB Garamond` at 15-28px (300-400 weight)
- **Serif Body**: `EB Garamond` at 15px (300 weight), 1.7 line-height
- **Sans-Serif UI**: `Space Grotesk` at 10-15px for labels/badges
- **Monospace**: `DM Mono` for metrics, timestamps, technical values

### Component Styling

#### Bottom Sheet Content Sections
- **Pattern**: NO card containers. Use spacing divisions instead.
- **Structure**: Agent badge (pill) + content text + bottom border divider
- **Spacing**: 24px gap between sections, 24px padding-bottom with `border-bottom: 1px solid var(--rule-subtle)`
- **Font**: `EB Garamond` serif for content, not Space Grotesk
- **Example**: HoldingAnalysis agent analyses

#### Chat Messages
- **Pattern**: Flat layout, no cards
- **Agent Badge**: 46px border-radius pill with small font
- **Message Text**: `EB Garamond` serif, 15px, 1.7 line-height
- **Animation**: No stagger, synchronized entry

### Color System
- `var(--bg)`: Main background
- `var(--surface)`: Card/surface background
- `var(--rule)`: Border color (standard)
- `var(--rule-subtle)`: Light border for sections
- `var(--coral)`: Primary accent (orange)
- `var(--cream)`: Primary text
- `var(--cream2)`: Secondary text
- `var(--dust)`: Tertiary/muted text

## File Organization

- **Pages**: `/app/[page]/page.tsx`
- **Components**: `/components/[Component].tsx`
- **Animations**: `/lib/animations.ts` (shared fadeUp, etc.)
- **Hooks**: `/app/context/` (useAgents, useTheme, etc.)

## Interactive Patterns

### Prompt Suggestions
- **Pattern**: Single prompt displayed, advances to next on click
- **Implementation**: Show `PROMPT_SUGGESTIONS[promptIndex]` only
- **Behavior**: Click advances index and sends prompt message

### Agent Debate System
- **Pattern**: Sequential agent responses with authentic disagreement
- **Implementation**: System prompt changes based on agent index (first vs subsequent)
- **First Agent**: "Give your initial perspective"
- **Other Agents**: "Challenge, debate, or build upon previous points"
- **Note**: Keep all messages in thread, no deletion

## Agent System

### Agent Data & Syncing
- **Single source of truth**: All agents defined in `app/context/agents.tsx`
- **Agent interface**: `{ id, shortName, fullName, role, lastAction, dotColor, active }`
- **Unified access**: Pages use `useAgents()` hook from context
- **Pages synced**: Chat page, Agents page, and any other pages auto-sync agent counts and status
- **Counter display**: Shows `activeAgents.length` in both chat and agents pages

### Agent Response Messaging
- **Tone**: Casual, conversational, like talking to a friend (e.g., "Yo," "Here's my take", "Real talk")
- **FORBIDDEN words**: Never use "Generated", "Created", "Processed", or robotic language
- **Natural language**: Replace "Generated X" with "Pulled up X for you"
- **First agent**: Gives initial perspective with fresh analysis
- **Subsequent agents**: Challenge, debate, or build upon previous points
- **All messages preserved**: Never delete messages from thread, keep full debate visible

### Loading States & Spinners
- **Spinner display**: Shows when `message.text === '...'` during agent response
- **Visual placement**: Spinner appears to the left of agent badge, fades out when response arrives
- **Spinner style**: 20x20px, rotating 3.5s linear, colored by agent dotColor
- **Spinner alignment**: marginRight 2px + marginBottom 2px to align with agent pill center
- **Badge structure**: Always shown alongside spinner, contains agent name + 4px color dot

## Artifact System

### Chart Generation & Detection
- **Pattern Detection**: Prompts like "Compare NVDA vs AMD" or "Chart my portfolio allocation" trigger artifact generation
- **Detection logic**: Regex parsing in `lib/chartGenerator.ts` `detectChartPrompt()` function
- **Stock symbols**: Extracted from comparison prompts and passed to `generateChartData()`
- **Example formats**:
  - "Compare NVDA vs AMD" → comparison table with real stock data
  - "Chart my portfolio allocation" → portfolio donut/bar chart
  - "Show sector exposure heatmap" → sector heatmap visualization
  - "What earnings are dropping soon?" → earnings calendar table
  - "Show dividend stocks" → dividend yields table

### Comparison Chart Display
- **Type**: Real data comparison table (not chart visualization)
- **Stock Info**: Database in `STOCK_INFO` with 10+ major stocks (symbol, name, basePrice)
- **Data Generation**: Realistic 90-day price movements with trend + volatility + randomness
- **Table Columns**: Current Price, 90-Day Change (±%), 90-Day Low, 90-Day High, 90-Day Average
- **Color coding**: Green for positive changes, red for negative
- **File**: `app/artifacts/page.tsx` handles rendering

### Artifact Storage
- **Persistence**: Artifacts stored in `localStorage` under `'artifacts'` key
- **Auto-save**: Triggered when chart prompt detected, before agent debate starts
- **Artifact interface**: `{ id, type, title, data, created_at }`

## Critical Reminders

- **Never** use `popLayout` mode on message AnimatePresence (causes layout shifts)
- **Always** remove stagger delays from message rendering
- **Always** use serif fonts for body content (EB Garamond)
- **Always** document new patterns in this file
- **Holdings/Agent Content**: Remove cards, use dividers instead
- **Never use robotic language**: Avoid "Generated", "Created", "Processed" — use natural phrasing
- **Agent syncing**: Keep all agent data in context, not scattered across multiple files
