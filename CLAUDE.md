# Proto Project - Claude Instructions

## MANDATORY: Mock Page Implementation Process

When implementing or modifying any mock page in this proto project, you MUST follow this process **before writing any code**.

### Step 1: Identify Target Page

Before starting, confirm:
- [ ] What is the exact page path? (e.g., `/reports/trend`)
- [ ] What is the page name in the actual app?

### Step 2: Read Actual Source Code (REQUIRED)

You MUST read these files for the target page:

```
apps/airbridge/src/container/{page-name}/     # Page container
apps/airbridge/src/components/                 # Shared components used
```

For each UI component visible on the page, find and read its:
1. `.tsx` file (component logic)
2. `.styles.ts` file (styling - **CRITICAL for spacing, alignment, colors**)

### Step 3: Document Differences from Similar Pages

If basing on an existing mock page:
- [ ] List ALL differences between source page and target page
- [ ] Document unique features of target page
- [ ] Note different prop values (counts, labels, etc.)

### Step 4: Verify Style Values

For each component, verify in `.styles.ts`:
- [ ] `align-items` value (flex-start vs center vs stretch)
- [ ] `padding` values (exact px or spacing tokens)
- [ ] `height`, `width`, `min-width` values
- [ ] `gap`, `column-gap`, `row-gap` values
- [ ] `border-radius` values
- [ ] Color values and tokens

### Step 5: Check Component Structure

Compare HTML structure in DevTools with source code:
- [ ] Nesting depth matches
- [ ] Wrapper elements present
- [ ] CSS classes/styled components identified

---

## NEVER Do These

1. **NEVER assume** a page is similar to another page without verification
2. **NEVER use generic values** like `items-center` without checking actual styles
3. **NEVER skip reading `.styles.ts` files** - they contain critical layout info
4. **NEVER copy-paste from similar pages** without documenting differences first

---

## Tailwind CSS Constraints (CRITICAL)

This project uses custom Tailwind CSS with `tw:` prefix. **Only these values are valid:**

### Spacing (padding, margin, gap)
Valid: `0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 48, 60`

Examples:
- ✅ `tw:p-12`, `tw:gap-8`, `tw:mb-16`
- ❌ `tw:p-14`, `tw:gap-40`, `tw:mb-18` (not defined)

### Border Radius
Valid: `3, 6, 12`

Examples:
- ✅ `tw:rounded-6`, `tw:rounded-12`
- ❌ `tw:rounded-8`, `tw:rounded-10` (not defined)

### For values not in the predefined list, use inline styles:
```tsx
// Wrong - tw:w-76 doesn't exist
<div className="tw:w-76">

// Correct - use inline style
<div style={{ width: 76 }}>
```

---

## Common Color Tokens

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `color.background.tinted.normal` | `#F5F6F8` | Section card container background |
| `color.background.normal` | `#F7F8FA` | Individual card background |
| `color.green[500]` | `#22C55E` | Success status icon |
| `color.text.remove` | (red) | Error status icon |
| `color.text.secondary` | `#606468` | Secondary text, arrows |

---

## Component Patterns - Lessons Learned

### Card Container Pattern (e.g., Integration Overview)

**CORRECT Structure:**
```
SectionCard (gray background #F5F6F8, rounded-12, py-16 px-12)
├── SectionHeader (title + count badge) ← INSIDE the gray card
└── ChannelRow (white background, rounded-12, NO border)
    └── ChannelRow (white background, rounded-12, NO border)
```

**WRONG Structure:**
```
SectionHeader (title + count badge) ← OUTSIDE the gray card ❌
SectionCard (gray background)
└── ChannelRow (with border) ← Should NOT have border ❌
```

### Status Display Pattern

**CORRECT:** Use Icon component with color prop
```tsx
<Icon size={18} color="#22C55E">check_circle</Icon>  // Success
<Icon size={18} color="#EF4444">cancel</Icon>        // Error
<Icon size={18} color="#606468">downloading</Icon>   // Pending
```

**WRONG:** Use Tag component
```tsx
// ❌ Don't use Tags for status
<Tag color="green">정상</Tag>
<Tag color="green">수신 중</Tag>
```

### Table Row Dividers

**CORRECT:** No divider lines between rows in expanded accordion content
```tsx
<tr key={func}>  // No border classes
```

**WRONG:** Adding border classes
```tsx
<tr className="tw:border-b tw:border-gray-100">  // ❌
```

### Icon Color Application

**CORRECT:** Use `color` prop directly
```tsx
<Icon size={18} color="#22C55E">check_circle</Icon>
```

**WRONG:** Use Tailwind text color class (doesn't work with Icon component)
```tsx
<Icon className="tw:text-green-500">check_circle</Icon>  // ❌
```

---

## Icon Usage Guide

### Icon Component Basics
```tsx
import { Icon } from '@airbridge/component'

// Basic usage
<Icon size={18} color="#606468">icon_name</Icon>
```

### Common Icons by Category

| Category | Icon Name | Usage |
|----------|-----------|-------|
| **Status** | `check_circle` | Success/정상 상태 |
| | `cancel` | Error/실패 상태 |
| | `downloading` | Pending/대기 상태 |
| | `error` | Warning/경고 |
| **Navigation** | `keyboard_arrow_down` | Accordion 펼치기/접기 |
| | `chevron_right` | 다음/이동 |
| | `chevron_left` | 이전/뒤로 |
| | `expand_more` | Dropdown 열기 |
| **Actions** | `open_in_full` | 전체 펼치기 |
| | `close_fullscreen` | 전체 접기 |
| | `menu_book` | 가이드/문서 |
| | `help` | 도움말/정보 |
| | `search` | 검색 |
| **General** | `groups` | 조직/그룹 |
| | `widgets` | 앱/위젯 |
| | `person` | 사용자 |
| | `language` | 언어 |
| | `update` | 업데이트 |
| | `auto_awesome` | AI/스마트 기능 |

### Icon Sizes by Context

| Context | Size | Example |
|---------|------|---------|
| Status indicator in table | 18px | `<Icon size={18}>check_circle</Icon>` |
| Accordion arrow | 24px | `<Icon size={24}>keyboard_arrow_down</Icon>` |
| Button icon | 16px | `<Icon size={16}>menu_book</Icon>` |
| Help/Info icon | 18px | `<Icon size={18}>help</Icon>` |
| Navigation bar icon | 16-18px | `<Icon size={16}>search</Icon>` |

### Icon Colors by State

| State | Color | Hex Value |
|-------|-------|-----------|
| Success | Green | `#22C55E` |
| Error | Red | `#EF4444` |
| Pending/Secondary | Gray | `#606468` |
| Primary | Dark Gray | `#1F2937` |
| Disabled | Light Gray | `#9CA3AF` |

### Icon with Rotation (Accordion)
```tsx
// Arrow that rotates when expanded
<Icon
  size={24}
  color="#606468"
  className={`tw:transition-transform tw:duration-400 ${isExpanded ? 'tw:rotate-180' : 'tw:rotate-0'}`}
>
  keyboard_arrow_down
</Icon>
```

### Icon in Button
```tsx
<Button appearance="outline" color="gray" size="sm">
  <Icon size={16}>open_in_full</Icon>
  <span>전체 펼치기</span>
</Button>
```

### Icon with Link
```tsx
<a href="/guide" className="tw:flex tw:items-center tw:gap-4">
  <Icon size={16}>menu_book</Icon>
  <Text size={13}>가이드 보러가기</Text>
</a>
```

---

## Quick Reference: Common Style Files

| Component | Style File |
|-----------|------------|
| ConfigBox | `apps/airbridge/src/components/config-box/ConfigBox.styles.ts` |
| ConfigBoxSection | `apps/airbridge/src/components/config-box/config-box-section/ConfigBoxSection.styles.ts` |
| NewChip | `apps/airbridge/src/components/new-chip/NewChip.styles.ts` |
| Control Styles | `apps/airbridge/src/components/config-box/controls/styles.ts` |
| AccordionCard | `apps/airbridge/src/container/integration-overview/overview/ui/core/CollapsableCard/AccordionCard.styles.ts` |
| ContentContainer | `apps/airbridge/src/container/integration-overview/overview/ui/core/Content/ContentContainer.tsx` |
| Status Icons | `apps/airbridge/src/container/integration-overview/overview/ui/core/AdChannelTable/cell/Status.tsx` |

---

## Integration Overview Page Reference

### Layout Constants
```typescript
const LAYOUT = {
  CONTAINER_WIDTH: 1378,    // Main container width
  CARD_MIN_WIDTH: 520,      // Minimum width for accordion cards
} as const
```

### Component Hierarchy
```
IntegrationOverviewPage
├── PageHeader (title + guide link + expand/collapse button)
└── Section (flex, gap-60)
    ├── Left Column (데이터 수집)
    │   └── SectionCard
    │       ├── SectionHeader (광고 채널 + count)
    │       └── ChannelRow[] (white cards)
    └── Right Column (데이터 전송)
        ├── SectionCard (EPC)
        ├── SectionCard (광고 채널)
        └── SectionCard (서드파티)
```

### Key Style Values from Actual Implementation
- Accordion body: `min-width: 520px`, `border-radius: 12px`, `margin-bottom: 8px`
- Trigger container: `padding: 12px`
- Avatar: `size: 24px`
- Status circle: `8px × 8px`
- Channel title: `Heading size={16} weight="semibold"`
- Functions text: `Text size={14} weight="medium" color="secondary"`, separator: ` / `
- Section header: `Text size={16} weight="medium"`, `padding: 8px 10px`
- Card header: `Heading size={20} weight="bold"`, `margin-bottom: 16px`

---

## Enforcement

If you find yourself about to write mock code without completing the above checklist:

**STOP. Go back and complete the checklist first.**

This process exists because skipping it leads to subtle bugs (wrong alignment, wrong spacing, wrong colors) that are hard to catch visually but create technical debt.

---

## Mistakes Log (Learn from these)

### 2024 - Integration Overview Page

**Mistake 1: Wrong card structure**
- ❌ Made each channel row a gray card
- ✅ Gray SectionCard wraps all rows, individual rows are white

**Mistake 2: Section header placement**
- ❌ Put SectionHeader outside the gray container
- ✅ SectionHeader should be inside SectionCard

**Mistake 3: Status display**
- ❌ Used Tag components for status (정상, 수신 중)
- ✅ Use Icon components (check_circle, cancel, downloading)

**Mistake 4: Card borders**
- ❌ Added borders to individual channel cards
- ✅ No borders on individual cards

**Mistake 5: Row dividers**
- ❌ Added border-b classes for row separation in tables
- ✅ No divider lines in expanded accordion table

**Mistake 6: Icon color**
- ❌ Used `className="tw:text-green-500"` for Icon color
- ✅ Use `color="#22C55E"` prop directly

**Mistake 7: Wrong gray color**
- ❌ Used `#F7F8FA` for container background
- ✅ Use `#F5F6F8` (color.background.tinted.normal)
