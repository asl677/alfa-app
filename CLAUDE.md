# ALFA System Standards

## Animation Standards (CRITICAL - STRICT ENFORCEMENT)

**REFERENCE:** See `~/CLAUDE.md` "ANIMATION CONSISTENCY STANDARD" section for base rules. This document extends those with Alfa-specific patterns.

### Page Transitions (CRITICAL)
- **Pattern**: PageTransition wrapper on all pages - 0.5s opacity fade only
- **File**: `components/PageTransition.tsx`
- **Implementation**: `<motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>>`
- **Rules**:
  - ✅ Opacity fade only (NO transforms, NO spring, NO exit animations)
  - ✅ Key changes on pathname to trigger animation
  - ✅ No AnimatePresence wrapper needed
  - ❌ NO other page-level animations
- **Why**: Prevents flickering and double-fade effects

### Message & List Animations
- **Pattern**: Staggered fade with synchronized timing
- **Duration**: 0.3s per item
- **Stagger delay**: `idx * 0.05` (50ms between items)
- **Easing**: `[0.25, 0.46, 0.45, 0.94]` (cubic-bezier - ALWAYS this value)
- **Entry**: `opacity: 0 → 1` (fade only, NO y/transform)
- **Exit**: NO exit animations (causes flicker)
- **Applied to**: Chat messages, discovery cards, all lists

### Spinner Animations
- **Duration**: 3.5s continuous linear rotation
- **Style**: 20x20px SVG with animated stroke
- **Color**: Dynamically set by `getAgentDotColor()` per agent
- **Placement**: Inline with message, left of agent badge
- **Alignment**: marginRight 2px + marginBottom 2px
- **Behavior**: Fades out (not replaces) when response arrives

### Bottom Sheet Animations
- **Container**: Spring physics - `damping: 30, stiffness: 300`
- **Entry**: y-axis slide `100% → 0`
- **Exit**: y-axis slide `0 → 100%` (duration: 0.2s)
- **Children**: Staggered reveal - `staggerChildren: 0.1`
- **Easing**: Spring for natural feel, not cubic-bezier

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
- **Spinner display**: Shows when `message.text === '...'` during agent response (inline with message)
- **Visual placement**: Spinner appears to the left of agent badge, fades out when response arrives
- **Spinner style**: 20x20px, rotating 3.5s linear, colored by agent dotColor
- **Spinner alignment**: marginRight 2px + marginBottom 2px to align with agent pill center
- **Badge structure**: Always shown alongside spinner, contains agent name + 4px color dot
- **IMPORTANT**: NO separate bottom-of-page spinner - only use inline spinners with messages

### Input Focus State
- **Container transition**: 0.3s smooth transition on all border/shadow properties
- **Easing**: cubic-bezier [0.25, 0.46, 0.45, 0.94]
- **Unfocused**: 1px solid var(--rule)
- **Focused**: 2px solid var(--coral)
- **Effect**: Border grows/shrinks smoothly, visual feedback for active input

### Button Hover & Active States (CRITICAL FOR MOBILE)
- **Pattern**: Use CSS media queries, NEVER `onMouseOver/Out` handlers
- **Hover (desktop only)**: Apply via `@media (hover: hover) { .button:hover { ... } }`
- **Active (all devices)**: Apply `:active { opacity: 0.8; transform: scale(0.98); }`
- **Why**: Touch devices don't fire `mouseout`, causing hover to stick permanently
- **Applied to**: Prompt pills, action buttons, all interactive elements
- **Code example**:
  ```css
  @media (hover: hover) {
    .button:hover {
      color: var(--coral);
      border-color: rgba(255,255,255,0.15);
    }
  }
  .button:active {
    opacity: 0.8;
    transform: scale(0.98);
  }
  ```

### Interactive Links & Buttons
- **Links in replies**: NEVER use underlined text links
- **Max links per reply**: One action link maximum per message
- **Button style**: Consistent card or list-style buttons that work reliably
- **No mixed patterns**: Do not mix link styles across same component

### Page Loading States
- **Slow page detection**: Show centered spinner when page load > 1.5s
- **Spinner style**: Circle dotted spinner (animated border rotation)
- **Position**: Centered on page, z-index above other content
- **Animation**: Continuous rotation, 1.5s cycle time

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

### Artifact Storage & Display
- **Persistence**: Artifacts stored in `localStorage` under `'artifacts'` key
- **Auto-save**: Triggered when chart prompt detected, before agent debate starts
- **Artifact interface**: `{ id, type, title, data, created_at }`
- **Display format**: Numbered text list (1. Title | Date · Type) with hover highlight
- **Interaction**: Click any artifact to open detail modal with full visualization
- **Styling**: Serif title, monospace metadata, arrow indicator on hover

## Animation DO's and DON'Ts

### What WORKS (Proven Patterns)
- ✅ PageTransition wrapper: 0.5s opacity fade (smooth, responsive feel)
- ✅ Message stagger: 0.3s duration with 50ms delays (natural reveal)
- ✅ Bottom sheet: Spring physics with slide-up entry (premium feel)
- ✅ Inline spinners: Replace with actual content when ready (no jarring transitions)
- ✅ CSS-based hover states: Use `@media (hover: hover)` for desktop-only effects
- ✅ Single easing function: `[0.25, 0.46, 0.45, 0.94]` applied everywhere

### What BREAKS the App (Anti-Patterns - BANNED)
- ❌ **Full-page preloaders** (LoadingScreen component) — DELETED 2026-03-05
  - Causes flickering between loading and content states
  - Conflicts with PageTransition animation
  - Makes navigation feel slow, not responsive
  - Creates unnecessary state management complexity
  - **Pattern to avoid**: `const [pageLoading, setPageLoading] = useState()` → full-screen overlay

- ❌ **Different easing per component** — Causes visual inconsistency
  - MUST be: `[0.25, 0.46, 0.45, 0.94]` everywhere
  - NOT: `easeInOut`, custom values, or `type: "spring"` on lists

- ❌ **Stagger delays other than `idx * 0.05`** — Breaks timing consistency

- ❌ **Transform/slide animations on list items** — Causes layout shifts
  - Use opacity fade only
  - NO `y`, `x`, or `scale` on list entries

- ❌ **Spring physics on messages** — Feels uncontrolled
  - Messages: duration-based only
  - Bottom sheets: spring physics OK (isolated component)

- ❌ **AnimatePresence with `mode="popLayout"`** — Causes jumpy layouts
  - Use default behavior (no mode) or carefully tested alternatives only

- ❌ **Multiple animation definitions per component** — Leads to timing conflicts
  - Use inline `initial/animate/exit`, not stored `variants`

- ❌ **Exit animations on messages** — Creates double-fade effect
  - Messages: enter only, no exit animation
  - Bottom sheets: exit allowed for clean dismiss

### History: Why PreLoader Was Removed (2026-03-05)

**Timeline:**
1. Added LoadingContext + LoadingScreen for first-load experience
2. Styled with staggered "Alfa" letter animation
3. Tested locally - looked good initially
4. Deployment revealed cascading problems:
   - Flickering between loading/content on every page transition
   - Letter stagger not finishing (timing conflicts with PageTransition)
   - Hanging response spinners (timeout issues)
   - User frustration escalated with each "fix" attempt
5. User final request: "remove the fucking preloader"
6. Removed completely - app became responsive and smooth immediately

**Lesson:** Simple, linear designs (no blocking overlays) always win over complex animations that create perceived lag.

## Critical Reminders

- **Never** use `popLayout` mode on message AnimatePresence (causes layout shifts)
- **Never** add app-wide preloaders or loading screens (use PageTransition only)
- **Never** use different easing per component
- **Always** remove stagger delays from message rendering unless explicitly needed
- **Always** use serif fonts for body content (EB Garamond)
- **Always** document new patterns in this file
- **Always** test animations on real devices (mobile especially) before shipping
- **Holdings/Agent Content**: Remove cards, use dividers instead
- **Never use robotic language**: Avoid "Generated", "Created", "Processed" — use natural phrasing
- **Agent syncing**: Keep all agent data in context, not scattered across multiple files
- **When in doubt about animations**: Refer to this file + base `~/CLAUDE.md` - standard patterns always trump new ideas
