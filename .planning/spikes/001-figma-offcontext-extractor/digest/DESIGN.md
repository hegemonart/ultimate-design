# DESIGN.md

> Auto-generated from Figma file `IAHNrYoqIh56SCxgv3PjCS` at 2026-04-29T00:29:22.307Z
> Source: Design system

## Tokens

## Components

Total: 127 component sets + 40 singleton components

### _Nav bar / Leading
Variants (3):
- Type=-
- Type=Back
- Type=Avatar
Props:
- `Type` (VARIANT) [-, Back, Avatar] — default: `-`

### _Nav bar / Trailing
Variants (2):
- Type=-
- Type=Controls
Props:
- `Control 1` (BOOLEAN) — default: `true`
- `Control 2` (BOOLEAN) — default: `false`
- `Control 3` (BOOLEAN) — default: `false`
- `Type` (VARIANT) [-, Controls] — default: `-`

### _Nav bar / Middle
Variants (6):
- Type=Title
- Type=Logo
- Type=User
- Type=Token
- Type=Wallet
- Type=Search
Props:
- `Verified` (BOOLEAN) — default: `false`
- `Token` (TEXT) — default: `USDC`
- `Symbol` (TEXT) — default: `USDC`
- `Platform` (BOOLEAN) — default: `false`
- `Type` (VARIANT) [Title, Logo, User, Wallet, Search, Token] — default: `Title`

### _ Nav bar / Status Bar
Variants (2):
- Type=iOS
- Type=Android
Props:
- `Type` (VARIANT) [iOS, Android] — default: `iOS`

### _Edit Menu
Variants (3):
- Type=Large
- Type=Medium
- Type=Small
Props:
- `Show Item 9` (BOOLEAN) — default: `true`
- `Show Item 7` (BOOLEAN) — default: `true`
- `Show Item 5` (BOOLEAN) — default: `true`
- `Show Item 2` (BOOLEAN) — default: `true`
- `Show Item 8` (BOOLEAN) — default: `true`
- `Show Item 4` (BOOLEAN) — default: `true`
- `Show Item 3` (BOOLEAN) — default: `true`
- `Show Item 6` (BOOLEAN) — default: `true`
- `Type` (VARIANT) [Small, Medium, Large] — default: `Small`

### _Menu Item
Variants (6):
- Type=Destructive, Bottom Separator=Default
- Type=Default, Bottom Separator=Default
- Type=Destructive, Bottom Separator=None
- Type=Default, Bottom Separator=None
- Type=Destructive, Bottom Separator=Large
- Type=Default, Bottom Separator=Large
Props:
- `Show Symbol` (BOOLEAN) — default: `true`
- `Label` (TEXT) — default: `Label`
- `Symbol` (TEXT) — default: `􀓔`
- `Type` (VARIANT) [Default, Destructive] — default: `Default`
- `Bottom Separator` (VARIANT) [Default, None, Large] — default: `Default`

### _ Menu / Item
Variants (6):
- Type=Default, Separator=Default
- Type=Destructive, Separator=Default
- Type=Default, Separator=None
- Type=Destructive, Separator=None
- Type=Default, Separator=Large
- Type=Destructive, Separator=Large
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9503`
- `← Label` (TEXT) — default: `Label`
- `Icon` (BOOLEAN) — default: `true`
- `Type` (VARIANT) [Default, Destructive] — default: `Default`
- `Separator` (VARIANT) [Default, None, Large] — default: `Default`

### _ Menu / Header
Variants (6):
- Items=2, Label=Yes
- Items=2, Label=No
- Items=3, Label=Yes
- Items=3, Label=No
- Items=4, Label=Yes
- Items=4, Label=No
Props:
- `Items` (VARIANT) [2, 3, 4] — default: `2`
- `Label` (VARIANT) [Yes, No] — default: `Yes`

### _ Menu / Header · Item
Variants (8):
- Type=Default, Separator=Yes, Label=Yes
- Type=Default, Separator=Yes, Label=No
- Type=Destructive, Separator=Yes, Label=Yes
- Type=Destructive, Separator=Yes, Label=No
- Type=Default, Separator=No, Label=Yes
- Type=Default, Separator=No, Label=No
- Type=Destructive, Separator=No, Label=Yes
- Type=Destructive, Separator=No, Label=No
Props:
- `← Label` (TEXT) — default: `Label`
- `Icon` (INSTANCE_SWAP) — default: `2866:9503`
- `Type` (VARIANT) [Default, Destructive] — default: `Default`
- `Separator` (VARIANT) [Yes, No] — default: `Yes`
- `Label` (VARIANT) [Yes, No] — default: `Yes`

### Text
Variants (672):
- Size=Body · S, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Vertical, Reverse=No, Truncate=No
- Size=Body · S, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Horizontal, Reverse=No, Truncate=No
- Size=Body · M, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Vertical, Reverse=No, Truncate=No
- Size=Body · M, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Horizontal, Reverse=No, Truncate=No
- Size=Body · L, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Vertical, Reverse=No, Truncate=No
- Size=Body · L, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Horizontal, Reverse=No, Truncate=No
- Size=Title · S, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Vertical, Reverse=No, Truncate=No
- Size=Title · S, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Horizontal, Reverse=No, Truncate=No
- Size=Title · M, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Vertical, Reverse=No, Truncate=No
- Size=Title · M, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Horizontal, Reverse=No, Truncate=No
- Size=Title · L, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Vertical, Reverse=No, Truncate=No
- Size=Title · L, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Horizontal, Reverse=No, Truncate=No
- Size=Title · XL, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Vertical, Reverse=No, Truncate=No
- Size=Title · XL, State=Enabled, Weight=400 · Regular, Width=Fixed, Direction=Horizontal, Reverse=No, Truncate=No
- Size=Body · S, State=Enabled, Weight=400 · Regular, Width=Auto, Direction=Vertical, Reverse=No, Truncate=No
- Size=Body · S, State=Enabled, Weight=400 · Regular, Width=Auto, Direction=Horizontal, Reverse=No, Truncate=No
- Size=Body · M, State=Enabled, Weight=400 · Regular, Width=Auto, Direction=Vertical, Reverse=No, Truncate=No
- Size=Body · M, State=Enabled, Weight=400 · Regular, Width=Auto, Direction=Horizontal, Reverse=No, Truncate=No
- Size=Body · L, State=Enabled, Weight=400 · Regular, Width=Auto, Direction=Vertical, Reverse=No, Truncate=No
- Size=Body · L, State=Enabled, Weight=400 · Regular, Width=Auto, Direction=Horizontal, Reverse=No, Truncate=No
- … +652 more
Props:
- `← Caption` (TEXT) — default: `Caption`
- `← Label` (TEXT) — default: `Label`
- `Caption` (BOOLEAN) — default: `true`
- `Size` (VARIANT) [Title · XL, Title · L, Title · M, Title · S, Body · L, Body · M, Body · S] — default: `Body · S`
- `State` (VARIANT) [Enabled, Error, Disabled] — default: `Enabled`
- `Weight` (VARIANT) [400 · Regular, 500 · Medium] — default: `400 · Regular`
- `Width` (VARIANT) [Auto, Fixed] — default: `Fixed`
- `Direction` (VARIANT) [Vertical, Horizontal] — default: `Vertical`
- `Reverse` (VARIANT) [No, Yes] — default: `No`
- `Truncate` (VARIANT) [No, Yes] — default: `No`

### Label
Variants (16):
- State=Default, Content=-
- State=Loading, Content=-
- State=Disabled, Content=-
- State=Error, Content=-
- State=Default, Content=Caption
- State=Loading, Content=Caption
- State=Disabled, Content=Caption
- State=Error, Content=Caption
- State=Default, Content=Hint
- State=Loading, Content=Hint
- State=Disabled, Content=Hint
- State=Error, Content=Hint
- State=Default, Content=Link
- State=Loading, Content=Link
- State=Disabled, Content=Link
- State=Error, Content=Link
Props:
- `← Caption` (TEXT) — default: `0 / 100`
- `Icon` (BOOLEAN) — default: `false`
- `← Label` (TEXT) — default: `Label`
- `Required` (BOOLEAN) — default: `false`
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `Hint` (BOOLEAN) — default: `false`
- `State` (VARIANT) [Default, Error, Loading, Disabled] — default: `Default`
- `Content` (VARIANT) [-, Caption, Hint, Link] — default: `-`

### Caption
Variants (3):
- State=Default
- State=Error
- State=Disabled
Props:
- `← Caption` (TEXT) — default: `Caption (unrequired)`
- `← Error` (TEXT) — default: `Message about an error`
- `State` (VARIANT) [Default, Error, Disabled] — default: `Default`

### Caption · Group
Variants (3):
- State=Default
- State=Error
- State=Disabled
Props:
- `State` (VARIANT) [Default, Error, Disabled] — default: `Default`

### Link
Variants (12):
- View=Link, State=Default
- View=Text · Primary, State=Default
- View=Text · Secondary, State=Default
- View=Link, State=Pressed
- View=Text · Primary, State=Pressed
- View=Text · Secondary, State=Pressed
- View=Link, State=Visited
- View=Text · Primary, State=Visited
- View=Text · Secondary, State=Visited
- View=Link, State=Disabled
- View=Text · Primary, State=Disabled
- View=Text · Secondary, State=Disabled
Props:
- `← Label` (TEXT) — default: `Link`
- `Icon` (BOOLEAN) — default: `false`
- `← Icon` (INSTANCE_SWAP) — default: `2834:14710`
- `View` (VARIANT) [Link, Text · Primary, Text · Secondary] — default: `Link`
- `State` (VARIANT) [Default, Pressed, Visited, Disabled] — default: `Default`

### Button
Variants (180):
- Size=S, Icon Button=No, View=Primary, State=Enabled
- Size=M, Icon Button=No, View=Primary, State=Enabled
- Size=L, Icon Button=No, View=Primary, State=Enabled
- Size=S, Icon Button=No, View=Secondary, State=Enabled
- Size=M, Icon Button=No, View=Secondary, State=Enabled
- Size=L, Icon Button=No, View=Secondary, State=Enabled
- Size=S, Icon Button=No, View=Outline, State=Enabled
- Size=M, Icon Button=No, View=Outline, State=Enabled
- Size=L, Icon Button=No, View=Outline, State=Enabled
- Size=S, Icon Button=No, View=Ghost, State=Enabled
- Size=M, Icon Button=No, View=Ghost, State=Enabled
- Size=L, Icon Button=No, View=Ghost, State=Enabled
- Size=S, Icon Button=No, View=Surface, State=Enabled
- Size=M, Icon Button=No, View=Surface, State=Enabled
- Size=L, Icon Button=No, View=Surface, State=Enabled
- Size=S, Icon Button=No, View=Floating, State=Enabled
- Size=M, Icon Button=No, View=Floating, State=Enabled
- Size=L, Icon Button=No, View=Floating, State=Enabled
- Size=S, Icon Button=No, View=Primary, State=Pressed
- Size=M, Icon Button=No, View=Primary, State=Pressed
- … +160 more
Props:
- `Icon · Right` (BOOLEAN) — default: `false`
- `Icon · Left` (BOOLEAN) — default: `false`
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `← Icon · Left` (INSTANCE_SWAP) — default: `2866:9504`
- `← Icon · Right` (INSTANCE_SWAP) — default: `2866:9504`
- `Size` (VARIANT) [S, M, L] — default: `S`
- `Icon Button` (VARIANT) [No, Yes] — default: `No`
- `View` (VARIANT) [Primary, Secondary, Outline, Ghost, Surface, Floating] — default: `Primary`
- `State` (VARIANT) [Enabled, Pressed, Loading, Disabled, Skeleton] — default: `Enabled`

### Sub Button
Variants (120):
- Size=S, Icon Button=No, View=Primary, State=Enabled
- Size=M, Icon Button=No, View=Primary, State=Enabled
- Size=S, Icon Button=No, View=Secondary, State=Enabled
- Size=M, Icon Button=No, View=Secondary, State=Enabled
- Size=S, Icon Button=No, View=Outline, State=Enabled
- Size=M, Icon Button=No, View=Outline, State=Enabled
- Size=S, Icon Button=No, View=Ghost, State=Enabled
- Size=M, Icon Button=No, View=Ghost, State=Enabled
- Size=S, Icon Button=No, View=Surface, State=Enabled
- Size=M, Icon Button=No, View=Surface, State=Enabled
- Size=S, Icon Button=No, View=Floating, State=Enabled
- Size=M, Icon Button=No, View=Floating, State=Enabled
- Size=S, Icon Button=No, View=Primary, State=Pressed
- Size=M, Icon Button=No, View=Primary, State=Pressed
- Size=S, Icon Button=No, View=Secondary, State=Pressed
- Size=M, Icon Button=No, View=Secondary, State=Pressed
- Size=S, Icon Button=No, View=Outline, State=Pressed
- Size=M, Icon Button=No, View=Outline, State=Pressed
- Size=S, Icon Button=No, View=Ghost, State=Pressed
- Size=M, Icon Button=No, View=Ghost, State=Pressed
- … +100 more
Props:
- `Icon · Right` (BOOLEAN) — default: `false`
- `Icon · Left` (BOOLEAN) — default: `false`
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `← Icon · Left` (INSTANCE_SWAP) — default: `2866:9504`
- `← Icon · Right` (INSTANCE_SWAP) — default: `2866:9504`
- `Size` (VARIANT) [S, M] — default: `M`
- `Icon Button` (VARIANT) [No, Yes] — default: `No`
- `View` (VARIANT) [Primary, Secondary, Outline, Ghost, Surface, Floating] — default: `Primary`
- `State` (VARIANT) [Enabled, Pressed, Loading, Disabled, Skeleton] — default: `Enabled`

### Button · Group
Variants (4):
- Layout=Horizontal, Reverse=No
- Layout=Horizontal, Reverse=Yes
- Layout=Vertical, Reverse=No
- Layout=Vertical, Reverse=Yes
Props:
- `Button · 1` (BOOLEAN) — default: `true`
- `Button · 2` (BOOLEAN) — default: `true`
- `Button · 3` (BOOLEAN) — default: `true`
- `Button · 4` (BOOLEAN) — default: `true`
- `Layout` (VARIANT) [Horizontal, Vertical] — default: `Horizontal`
- `Reverse` (VARIANT) [No, Yes] — default: `No`

### Sub Button · Group
Variants (4):
- Reverse=No, Direction=Vertical
- Reverse=Yes, Direction=Vertical
- Reverse=No, Direction=Horizontal
- Reverse=Yes, Direction=Horizontal
Props:
- `Reverse` (VARIANT) [No, Yes] — default: `No`
- `Direction` (VARIANT) [Horizontal, Vertical] — default: `Horizontal`

### _Tag / Leading
Variants (4):
- Content=-
- Content=Icon
- Content=Check
- Content=User
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `Content` (VARIANT) [-, Icon, Check, User] — default: `-`

### _Tag / Trailing
Variants (3):
- Content=-
- Content=Dropdown
- Content=Delete
Props:
- `Content` (VARIANT) [-, Dropdown, Delete] — default: `-`

### Tag
Variants (45):
- Size=S, View=Outline, State=Default
- Size=M, View=Outline, State=Default
- Size=L, View=Outline, State=Default
- Size=S, View=Secondary, State=Default
- Size=M, View=Secondary, State=Default
- Size=L, View=Secondary, State=Default
- Size=S, View=Surface, State=Default
- Size=M, View=Surface, State=Default
- Size=L, View=Surface, State=Default
- Size=S, View=Outline, State=Pressed
- Size=M, View=Outline, State=Pressed
- Size=L, View=Outline, State=Pressed
- Size=S, View=Secondary, State=Pressed
- Size=M, View=Secondary, State=Pressed
- Size=L, View=Secondary, State=Pressed
- Size=S, View=Surface, State=Pressed
- Size=M, View=Surface, State=Pressed
- Size=L, View=Surface, State=Pressed
- Size=S, View=Outline, State=Selected
- Size=M, View=Outline, State=Selected
- … +25 more
Props:
- `Size` (VARIANT) [S, M, L] — default: `S`
- `View` (VARIANT) [Outline, Secondary, Surface] — default: `Outline`
- `State` (VARIANT) [Default, Pressed, Selected, Error, Disabled] — default: `Default`

### Tag · Group
Variants (6):
- Layout=Horizontal, View=Outline
- Layout=Horizontal, View=Secondary
- Layout=Horizontal, View=Surface
- Layout=Wrap, View=Outline
- Layout=Wrap, View=Secondary
- Layout=Wrap, View=Surface
Props:
- `Button` (BOOLEAN) — default: `false`
- `More` (BOOLEAN) — default: `false`
- `Layout` (VARIANT) [Horizontal, Wrap] — default: `Horizontal`
- `View` (VARIANT) [Outline, Secondary, Surface] — default: `Outline`

### Hint
Variants (9):
- State=Default, Type=Hint
- State=Default, Type=Error
- State=Default, Type=Question
- State=Pressed, Type=Hint
- State=Pressed, Type=Error
- State=Pressed, Type=Question
- State=Disabled, Type=Hint
- State=Disabled, Type=Error
- State=Disabled, Type=Question
Props:
- `State` (VARIANT) [Default, Pressed, Disabled] — default: `Default`
- `Type` (VARIANT) [Hint, Error, Question] — default: `Hint`

### Input · Text
Variants (48):
- Size=M, View=Outline, State=Default, ↳ Filled=No
- Size=L, View=Outline, State=Default, ↳ Filled=No
- Size=M, View=Ghost, State=Default, ↳ Filled=No
- Size=L, View=Ghost, State=Default, ↳ Filled=No
- Size=M, View=Surface, State=Default, ↳ Filled=No
- Size=L, View=Surface, State=Default, ↳ Filled=No
- Size=M, View=Outline, State=Focused, ↳ Filled=No
- Size=L, View=Outline, State=Focused, ↳ Filled=No
- Size=M, View=Ghost, State=Focused, ↳ Filled=No
- Size=L, View=Ghost, State=Focused, ↳ Filled=No
- Size=M, View=Surface, State=Focused, ↳ Filled=No
- Size=L, View=Surface, State=Focused, ↳ Filled=No
- Size=M, View=Outline, State=Default, ↳ Filled=Yes
- Size=L, View=Outline, State=Default, ↳ Filled=Yes
- Size=M, View=Ghost, State=Default, ↳ Filled=Yes
- Size=L, View=Ghost, State=Default, ↳ Filled=Yes
- Size=M, View=Surface, State=Default, ↳ Filled=Yes
- Size=L, View=Surface, State=Default, ↳ Filled=Yes
- Size=M, View=Outline, State=Focused, ↳ Filled=Yes
- Size=L, View=Outline, State=Focused, ↳ Filled=Yes
- … +28 more
Props:
- `Size` (VARIANT) [M, L] — default: `M`
- `View` (VARIANT) [Outline, Ghost, Surface] — default: `Outline`
- `State` (VARIANT) [Default, Focused, Error, Disabled] — default: `Default`
- `↳ Filled` (VARIANT) [No, Yes] — default: `No`

### _ Input · Text / Text
Variants (6):
- State=Default, Filled=No
- State=Disabled, Filled=No
- State=Focused, Filled=No
- State=Default, Filled=Yes
- State=Disabled, Filled=Yes
- State=Focused, Filled=Yes
Props:
- `← Label` (TEXT) — default: `Value`
- `← Placeholder` (TEXT) — default: `Placeholder`
- `State` (VARIANT) [Default, Focused, Disabled] — default: `Default`
- `Filled` (VARIANT) [No, Yes] — default: `No`

### _ Input · Text / Leading
Variants (3):
- Content=-
- Content=Icon
- Content=Phone
Props:
- `Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `Content` (VARIANT) [-, Icon, Phone] — default: `-`

### _ Input · Text / Trailing
Variants (3):
- Content=Delete
- Content=Action
- Content=-
Props:
- `Content` (VARIANT) [-, Delete, Action] — default: `-`

### Input · Text Area
Variants (24):
- View=Outline, State=Default, ↳ Filled=No
- View=Inline, State=Default, ↳ Filled=No
- View=Surface, State=Default, ↳ Filled=No
- View=Outline, State=Focused, ↳ Filled=No
- View=Inline, State=Focused, ↳ Filled=No
- View=Surface, State=Focused, ↳ Filled=No
- View=Outline, State=Default, ↳ Filled=Yes
- View=Inline, State=Default, ↳ Filled=Yes
- View=Surface, State=Default, ↳ Filled=Yes
- View=Outline, State=Focused, ↳ Filled=Yes
- View=Inline, State=Focused, ↳ Filled=Yes
- View=Surface, State=Focused, ↳ Filled=Yes
- View=Outline, State=Error, ↳ Filled=No
- View=Inline, State=Error, ↳ Filled=No
- View=Surface, State=Error, ↳ Filled=No
- View=Outline, State=Error, ↳ Filled=Yes
- View=Inline, State=Error, ↳ Filled=Yes
- View=Surface, State=Error, ↳ Filled=Yes
- View=Outline, State=Disabled, ↳ Filled=No
- View=Inline, State=Disabled, ↳ Filled=No
- … +4 more
Props:
- `View` (VARIANT) [Outline, Inline, Surface] — default: `Outline`
- `State` (VARIANT) [Default, Focused, Error, Disabled] — default: `Default`
- `↳ Filled` (VARIANT) [No, Yes] — default: `No`

### _ Input · Text Area / Text
Variants (6):
- State=Default, Filled=No
- State=Disabled, Filled=No
- State=Focused, Filled=No
- State=Default, Filled=Yes
- State=Disabled, Filled=Yes
- State=Focused, Filled=Yes
Props:
- `← Label` (TEXT) — default: `Value`
- `← Placeholder` (TEXT) — default: `Placeholder`
- `State` (VARIANT) [Default, Focused, Disabled] — default: `Default`
- `Filled` (VARIANT) [No, Yes] — default: `No`

### _ Input · Text Area / Leading
Variants (2):
- Content=-
- Content=Icon
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `Content` (VARIANT) [-, Icon] — default: `-`

### _ Input · Text Area / Trailing
Variants (4):
- Content=Delete
- Content=Action
- Content=0 / 100
- Content=-
Props:
- `← Caption` (TEXT) — default: `0 / 100`
- `Content` (VARIANT) [-, Delete, Action, 0 / 100] — default: `-`

### _ Input · Search / Text
Variants (6):
- State=Default, Filled=No
- State=Disabled, Filled=No
- State=Focused, Filled=No
- State=Default, Filled=Yes
- State=Disabled, Filled=Yes
- State=Focused, Filled=Yes
Props:
- `← Label` (TEXT) — default: `Search query`
- `← Placeholder` (TEXT) — default: `Quick Search`
- `State` (VARIANT) [Default, Focused, Disabled] — default: `Default`
- `Filled` (VARIANT) [No, Yes] — default: `No`

### Input · Search
Variants (48):
- Size=M, View=Outline, State=Default, ↳ Filled=No
- Size=L, View=Outline, State=Default, ↳ Filled=No
- Size=M, View=Ghost, State=Default, ↳ Filled=No
- Size=L, View=Ghost, State=Default, ↳ Filled=No
- Size=M, View=Surface, State=Default, ↳ Filled=No
- Size=L, View=Surface, State=Default, ↳ Filled=No
- Size=M, View=Outline, State=Default, ↳ Filled=Yes
- Size=L, View=Outline, State=Default, ↳ Filled=Yes
- Size=M, View=Ghost, State=Default, ↳ Filled=Yes
- Size=L, View=Ghost, State=Default, ↳ Filled=Yes
- Size=M, View=Surface, State=Default, ↳ Filled=Yes
- Size=L, View=Surface, State=Default, ↳ Filled=Yes
- Size=M, View=Outline, State=Focused, ↳ Filled=No
- Size=L, View=Outline, State=Focused, ↳ Filled=No
- Size=M, View=Ghost, State=Focused, ↳ Filled=No
- Size=L, View=Ghost, State=Focused, ↳ Filled=No
- Size=M, View=Surface, State=Focused, ↳ Filled=No
- Size=L, View=Surface, State=Focused, ↳ Filled=No
- Size=M, View=Outline, State=Focused, ↳ Filled=Yes
- Size=L, View=Outline, State=Focused, ↳ Filled=Yes
- … +28 more
Props:
- `Size` (VARIANT) [M, L] — default: `M`
- `View` (VARIANT) [Outline, Ghost, Surface] — default: `Outline`
- `State` (VARIANT) [Default, Focused, Error, Disabled] — default: `Default`
- `↳ Filled` (VARIANT) [No, Yes] — default: `No`

### _ Input · Search / Leading
Variants (2):
- Content=Icon
- Content=-
Props:
- `Icon` (INSTANCE_SWAP) — default: `4519:18577`
- `Content` (VARIANT) [-, Icon] — default: `-`

### _ Input · Search / Trailing
Variants (3):
- Content=Delete
- Content=Action Caption
- Content=-
Props:
- `Content` (VARIANT) [-, Delete, Action Caption] — default: `-`

### Input · Fieldset
Variants (6):
- State=Default, Row=No
- State=Default, Row=Yes
- State=Error, Row=No
- State=Error, Row=Yes
- State=Disabled, Row=No
- State=Disabled, Row=Yes
Props:
- `Content` (INSTANCE_SWAP) — default: `2386:2414`
- `Caption` (BOOLEAN) — default: `true`
- `Label` (BOOLEAN) — default: `true`
- `State` (VARIANT) [Default, Error, Disabled] — default: `Default`
- `Row` (VARIANT) [No, Yes] — default: `No`

### List · Item
Variants (40):
- Type=Inline, View=Ghost, State=Default, Swipe action=No
- Type=Inline, View=Ghost, State=Default, Swipe action=Yes
- Type=Inline, View=Surface, State=Default, Swipe action=Yes
- Type=Inline, View=Surface, State=Default, Swipe action=No
- Type=Default, View=Ghost, State=Default, Swipe action=No
- Type=Default, View=Ghost, State=Default, Swipe action=Yes
- Type=Default, View=Surface, State=Default, Swipe action=Yes
- Type=Default, View=Outline, State=Default, Swipe action=Yes
- Type=Default, View=Outline, State=Default, Swipe action=No
- Type=Default, View=Surface, State=Default, Swipe action=No
- Type=Inline, View=Ghost, State=Pressed, Swipe action=No
- Type=Inline, View=Ghost, State=Pressed, Swipe action=Yes
- Type=Inline, View=Surface, State=Pressed, Swipe action=Yes
- Type=Inline, View=Surface, State=Pressed, Swipe action=No
- Type=Default, View=Ghost, State=Pressed, Swipe action=No
- Type=Default, View=Ghost, State=Pressed, Swipe action=Yes
- Type=Default, View=Surface, State=Pressed, Swipe action=Yes
- Type=Default, View=Outline, State=Pressed, Swipe action=Yes
- Type=Default, View=Ghost, State=Loading, Swipe action=No
- Type=Default, View=Ghost, State=Loading, Swipe action=Yes
- … +20 more
Props:
- `Text · Trailing` (BOOLEAN) — default: `false`
- `Leading` (BOOLEAN) — default: `true`
- `Trailing` (BOOLEAN) — default: `false`
- `Label` (BOOLEAN) — default: `false`
- `Divider` (BOOLEAN) — default: `true`
- `Type` (VARIANT) [Default, Inline] — default: `Inline`
- `View` (VARIANT) [Ghost, Surface, Outline] — default: `Ghost`
- `State` (VARIANT) [Default, Pressed, Loading, Disabled] — default: `Default`
- `Swipe action` (VARIANT) [No, Yes] — default: `No`

### Option
Variants (2):
- State=Default
- State=Disabled
Props:
- `← Label` (TEXT) — default: `Label`
- `Label` (BOOLEAN) — default: `true`
- `State` (VARIANT) [Default, Disabled] — default: `Default`

### List
Variants (15):
- Items=2
- Items=3
- Items=4
- Items=5
- Items=6
- Items=7
- Items=8
- Items=9
- Items=10
- Items=11
- Items=12
- Items=13
- Items=14
- Items=15
- Items=16
Props:
- `Items` (VARIANT) [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] — default: `2`

### Select
Variants (48):
- Size=M, View=Outline, State=Default, ↳ Selected=No
- Size=L, View=Outline, State=Default, ↳ Selected=No
- Size=M, View=Ghost, State=Default, ↳ Selected=No
- Size=L, View=Ghost, State=Default, ↳ Selected=No
- Size=M, View=Surface, State=Default, ↳ Selected=No
- Size=L, View=Surface, State=Default, ↳ Selected=No
- Size=M, View=Outline, State=Focused, ↳ Selected=No
- Size=L, View=Outline, State=Focused, ↳ Selected=No
- Size=M, View=Ghost, State=Focused, ↳ Selected=No
- Size=L, View=Ghost, State=Focused, ↳ Selected=No
- Size=M, View=Surface, State=Focused, ↳ Selected=No
- Size=L, View=Surface, State=Focused, ↳ Selected=No
- Size=M, View=Outline, State=Default, ↳ Selected=Yes
- Size=L, View=Outline, State=Default, ↳ Selected=Yes
- Size=M, View=Ghost, State=Default, ↳ Selected=Yes
- Size=L, View=Ghost, State=Default, ↳ Selected=Yes
- Size=M, View=Surface, State=Default, ↳ Selected=Yes
- Size=L, View=Surface, State=Default, ↳ Selected=Yes
- Size=M, View=Outline, State=Focused, ↳ Selected=Yes
- Size=L, View=Outline, State=Focused, ↳ Selected=Yes
- … +28 more
Props:
- `Size` (VARIANT) [M, L] — default: `M`
- `View` (VARIANT) [Outline, Ghost, Surface] — default: `Outline`
- `State` (VARIANT) [Default, Focused, Error, Disabled] — default: `Default`
- `↳ Selected` (VARIANT) [No, Yes] — default: `No`

### _ Select / Text
Variants (4):
- State=Default, Filled=No
- State=Disabled, Filled=No
- State=Default, Filled=Yes
- State=Disabled, Filled=Yes
Props:
- `← Label` (TEXT) — default: `Selected item`
- `← Placeholder` (TEXT) — default: `Placeholder`
- `State` (VARIANT) [Default, Disabled] — default: `Default`
- `Filled` (VARIANT) [No, Yes] — default: `No`

### _ Select / Leading
Variants (2):
- Content=-
- Content=Icon
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `Content` (VARIANT) [-, Icon] — default: `-`

### _ Select / Trailing
Variants (3):
- Content=Dropdown
- Content=Action
- Content=-
Props:
- `← Label` (TEXT) — default: `Label`
- `Content` (VARIANT) [-, Dropdown, Action] — default: `-`

### _ Multiselect / Trailing
Variants (2):
- Content=Delete
- Content=-
Props:
- `Content` (VARIANT) [-, Delete] — default: `-`

### Multiselect
Variants (18):
- Size=M, View=Surface, State=Filled
- Size=L, View=Surface, State=Filled
- Size=L, View=Surface, State=Error
- Size=M, View=Surface, State=Error
- Size=M, View=Ghost, State=Filled
- Size=L, View=Ghost, State=Filled
- Size=L, View=Ghost, State=Error
- Size=M, View=Ghost, State=Error
- Size=M, View=Outline, State=Filled
- Size=L, View=Outline, State=Filled
- Size=L, View=Outline, State=Disabled
- Size=L, View=Ghost, State=Disabled
- Size=L, View=Surface, State=Disabled
- Size=L, View=Outline, State=Error
- Size=M, View=Outline, State=Error
- Size=M, View=Outline, State=Disabled
- Size=M, View=Ghost, State=Disabled
- Size=M, View=Surface, State=Disabled
Props:
- `Size` (VARIANT) [M, L] — default: `M`
- `View` (VARIANT) [Outline, Ghost, Surface] — default: `Outline`
- `State` (VARIANT) [Filled, Error, Disabled] — default: `Filled`

### Segmented Control
Variants (168):
- Selected=None, View=Secondary, State=Default, Width=Fixed
- Selected=2, View=Secondary, State=Default, Width=Fixed
- Selected=3, View=Secondary, State=Default, Width=Fixed
- Selected=4, View=Secondary, State=Default, Width=Fixed
- Selected=5, View=Secondary, State=Default, Width=Fixed
- Selected=6, View=Secondary, State=Default, Width=Fixed
- Selected=1, View=Secondary, State=Default, Width=Fixed
- Selected=None, View=Secondary, State=Error, Width=Fixed
- Selected=2, View=Secondary, State=Error, Width=Fixed
- Selected=3, View=Secondary, State=Error, Width=Fixed
- Selected=4, View=Secondary, State=Error, Width=Fixed
- Selected=5, View=Secondary, State=Error, Width=Fixed
- Selected=6, View=Secondary, State=Error, Width=Fixed
- Selected=1, View=Secondary, State=Error, Width=Fixed
- Selected=None, View=Secondary, State=Disabled, Width=Fixed
- Selected=2, View=Secondary, State=Disabled, Width=Fixed
- Selected=3, View=Secondary, State=Disabled, Width=Fixed
- Selected=4, View=Secondary, State=Disabled, Width=Fixed
- Selected=5, View=Secondary, State=Disabled, Width=Fixed
- Selected=6, View=Secondary, State=Disabled, Width=Fixed
- … +148 more
Props:
- `Item 3` (BOOLEAN) — default: `true`
- `Item 4` (BOOLEAN) — default: `false`
- `Item 5` (BOOLEAN) — default: `false`
- `Item 6` (BOOLEAN) — default: `false`
- `Selected` (VARIANT) [None, 1, 2, 3, 4, 5, 6] — default: `None`
- `View` (VARIANT) [Secondary, Surface, Ghost] — default: `Secondary`
- `State` (VARIANT) [Default, Error, Disabled, Loading] — default: `Default`
- `Width` (VARIANT) [Fixed, Auto] — default: `Fixed`

### _ Segmented Control / Item
Variants (54):
- Type=Text, State=Default, View=Surface, Selected=No
- Type=Text, State=Default, View=Secondary, Selected=No
- Type=Text, State=Default, View=Ghost, Selected=No
- Type=Text, State=Default, View=Surface, Selected=Yes
- Type=Text, State=Default, View=Secondary, Selected=Yes
- Type=Text, State=Default, View=Ghost, Selected=Yes
- Type=Text, State=Loading, View=Surface, Selected=No
- Type=Text, State=Loading, View=Secondary, Selected=No
- Type=Text, State=Loading, View=Ghost, Selected=No
- Type=Text, State=Loading, View=Surface, Selected=Yes
- Type=Text, State=Loading, View=Secondary, Selected=Yes
- Type=Text, State=Loading, View=Ghost, Selected=Yes
- Type=Text, State=Disabled, View=Surface, Selected=No
- Type=Text, State=Disabled, View=Secondary, Selected=No
- Type=Text, State=Disabled, View=Ghost, Selected=No
- Type=Text, State=Disabled, View=Surface, Selected=Yes
- Type=Text, State=Disabled, View=Secondary, Selected=Yes
- Type=Text, State=Disabled, View=Ghost, Selected=Yes
- Type=Text + Icon, State=Default, View=Surface, Selected=No
- Type=Text + Icon, State=Default, View=Secondary, Selected=No
- … +34 more
Props:
- `Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `Type` (VARIANT) [Text, Text + Icon, Icon] — default: `Text`
- `State` (VARIANT) [Default, Disabled, Loading] — default: `Default`
- `View` (VARIANT) [Surface, Secondary, Ghost] — default: `Surface`
- `Selected` (VARIANT) [No, Yes] — default: `No`

### Status
Variants (26):
- View=Secondary, Color=Neutral, Icon=Yes
- View=Secondary, Color=Neutral, Icon=No
- View=Secondary, Color=Blue, Icon=Yes
- View=Secondary, Color=Blue, Icon=No
- View=Secondary, Color=Green, Icon=Yes
- View=Secondary, Color=Green, Icon=No
- View=Secondary, Color=Yellow, Icon=Yes
- View=Secondary, Color=Yellow, Icon=No
- View=Secondary, Color=Purple, Icon=Yes
- View=Secondary, Color=Purple, Icon=No
- View=Secondary, Color=Red, Icon=Yes
- View=Secondary, Color=Red, Icon=No
- View=Surface, Color=Neutral, Icon=Yes
- View=Surface, Color=Neutral, Icon=No
- View=Primary, Color=Neutral, Icon=Yes
- View=Primary, Color=Neutral, Icon=No
- View=Primary, Color=Blue, Icon=Yes
- View=Primary, Color=Blue, Icon=No
- View=Primary, Color=Green, Icon=Yes
- View=Primary, Color=Green, Icon=No
- … +6 more
Props:
- `← Label` (TEXT) — default: `Label`
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `View` (VARIANT) [Primary, Secondary, Surface] — default: `Primary`
- `Color` (VARIANT) [Neutral, Green, Yellow, Red, Blue, Purple] — default: `Neutral`
- `Icon` (VARIANT) [Yes, No] — default: `Yes`

### Stepper
Variants (96):
- Size=XS, View=Secondary, State=Default
- Size=XS, View=Outline, State=Default
- Size=XS, View=Ghost, State=Default
- Size=XS, View=Surface, State=Default
- Size=S, View=Secondary, State=Default
- Size=S, View=Outline, State=Default
- Size=S, View=Ghost, State=Default
- Size=S, View=Surface, State=Default
- Size=M, View=Secondary, State=Default
- Size=M, View=Outline, State=Default
- Size=M, View=Ghost, State=Default
- Size=M, View=Surface, State=Default
- Size=L, View=Secondary, State=Default
- Size=L, View=Outline, State=Default
- Size=L, View=Ghost, State=Default
- Size=L, View=Surface, State=Default
- Size=XS, View=Secondary, State=Loading
- Size=XS, View=Outline, State=Loading
- Size=XS, View=Ghost, State=Loading
- Size=XS, View=Surface, State=Loading
- … +76 more
Props:
- `Counter` (BOOLEAN) — default: `true`
- `Size` (VARIANT) [XS, S, M, L] — default: `XS`
- `View` (VARIANT) [Secondary, Outline, Ghost, Surface] — default: `Secondary`
- `State` (VARIANT) [Default, Minimum, Maximum, Error, Loading, Disabled] — default: `Default`

### Check
Variants (9):
- State=Default, ↳ Selected=No, ↳ Indeterminate=No
- State=Error, ↳ Selected=No, ↳ Indeterminate=No
- State=Disabled, ↳ Selected=No, ↳ Indeterminate=No
- State=Default, ↳ Selected=Yes, ↳ Indeterminate=No
- State=Error, ↳ Selected=Yes, ↳ Indeterminate=No
- State=Disabled, ↳ Selected=Yes, ↳ Indeterminate=No
- State=Default, ↳ Selected=Yes, ↳ Indeterminate=Yes
- State=Error, ↳ Selected=Yes, ↳ Indeterminate=Yes
- State=Disabled, ↳ Selected=Yes, ↳ Indeterminate=Yes
Props:
- `State` (VARIANT) [Default, Error, Disabled] — default: `Default`
- `↳ Selected` (VARIANT) [No, Yes] — default: `No`
- `↳ Indeterminate` (VARIANT) [No, Yes] — default: `No`

### Checkmark
Variants (6):
- State=Default, ↳ Selected=No
- State=Error, ↳ Selected=No
- State=Disabled, ↳ Selected=No
- State=Default, ↳ Selected=Yes
- State=Error, ↳ Selected=Yes
- State=Disabled, ↳ Selected=Yes
Props:
- `State` (VARIANT) [Default, Error, Disabled] — default: `Default`
- `↳ Selected` (VARIANT) [No, Yes] — default: `No`

### Radio
Variants (6):
- State=Default, ↳ Selected=Yes
- State=Default, ↳ Selected=No
- State=Error, ↳ Selected=Yes
- State=Error, ↳ Selected=No
- State=Disabled, ↳ Selected=Yes
- State=Disabled, ↳ Selected=No
Props:
- `State` (VARIANT) [Default, Error, Disabled] — default: `Default`
- `↳ Selected` (VARIANT) [No, Yes] — default: `No`

### Toggle
Variants (6):
- State=Default, ↳ Selected=No
- State=Default, ↳ Selected=Yes
- State=Error, ↳ Selected=No
- State=Error, ↳ Selected=Yes
- State=Disabled, ↳ Selected=No
- State=Disabled, ↳ Selected=Yes
Props:
- `State` (VARIANT) [Default, Error, Disabled] — default: `Default`
- `↳ Selected` (VARIANT) [No, Yes] — default: `No`

### _ Toggle
Variants (2):
- State=Off
- State=On
Props:
- `State` (VARIANT) [Off, On] — default: `On`

### _Checkboxes
Variants (30):
- Type=Selected, State=Enabled
- Type=Selected, State=Disabled
- Type=Selected, State=Hovered
- Type=Selected, State=Focused
- Type=Selected, State=Pressed
- Type=Indeterminate, State=Enabled
- Type=Indeterminate, State=Disabled
- Type=Indeterminate, State=Hovered
- Type=Indeterminate, State=Focused
- Type=Indeterminate, State=Pressed
- Type=Unselected, State=Enabled
- Type=Unselected, State=Disabled
- Type=Unselected, State=Hovered
- Type=Unselected, State=Focused
- Type=Unselected, State=Pressed
- Type=Error selected, State=Enabled
- Type=Error selected, State=Disabled
- Type=Error selected, State=Hovered
- Type=Error selected, State=Focused
- Type=Error selected, State=Pressed
- … +10 more
Props:
- `Type` (VARIANT) [Selected, Unselected, Indeterminate, Error unselected, Error indeterminate, Error selected] — default: `Selected`
- `State` (VARIANT) [Enabled, Hovered, Focused, Pressed, Disabled] — default: `Enabled`

### _Radio buttons
Variants (10):
- Selected=False, State=Disabled
- Selected=False, State=Pressed
- Selected=False, State=Focused
- Selected=False, State=Hovered
- Selected=False, State=Enabled
- Selected=True, State=Disabled
- Selected=True, State=Pressed
- Selected=True, State=Focused
- Selected=True, State=Hovered
- Selected=True, State=Enabled
Props:
- `Selected` (VARIANT) [True, False] — default: `True`
- `State` (VARIANT) [Enabled, Hovered, Focused, Pressed, Disabled] — default: `Enabled`

### _Switch
Variants (20):
- Selected=True, State=Enabled, Icon=False
- Selected=True, State=Hovered, Icon=False
- Selected=True, State=Focused, Icon=False
- Selected=True, State=Pressed, Icon=False
- Selected=True, State=Disabled, Icon=False
- Selected=True, State=Enabled, Icon=True
- Selected=True, State=Hovered, Icon=True
- Selected=True, State=Focused, Icon=True
- Selected=True, State=Pressed, Icon=True
- Selected=True, State=Disabled, Icon=True
- Selected=False, State=Enabled, Icon=False
- Selected=False, State=Hovered, Icon=False
- Selected=False, State=Focused, Icon=False
- Selected=False, State=Pressed, Icon=False
- Selected=False, State=Disabled, Icon=False
- Selected=False, State=Enabled, Icon=True
- Selected=False, State=Hovered, Icon=True
- Selected=False, State=Focused, Icon=True
- Selected=False, State=Pressed, Icon=True
- Selected=False, State=Disabled, Icon=True
Props:
- `Selected` (VARIANT) [False, True] — default: `True`
- `State` (VARIANT) [Enabled, Hovered, Focused, Pressed, Disabled] — default: `Enabled`
- `Icon` (VARIANT) [False, True] — default: `False`

### Wrapper
Variants (92):
- Size=24, Content=Number, State=Default
- Size=24, Content=Number, State=Selected
- Size=24, Content=Number, State=Disabled
- Size=24, Content=Number, State=Loading
- Size=32, Content=Number, State=Default
- Size=32, Content=Number, State=Selected
- Size=32, Content=Number, State=Disabled
- Size=32, Content=Number, State=Loading
- Size=40, Content=Icon, State=Default
- Size=24, Content=Icon, State=Default
- Size=24, Content=Icon, State=Selected
- Size=24, Content=Icon, State=Disabled
- Size=24, Content=Icon, State=Loading
- Size=32, Content=Icon, State=Default
- Size=32, Content=Icon, State=Selected
- Size=32, Content=Icon, State=Disabled
- Size=32, Content=Icon, State=Loading
- Size=48, Content=Icon, State=Default
- Size=48, Content=Icon, State=Selected
- Size=48, Content=Icon, State=Disabled
- … +72 more
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `Badge` (BOOLEAN) — default: `false`
- `Size` (VARIANT) [24, 32, 40, 48, 56, 64, 96, 120, 160, 200] — default: `40`
- `Content` (VARIANT) [Icon, Image, Number] — default: `Icon`
- `State` (VARIANT) [Default, Selected, Disabled, Loading] — default: `Default`

### _ [OD] Bottom sheet
Variants (2):
- Minimized=No
- Minimized=Yes
Props:
- `Close button` (BOOLEAN) — default: `false`
- `Contol 1` (BOOLEAN) — default: `false`
- `Avatar` (BOOLEAN) — default: `false`
- `Control 2` (BOOLEAN) — default: `false`
- `Header` (BOOLEAN) — default: `true`
- `Grabber` (BOOLEAN) — default: `true`
- `Minimized` (VARIANT) [Yes, No] — default: `No`

### _ Bottom sheet / Middle
Variants (4):
- Type=Label, State=Default
- Type=Label, State=Disabled
- Type=Route, State=Default
- Type=Route, State=Disabled
Props:
- `Avatar` (BOOLEAN) — default: `false`
- `Type` (VARIANT) [Label, Route] — default: `Label`
- `State` (VARIANT) [Default, Disabled] — default: `Default`

### _ Bottom sheet / Leading
Variants (3):
- Content=-
- Content=Icon
- Content=Back
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `Content` (VARIANT) [-, Icon, Back] — default: `-`

### _ Bottom sheet / Trailing
Variants (3):
- Content=-
- Content=Controls
- Content=More
Props:
- `Close sheet` (BOOLEAN) — default: `true`
- `Control 1` (BOOLEAN) — default: `false`
- `Control 2` (BOOLEAN) — default: `false`
- `Control 3` (BOOLEAN) — default: `false`
- `Content` (VARIANT) [-, Controls, More] — default: `-`

### Dialog
Variants (2):
- Location=Bottom
- Location=Top
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `Icon` (BOOLEAN) — default: `true`
- `Location` (VARIANT) [Bottom, Top] — default: `Bottom`

### _ Pop-up / Middle
Variants (2):
- State=Default
- State=Disabled
Props:
- `Avatar` (BOOLEAN) — default: `false`
- `State` (VARIANT) [Default, Disabled] — default: `Default`

### _ Pop-up / Leading
Variants (3):
- Content=-
- Content=Icon
- Content=Back
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9503`
- `Content` (VARIANT) [-, Icon, Back] — default: `-`

### _ Pop-up / Trailing
Variants (3):
- Content=-
- Content=Controls
- Content=More
Props:
- `Close sheet` (BOOLEAN) — default: `false`
- `Control 1` (BOOLEAN) — default: `true`
- `Control 2` (BOOLEAN) — default: `false`
- `Control 3` (BOOLEAN) — default: `false`
- `Content` (VARIANT) [-, Controls, More] — default: `-`

### _ Toast / Leading
Variants (2):
- Content=-
- Content=Icon
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9503`
- `Content` (VARIANT) [-, Icon] — default: `-`

### _ Toast / Leading
Variants (3):
- Content=-
- Content=Icon
- Content=Avatar
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9504`
- `Content` (VARIANT) [-, Icon, Avatar] — default: `-`

### _ Toast / Trailing
Variants (4):
- Content=Action + Close
- Content=Action
- Content=Close
- Content=-
Props:
- `Content` (VARIANT) [-, Close, Action, Action + Close] — default: `-`

### Toast
Variants (12):
- View=Floating, Type=Default
- View=Floating, Type=Error
- View=Floating, Type=Success
- View=Surface, Type=Default
- View=Surface, Type=Error
- View=Surface, Type=Success
- View=Outline, Type=Default
- View=Ghost, Type=Default
- View=Outline, Type=Error
- View=Outline, Type=Success
- View=Ghost, Type=Error
- View=Ghost, Type=Success
Props:
- `View` (VARIANT) [Floating, Surface, Outline, Ghost] — default: `Floating`
- `Type` (VARIANT) [Default, Error, Success] — default: `Default`

### _Tooltip-Tail
Variants (4):
- Property 1=Left
- Property 1=Right
- Property 1=Down
- Property 1=Up
Props:
- `Property 1` (VARIANT) [Left, Right, Up, Down] — default: `Left`

### _Tooltip
Variants (4):
- Property 1=Left
- Property 1=Right
- Property 1=Up
- Property 1=Down
Props:
- `Property 1` (VARIANT) [Down, Left, Right, Up] — default: `Left`

### _Tooltip
Variants (1):
- Property 1=Tooltip-Shield
Props:
- `Property 1` (VARIANT) [Tooltip-Shield] — default: `Tooltip-Shield`

### Tooltip
Variants (21):
- Color=Neutral, Tip Direction=None
- Color=Colored, Tip Direction=None
- Color=Overlay, Tip Direction=None
- Color=Neutral, Tip Direction=↓BC
- Color=Colored, Tip Direction=↓BC
- Color=Overlay, Tip Direction=↓BC
- Color=Neutral, Tip Direction=↑TC
- Color=Colored, Tip Direction=↑TC
- Color=Overlay, Tip Direction=↑TC
- Color=Neutral, Tip Direction=↖TL
- Color=Colored, Tip Direction=↖TL
- Color=Overlay, Tip Direction=↖TL
- Color=Neutral, Tip Direction=↗TR
- Color=Colored, Tip Direction=↗TR
- Color=Overlay, Tip Direction=↗TR
- Color=Neutral, Tip Direction=↘BR
- Color=Colored, Tip Direction=↘BR
- Color=Overlay, Tip Direction=↘BR
- Color=Neutral, Tip Direction=↙BL
- Color=Colored, Tip Direction=↙BL
- … +1 more
Props:
- `Color` (VARIANT) [Neutral, Overlay, Colored] — default: `Neutral`
- `Tip Direction` (VARIANT) [None, ↑TC, ↓BC, ↖TL, ↗TR, ↙BL, ↘BR] — default: `↓BC`

### _ Accordion / Trailing
Variants (2):
- Content=Dropdown
- Content=-
Props:
- `Content` (VARIANT) [-, Dropdown] — default: `-`

### _ Accordion / Leading
Variants (2):
- Content=Icon
- Content=-
Props:
- `Content` (VARIANT) [-, Icon] — default: `-`

### Accordion
Variants (18):
- View=Outline, State=Default, Selected=No
- View=Outline, State=Error, Selected=No
- View=Outline, State=Disabled, Selected=No
- View=Ghost, State=Default, Selected=No
- View=Ghost, State=Error, Selected=No
- View=Ghost, State=Disabled, Selected=No
- View=Surface, State=Default, Selected=No
- View=Surface, State=Error, Selected=No
- View=Surface, State=Disabled, Selected=No
- View=Outline, State=Default, Selected=Yes
- View=Outline, State=Error, Selected=Yes
- View=Outline, State=Disabled, Selected=Yes
- View=Ghost, State=Default, Selected=Yes
- View=Ghost, State=Error, Selected=Yes
- View=Ghost, State=Disabled, Selected=Yes
- View=Surface, State=Default, Selected=Yes
- View=Surface, State=Error, Selected=Yes
- View=Surface, State=Disabled, Selected=Yes
Props:
- `View` (VARIANT) [Outline, Ghost, Surface] — default: `Outline`
- `State` (VARIANT) [Default, Error, Disabled] — default: `Default`
- `Selected` (VARIANT) [No, Yes] — default: `No`

### Avatar
Variants (99):
- Size=64, Content=Monogram, State=Disabled, Color=Neutral
- Size=64, Content=Monogram, State=Skeleton, Color=Neutral
- Size=64, Content=Monogram, State=Disabled, Color=Blue
- Size=64, Content=Monogram, State=Disabled, Color=Green
- Size=64, Content=Monogram, State=Disabled, Color=Orange
- Size=64, Content=Monogram, State=Disabled, Color=Purple
- Size=64, Content=Monogram, State=Disabled, Color=Red
- Size=56, Content=Monogram, State=Disabled, Color=Neutral
- Size=56, Content=Monogram, State=Skeleton, Color=Neutral
- Size=56, Content=Monogram, State=Disabled, Color=Blue
- Size=56, Content=Monogram, State=Disabled, Color=Green
- Size=56, Content=Monogram, State=Disabled, Color=Orange
- Size=56, Content=Monogram, State=Disabled, Color=Purple
- Size=56, Content=Monogram, State=Disabled, Color=Red
- Size=48, Content=Monogram, State=Disabled, Color=Neutral
- Size=48, Content=Monogram, State=Skeleton, Color=Neutral
- Size=48, Content=Monogram, State=Disabled, Color=Blue
- Size=48, Content=Monogram, State=Disabled, Color=Green
- Size=48, Content=Monogram, State=Disabled, Color=Orange
- Size=48, Content=Monogram, State=Disabled, Color=Purple
- … +79 more
Props:
- `← Label` (TEXT) — default: `A`
- `Badge` (BOOLEAN) — default: `false`
- `Action` (BOOLEAN) — default: `false`
- `Size` (VARIANT) [24, 32, 40, 48, 56, 64, 200] — default: `40`
- `Content` (VARIANT) [Image, Monogram] — default: `Image`
- `State` (VARIANT) [Default, Disabled, Skeleton] — default: `Default`
- `Color` (VARIANT) [-, Neutral, Blue, Green, Orange, Purple, Red] — default: `-`

### User · Group
Variants (7):
- Items=2
- Items=3
- Items=4
- Items=5
- Items=6
- Items=7
- Items=8
Props:
- `Items` (VARIANT) [2, 3, 4, 5, 6, 7, 8] — default: `2`

### Banner
Variants (4):
- State=Default
- State=Loading
- State=Focused
- State=Disabled
Props:
- `State` (VARIANT) [Default, Focused, Disabled, Loading] — default: `Default`

### Badge
Variants (19):
- View=Primary, Color=Neutral
- View=Primary, Color=Red
- View=Primary, Color=Green
- View=Primary, Color=Blue
- View=Primary, Color=Purple
- View=Primary, Color=Yellow
- View=Secondary, Color=Neutral
- View=Secondary, Color=Red
- View=Secondary, Color=Green
- View=Secondary, Color=Blue
- View=Secondary, Color=Purple
- View=Secondary, Color=Yellow
- View=Surface, Color=Neutral
- View=Dot, Color=Neutral
- View=Dot, Color=Red
- View=Dot, Color=Green
- View=Dot, Color=Blue
- View=Dot, Color=Purple
- View=Dot, Color=Yellow
Props:
- `← Label` (TEXT) — default: `99+`
- `View` (VARIANT) [Primary, Secondary, Surface, Dot] — default: `Primary`
- `Color` (VARIANT) [Neutral, Red, Green, Blue, Purple, Yellow] — default: `Neutral`

### Compass
Variants (8):
- Direction=N
- Direction=NE
- Direction=E
- Direction=SE
- Direction=S
- Direction=SW
- Direction=W
- Direction=NW
Props:
- `Direction` (VARIANT) [N, NE, E, SE, S, SW, W, NW] — default: `N`

### Divider
Variants (26):
- Text=No, Padding=-, Offset=-
- Text=Yes, Padding=-, Offset=-
- Text=No, Padding=-, Offset=4
- Text=Yes, Padding=-, Offset=4
- Text=No, Padding=4, Offset=4
- Text=Yes, Padding=4, Offset=4
- Text=No, Padding=-, Offset=8
- Text=Yes, Padding=-, Offset=8
- Text=No, Padding=8, Offset=8
- Text=Yes, Padding=8, Offset=8
- Text=No, Padding=-, Offset=12
- Text=Yes, Padding=-, Offset=12
- Text=No, Padding=12, Offset=12
- Text=Yes, Padding=12, Offset=12
- Text=No, Padding=-, Offset=16
- Text=Yes, Padding=-, Offset=16
- Text=No, Padding=16, Offset=16
- Text=Yes, Padding=16, Offset=16
- Text=No, Padding=-, Offset=20
- Text=Yes, Padding=-, Offset=20
- … +6 more
Props:
- `Text` (VARIANT) [No, Yes] — default: `No`
- `Padding` (VARIANT) [4, -, 8, 12, 16, 20, 24] — default: `-`
- `Offset` (VARIANT) [-, 4, 8, 12, 16, 20, 24] — default: `-`

### _ Loader · Animation
Variants (4):
- Animation=0%
- Animation=25%
- Animation=50%
- Animation=75%
Props:
- `Animation` (VARIANT) [0%, 25%, 50%, 75%] — default: `0%`

### Loader
Variants (6):
- Size=16
- Size=20
- Size=24
- Size=32
- Size=40
- Size=48
Props:
- `Size` (VARIANT) [16, 20, 24, 32, 40, 48] — default: `16`

### Logo · V-coin
Variants (2):
- Darker=No
- Darker=Yes
Props:
- `Darker` (VARIANT) [No, Yes] — default: `No`

### Logo · App
Variants (2):
- Size=Full
- Size=Short
Props:
- `Size` (VARIANT) [Full, Short] — default: `Full`

### _ PageIndicator / Item
Variants (4):
- Type=Slider, State=Selected
- Type=Page, State=Selected
- Type=Page, State=Disabled
- Type=Page Far, State=Disabled
Props:
- `Type` (VARIANT) [Slider, Page, Page Far] — default: `Slider`
- `State` (VARIANT) [Selected, Disabled] — default: `Selected`

### PageIndicator
Variants (10):
- Item=Page, Selected=1
- Item=Slider, Selected=1
- Item=Page, Selected=2
- Item=Slider, Selected=2
- Item=Page, Selected=3
- Item=Slider, Selected=3
- Item=Page, Selected=4
- Item=Slider, Selected=4
- Item=Page, Selected=5
- Item=Slider, Selected=5
Props:
- `Item` (VARIANT) [Page, Slider] — default: `Page`
- `Selected` (VARIANT) [1, 2, 3, 4, 5] — default: `1`

### _Map-Cursors-Icons
Variants (4):
- Property 1=Default
- Property 1=500m
- Property 1=5000m
- Property 1=Focused
Props:
- `Property 1` (VARIANT) [Default, Focused, 500m, 5000m] — default: `Default`

### _ Pin · Stick
Variants (2):
- Flying=No
- Flying=Yes
Props:
- `Flying` (VARIANT) [No, Yes] — default: `No`

### Pin · Tooltip
Variants (4):
- Tip=Point · Bottom
- Tip=None
- Tip=Point · Top
- Tip=Stick
Props:
- `Tip` (VARIANT) [None, Point · Bottom, Point · Top, Stick] — default: `Point · Bottom`

### Pin · Point
Variants (28):
- Type=Point, Size=S, State=Default, Floating=No
- Type=Text, Size=S, State=Default, Floating=No
- Type=Point, Size=S, State=Default, Floating=Yes
- Type=Text, Size=S, State=Default, Floating=Yes
- Type=Point, Size=M, State=Default, Floating=No
- Type=Text, Size=M, State=Default, Floating=No
- Type=Point, Size=M, State=Default, Floating=Yes
- Type=Text, Size=M, State=Default, Floating=Yes
- Type=Point, Size=L, State=Default, Floating=No
- Type=Text, Size=L, State=Default, Floating=No
- Type=Point, Size=L, State=Default, Floating=Yes
- Type=Text, Size=L, State=Default, Floating=Yes
- Type=Point, Size=XS, State=Default, Floating=No
- Type=Point, Size=XS, State=Default, Floating=Yes
- Type=Point, Size=S, State=Disabled, Floating=No
- Type=Text, Size=S, State=Disabled, Floating=No
- Type=Point, Size=S, State=Disabled, Floating=Yes
- Type=Text, Size=S, State=Disabled, Floating=Yes
- Type=Point, Size=M, State=Disabled, Floating=No
- Type=Text, Size=M, State=Disabled, Floating=No
- … +8 more
Props:
- `Dot` (BOOLEAN) — default: `true`
- `← Number` (TEXT) — default: `1`
- `Type` (VARIANT) [Point, Text] — default: `Point`
- `Size` (VARIANT) [L, M, S, XS] — default: `S`
- `State` (VARIANT) [Default, Disabled] — default: `Default`
- `Floating` (VARIANT) [No, Yes] — default: `No`

### Pin · User
Variants (2):
- Type=User
- Type=Navigator
Props:
- `Accuracy` (BOOLEAN) — default: `false`
- `Type` (VARIANT) [User, Navigator] — default: `User`

### _ Pin · Accuracy
Variants (5):
- Size=XS
- Size=S
- Size=M
- Size=L
- Size=XL
Props:
- `Size` (VARIANT) [XS, S, M, L, XL] — default: `XS`

### _ Pin · Accuracy / Animated
Variants (2):
- Progress=0%
- Progress=100%
Props:
- `Progress` (VARIANT) [0%, 100%] — default: `0%`

### _ Slider / Leading
Variants (2):
- Content=-
- Content=Icon
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9503`
- `Content` (VARIANT) [-, Icon] — default: `-`

### _ Slider / Trailing
Variants (3):
- Content=-
- Content=Icon
- Content=Vcoin
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9503`
- `Content` (VARIANT) [-, Icon, Vcoin] — default: `-`

### ProgressBar
Variants (22):
- Value=0%, Text=No
- Value=0%, Text=Yes
- Value=10%, Text=No
- Value=10%, Text=Yes
- Value=20%, Text=No
- Value=20%, Text=Yes
- Value=30%, Text=No
- Value=30%, Text=Yes
- Value=40%, Text=No
- Value=40%, Text=Yes
- Value=50%, Text=No
- Value=50%, Text=Yes
- Value=60%, Text=No
- Value=60%, Text=Yes
- Value=70%, Text=No
- Value=70%, Text=Yes
- Value=80%, Text=No
- Value=80%, Text=Yes
- Value=90%, Text=No
- Value=90%, Text=Yes
- … +2 more
Props:
- `Value` (VARIANT) [0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%] — default: `0%`
- `Text` (VARIANT) [No, Yes] — default: `No`

### Skeleton
Variants (5):
- Animation=0%
- Animation=25%
- Animation=50%
- Animation=75%
- Animation=100%
Props:
- `Animation` (VARIANT) [0%, 25%, 50%, 75%, 100%] — default: `0%`

### _ Slider / Leading
Variants (2):
- Content=-
- Content=Icon
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9503`
- `Content` (VARIANT) [-, Icon] — default: `-`

### _ Slider / Trailing
Variants (2):
- Content=-
- Content=Icon
Props:
- `← Icon` (INSTANCE_SWAP) — default: `2866:9503`
- `Content` (VARIANT) [-, Icon] — default: `-`

### Slider
Variants (11):
- Value=0%
- Value=10%
- Value=20%
- Value=30%
- Value=40%
- Value=50%
- Value=60%
- Value=70%
- Value=80%
- Value=90%
- Value=100%
Props:
- `Value` (VARIANT) [0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%] — default: `0%`

### _Slider
Variants (11):
- Value=100%
- Value=90%
- Value=80%
- Value=70%
- Value=60%
- Value=50%
- Value=40%
- Value=30%
- Value=20%
- Value=10%
- Value=0%
Props:
- `Symbol - Max` (TEXT) — default: `􀓏`
- `Symbol - Min` (TEXT) — default: `􀓑`
- `Show symbols` (BOOLEAN) — default: `true`
- `Show Separator` (BOOLEAN) — default: `true`
- `Value` (VARIANT) [0%, 40%, 10%, 20%, 30%, 70%, 80%, 90%, 100%, 50%, 60%] — default: `0%`

### _Continuous slider
Variants (12):
- State=Enabled, Value=0
- State=Enabled, Value=50
- State=Enabled, Value=100
- State=Hovered, Value=0
- State=Hovered, Value=50
- State=Hovered, Value=100
- State=Pressed, Value=0
- State=Pressed, Value=50
- State=Pressed, Value=100
- State=Disabled, Value=0
- State=Disabled, Value=50
- State=Disabled, Value=100
Props:
- `Show value indicator` (BOOLEAN) — default: `true`
- `State` (VARIANT) [Enabled, Hovered, Pressed, Disabled] — default: `Enabled`
- `Value` (VARIANT) [0, 50, 100] — default: `0`

### _ Timeline / Day
Variants (12):
- View=Ghost, State=Default
- View=Ghost, State=Disabled
- View=Ghost, State=Loading
- View=Surface, State=Default
- View=Secondary, State=Default
- View=Surface, State=Disabled
- View=Secondary, State=Disabled
- View=Surface, State=Loading
- View=Secondary, State=Loading
- View=Ghost, State=Selected
- View=Surface, State=Selected
- View=Secondary, State=Selected
Props:
- `Badge` (BOOLEAN) — default: `false`
- `View` (VARIANT) [Ghost, Surface, Secondary] — default: `Ghost`
- `State` (VARIANT) [Default, Selected, Disabled, Loading] — default: `Default`

### _Home-Indicator
Variants (2):
- Property 1=Home Indicator, Property 2=iPhone, Property 3=Portrait, Property 4=Light
- Property 1=Home Indicator, Property 2=iPhone, Property 3=Portrait, Property 4=Dark
Props:
- `Property 1` (VARIANT) [Home Indicator] — default: `Home Indicator`
- `Property 2` (VARIANT) [iPhone] — default: `iPhone`
- `Property 3` (VARIANT) [Portrait] — default: `Portrait`
- `Property 4` (VARIANT) [Light, Dark] — default: `Light`

### _iOS-Notifications
Variants (1):
- Property 1=Default
Props:
- `Title` (TEXT) — default: `Veelzy`
- `Description` (TEXT) — default: `Your confirmation code is 123456 confir...`
- `Time` (TEXT) — default: `NOW`
- `Icon` (INSTANCE_SWAP) — default: `13:10321`
- `Property 1` (VARIANT) [Default] — default: `Default`

### _Status-Bar
Variants (3):
- Property 1=Status Bar - iPhone, Property 2=Light
- Property 1=Status Bar - iPhone, Property 2=Dark
- Property 1=Status Bar - iPhone, Property 2=Gradient
Props:
- `Property 1` (VARIANT) [Status Bar - iPhone] — default: `Status Bar - iPhone`
- `Property 2` (VARIANT) [Light, Dark, Gradient] — default: `Light`

### _Android-nav-bar
Variants (2):
- Dark-mode=false
- Dark-mode=true
Props:
- `Dark-mode` (VARIANT) [false, true] — default: `false`

### _Android-status-bar
Variants (2):
- Dark-mode=false
- Dark-mode=true
Props:
- `Dark-mode` (VARIANT) [false, true] — default: `false`

### _ActionSheet-action
Variants (6):
- Dark Mode=False, Type=Single Action
- Dark Mode=False, Type=Bottom Action
- Dark Mode=False, Type=Text
- Dark Mode=True, Type=Single Action
- Dark Mode=True, Type=Bottom Action
- Dark Mode=True, Type=Text
Props:
- `✏️ Action` (TEXT) — default: `Action`
- `✏️ Title` (TEXT) — default: `Action Sheet title`
- `✏️ Desc.` (TEXT) — default: `Are you sure you want to delete this?`
- `Title` (BOOLEAN) — default: `true`
- `Dark Mode` (VARIANT) [False, True] — default: `False`
- `Type` (VARIANT) [Single Action, Bottom Action, Text] — default: `Single Action`

### _ ActionSheet
Variants (2):
- Dark Mode=False
- Dark Mode=True
Props:
- `Dark Mode` (VARIANT) [False, True] — default: `False`

### _ Alerts / iOS
Variants (5):
- Property 1=location
- Property 1=Contacts
- Property 1=Notifications
- Property 1=Regular
- Property 1=Photos
Props:
- `Title` (TEXT) — default: `Veelzy`
- `Description` (TEXT) — default: `Your confirmation code is 123456 confir...`
- `Time` (TEXT) — default: `NOW`
- `Icon` (INSTANCE_SWAP) — default: `13:10321`
- `Property 1` (VARIANT) [location, Contacts, Notifications, Regular, Photos] — default: `location`

### Date and Time - Wheels
Variants (2):
- Type=Date
- Type=Time
Props:
- `Type` (VARIANT) [Date, Time] — default: `Time`

### Notification - Collapsed
Variants (3):
- Stack=3
- Stack=2
- Stack=1
Props:
- `Title` (TEXT) — default: `Title`
- `Description` (TEXT) — default: `Description`
- `Icon` (INSTANCE_SWAP) — default: `2906:474`
- `Stack` (VARIANT) [1, 2, 3] — default: `1`

### Slot · Group
Variants (4):
- Layout=Vertical, Reverse=No
- Layout=Horizontal, Reverse=No
- Layout=Vertical, Reverse=Yes
- Layout=Horizontal, Reverse=Yes
Props:
- `Slot · 1` (INSTANCE_SWAP) — default: `2386:2414`
- `Slot · 2` (INSTANCE_SWAP) — default: `2386:2414`
- `Slot · 3` (INSTANCE_SWAP) — default: `2386:2414`
- `Slot · 4` (INSTANCE_SWAP) — default: `2386:2414`
- `Slot · 5` (INSTANCE_SWAP) — default: `2386:2414`
- `Slot · 6` (INSTANCE_SWAP) — default: `2386:2414`
- `Slot · 7` (INSTANCE_SWAP) — default: `2386:2414`
- `Slot · 8` (INSTANCE_SWAP) — default: `2386:2414`
- `Layout` (VARIANT) [Vertical, Horizontal] — default: `Vertical`
- `Reverse` (VARIANT) [No, Yes] — default: `No`

### _ Cover / Contributor · Compact
Variants (2):
- Group=No
- Group=Yes
Props:
- `Group` (VARIANT) [No, Yes] — default: `No`

### _ Cover / Designers
Variants (3):
- Designer=Default
- Designer=sborisov
- Designer=ivan
Props:
- `Designer` (VARIANT) [Default, sborisov, ivan] — default: `Default`

### _ Cover / Contributor
Variants (3):
- Designer=Default
- Designer=sborisov
- Designer=ivan
Props:
- `← Role` (TEXT) — default: `Designer`
- `Designer` (VARIANT) [Default, sborisov, ivan] — default: `Default`

### _ Design system · Status · Figma
Variants (6):
- Status=Design
- Status=Backlog
- Status=Development
- Status=Paused
- Status=Completed
- Status=Deprecated
Props:
- `Status` (VARIANT) [Backlog, Design, Development, Paused, Completed, Deprecated] — default: `Backlog`

### _ Design system · Status · Widgetbook
Variants (6):
- Status=Design
- Status=Backlog
- Status=Development
- Status=Paused
- Status=Completed
- Status=Deprecated
Props:
- `Status` (VARIANT) [Backlog, Design, Development, Paused, Completed, Deprecated] — default: `Backlog`

### Design system · Header
Variants (2):
- Type=Primary
- Type=Secondary
Props:
- `← Title` (TEXT) — default: `Title`
- `Status` (BOOLEAN) — default: `true`
- `Description` (BOOLEAN) — default: `true`
- `Type` (VARIANT) [Primary, Secondary] — default: `Primary`

### _ Comment / Status
Variants (6):
- Status=Done
- Status=Don`t touch
- Status=Working
- Status=Deadline
- Status=Important
- Status=ToDo
Props:
- `Icon` (BOOLEAN) — default: `true`
- `Status` (VARIANT) [Done, Don`t touch, Working, Deadline, Important, ToDo] — default: `Done`

### _Comment / Bubble
Variants (2):
- Corner=Top
- Corner=Bottom
Props:
- `Corner` (VARIANT) [Top, Bottom] — default: `Top`

### _Comment / Bubble / Corners / Bottom
Variants (3):
- Type=Left
- Type=Middle
- Type=Right
Props:
- `Type` (VARIANT) [Left, Middle, Right] — default: `Left`

### _Comment / Bubble / Corners / Top
Variants (3):
- Type=Left
- Type=Middle
- Type=Right
Props:
- `Type` (VARIANT) [Left, Middle, Right] — default: `Left`

### Singleton components

- `Navigation Bar`
- `_ Sidebar`
- `Menu`
- `_ List-Item / Leading`
- `_ List-Item / Trailing`
- `_ List-Item / Swipe actions`
- `Bottom sheet`
- `Pop-up`
- `Pop-up`
- `_ Tooltip / Bubble`
- `_ Tooltip / Leading`
- `_ Tooltip / Tip`
- `_ Tooltip / Trailing`
- `Banner · Group`
- `_Compass / Direction`
- `Logo · Mapbox`
- `Overlay`
- `_ Slider / Knob`
- `Ticks`
- `__Knob`
- `_ Timeline / Days`
- `_ Timeline / Week`
- `Timeline`
- `_ Android · SharingSheet`
- `_ Share Sheet`
- `Slot · Content`
- `Slot · Component`
- `Cover · Preset`
- `_ Cover · Library`
- `_ Cover · Links`
- `_ Cover · Legend`
- `_ Cover · Contacts`
- `_ Component`
- `Comment`
- `_ Comment / Glyph / Complete`
- `_ Comment / Glyph / Incomplete`
- `_ Comment / Glyph / Working`
- `_ Comment / Glyph / Deadline`
- `_ Comment / Glyph / Important`
- `_ Comment / Glyph / ToDo`

## Widgets / Pages

- Cover · Preset (`4:2140`)
- Tokens (`2261:13103`)
- Tokens (`2261:15288`)
- Color - Theme (`2521:4588`)
- Color - Palette (`2521:9063`)
- Dimensions (`2521:11718`)
- Typography (`2521:12154`)
- cvg-color-guide-Tokens (`40000029:74454`)
- cvg-color-guide-Color - Theme (`40000029:77725`)
- cvg-color-guide-Color - Palette (`40000029:82346`)
- App-430x932px (`13:7312`)
- App-360x640px (`13:7334`)
- Frame 1 (`4621:2063`)
- Frame 1 (`40000072:121`)
- Main page (`2898:10879`)
- Token · Market (`4519:15229`)
- Token · Market (`4519:15390`)
- Token · Market (`4519:15551`)
- Token · Market (`4519:15712`)
- Settings · Security & Privacy (`4519:15873`)
- Wallet (`4531:7321`)
- Wallet (`4531:7409`)
- Frame 1 (`3894:866`)
- Action Sheet (`13:10866`)
- Header + Icon (`13:10918`)
- Frame 1 (`4219:2889`)
- Frame 3 (`4219:2892`)
- Frame 2 (`4219:2895`)
- Frame 4 (`4219:2898`)
- Frame 122 (`4254:24800`)
- Feed (`4219:2905`)
- Feed (`4219:2918`)
- Feed (`4254:24813`)
- Frame 5 (`4220:4622`)
- Frame 6 (`4223:7129`)
- Wallet (`4318:10472`)
- Wallet (`4318:10549`)
- Wallet (`4318:10586`)
- Rewards (`4318:10631`)
- Wallet (`4373:10567`)
- Wallet (`4373:10627`)
- Payment form (`4376:6891`)
- Frame 2131330469 (`4382:28814`)
- Frame 2131330470 (`4382:28823`)
- Rewards (`4390:38889`)
- Rewards (`4394:15504`)
- Rewards (`4402:11366`)
- Wallet (`4393:19838`)
- Savings Hub (`4395:12904`)
- Payment form (`4394:14833`)