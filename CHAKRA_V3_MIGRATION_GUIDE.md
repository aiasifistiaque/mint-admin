# Chakra UI v2 to v3 Migration Guide

## Status: IN PROGRESS

### ✅ Completed Tasks

1. **Provider Configuration** - Fixed AppProvider.tsx to use v3 patterns
2. **Theme System** - Migrated from `extendTheme` to `createSystem`
3. **Package Dependencies** - Already on v3 (`@chakra-ui/react@^3.27.1`)

### 🔄 In Progress Tasks

#### Task 1: Replace `colorPalette` with `colorPalette`

**Files Affected:** 100+ files
**Method:** Use VS Code Find & Replace

**Steps:**

1. Open VS Code Command Palette (Cmd/Ctrl + Shift + F)
2. Enable "Use Regular Expression" mode
3. Find: `colorPalette=`
4. Replace: `colorPalette=`
5. Click "Replace All" in files matching: `src/**/*.{ts,tsx}`

**Affected Files (Sample):**

- src/components/library/nav/CreateNav.tsx
- src/components/library/nav/EditorNav.tsx
- src/components/library/components/table/\*_/_.tsx
- src/components/library/components/modals/\*_/_.tsx
- src/app/orders/[id]/\_components/OrderPayments.tsx
- And 90+ more files...

---

#### Task 2: Replace `Divider` with `Separator`

**Files Affected:** ~15 files
**Method:** Find & Replace with import updates

**Steps:**

1. Find: `import.*Divider.*from '@chakra-ui/react'`
2. Replace: Update import to include `Separator` instead of `Divider`
3. Find: `<Divider`
4. Replace: `<Separator`
5. Find: `</Divider>`
6. Replace: `</Separator>`

**Affected Files:**

- src/components/library/nav/CreateNav.tsx
- src/components/library/nav/EditorNav.tsx
- Other navigation components

---

#### Task 3: Migrate `FormControl` to `Field`

**Files Affected:** ~5 files
**Complexity:** HIGH - Requires structural changes

**V2 Pattern:**

```tsx
<FormControl isInvalid={isError}>
	<FormLabel>Email</FormLabel>
	<Input type='email' />
	<FormHelperText>Help text</FormHelperText>
	<FormErrorMessage>Error message</FormErrorMessage>
</FormControl>
```

**V3 Pattern:**

```tsx
<Field.Root invalid={isError}>
	<Field.Label>Email</Field.Label>
	<Input type='email' />
	<Field.HelperText>Help text</Field.HelperText>
	<Field.ErrorText>Error message</Field.ErrorText>
</Field.Root>
```

**Affected Files:**

- src/components/library/utils/inputs/VDataTags.tsx

**Steps:**

1. Update imports: `FormControl` → `Field`
2. Replace `<FormControl` → `<Field.Root`
3. Replace `<FormLabel` → `<Field.Label`
4. Replace `<FormHelperText` → `<Field.HelperText`
5. Replace `<FormErrorMessage` → `<Field.ErrorText`
6. Update props: `isInvalid` → `invalid`, `isRequired` → `required`

---

#### Task 4: Migrate Modal Components to Dialog

**Files Affected:** Multiple modal files
**Complexity:** HIGH - Requires API changes

**V2 Pattern:**

```tsx
<Modal
	isOpen={isOpen}
	onClose={onClose}
	isCentered>
	<ModalOverlay />
	<ModalContent>
		<ModalHeader>Title</ModalHeader>
		<ModalCloseButton />
		<ModalBody>Content</ModalBody>
		<ModalFooter>Footer</ModalFooter>
	</ModalContent>
</Modal>
```

**V3 Pattern:**

```tsx
<Dialog.Root
	open={isOpen}
	onOpenChange={onOpenChange}>
	<Dialog.Backdrop />
	<Dialog.Positioner>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Title</Dialog.Title>
			</Dialog.Header>
			<Dialog.Body>Content</Dialog.Body>
			<Dialog.Footer>Footer</Dialog.Footer>
			<Dialog.CloseTrigger />
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog.Root>
```

**Note:** `useDisclosure` is still compatible, but needs `onOpenChange` callback:

```tsx
const { open: isOpen, onOpen, onClose } = useDisclosure();
const onOpenChange = (details: { open: boolean }) => {
	if (!details.open) onClose();
};
```

---

### 📋 TODO: Additional Changes Needed

1. **Badge Component** - May need `colorPalette` updates
2. **Alert Component** - Restructure to use `Alert.Root`, `Alert.Indicator`, etc.
3. **Collapse → Collapsible** - If used
4. **Stack spacing → gap** - Replace `spacing` prop with `gap`
5. **Boolean props** - `isActive` → `data-active`, `isExternal` → external
6. **Pseudo selectors** - Verify `_hover`, `_focus`, etc. still work
7. **Color mode** - Verify ColorModeProvider is working correctly

---

## Quick Reference: Common Replacements

| V2                  | V3                           |
| ------------------- | ---------------------------- |
| `colorPalette=`     | `colorPalette=`              |
| `<Divider`          | `<Separator`                 |
| `<FormControl`      | `<Field.Root`                |
| `<FormLabel`        | `<Field.Label`               |
| `<FormHelperText`   | `<Field.HelperText`          |
| `<FormErrorMessage` | `<Field.ErrorText`           |
| `<Modal`            | `<Dialog.Root`               |
| `<ModalContent`     | `<Dialog.Content`            |
| `<ModalHeader`      | `<Dialog.Header`             |
| `<ModalBody`        | `<Dialog.Body`               |
| `<ModalFooter`      | `<Dialog.Footer`             |
| `<ModalCloseButton` | `<Dialog.CloseTrigger`       |
| `isInvalid=`        | `invalid=`                   |
| `isRequired=`       | `required=`                  |
| `isOpen=`           | `open=`                      |
| `onClose=`          | `onOpenChange=`              |
| `spacing=`          | `gap=` (in Stack components) |

---

## Testing Checklist

After migration:

- [ ] Run `npm run build` - Check for TypeScript errors
- [ ] Test all forms - Verify validation works
- [ ] Test all modals - Verify open/close functionality
- [ ] Check color themes - Verify `colorPalette` works with brand colors
- [ ] Test dark mode - Verify color mode switching
- [ ] Check responsive design - Verify breakpoints work
- [ ] Test all buttons - Verify styling is preserved
- [ ] Check badges - Verify color schemes work

---

## Notes

- The project is already on Chakra UI v3 (`@chakra-ui/react@^3.27.1`)
- The codebase still uses v2 patterns throughout
- Most changes are straightforward prop renames
- Form and Modal components require more careful migration
- Color palette should maintain the same visual appearance
