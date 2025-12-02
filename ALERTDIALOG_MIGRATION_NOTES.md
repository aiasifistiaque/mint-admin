# AlertDialog to Dialog v3 Migration

## Overview

In Chakra UI v3, `AlertDialog` has been merged into the `Dialog` component. You can create alert dialogs using `Dialog.Root` with `role="alertdialog"`.

## Migration Summary

### Files Migrated

1. **Alert.tsx** - Main alert dialog component for delete confirmations

   - ✅ `AlertDialog` → `Dialog.Root` with `role="alertdialog"`
   - ✅ `AlertDialogOverlay` → `Dialog.Backdrop`
   - ✅ `AlertDialogBody` → `Dialog.Body`
   - ✅ `AlertDialogFooter` → `Dialog.Footer`
   - ✅ `useDisclosure` → `useState` for dialog state management
   - ✅ `isOpen/onClose` → `open/onOpenChange`
   - ✅ `leastDestructiveRef` → `initialFocusEl`
   - ✅ Button props: `isDisabled` → `disabled`, `isLoading` → `loading`

2. **AlertContent.tsx** - Wrapper for alert dialog content

   - ✅ `AlertDialogContent` → `Dialog.Content`

3. **AlertDialogHeader.tsx** - Already migrated
   - ✅ Uses `Dialog.Header`

## Key API Changes

### Component Structure

**Before (v2):**

```tsx
<AlertDialog
	isOpen={isOpen}
	leastDestructiveRef={cancelRef}
	onClose={onClose}>
	<AlertDialogOverlay>
		<AlertDialogContent>
			<AlertDialogHeader>Title</AlertDialogHeader>
			<AlertDialogBody>Content</AlertDialogBody>
			<AlertDialogFooter>
				<Button ref={cancelRef}>Cancel</Button>
				<Button>Confirm</Button>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialogOverlay>
</AlertDialog>
```

**After (v3):**

```tsx
<Dialog.Root
	open={open}
	onOpenChange={details => setOpen(details.open)}
	role='alertdialog'
	initialFocusEl={() => cancelRef.current}>
	<Portal>
		<Dialog.Backdrop />
		<Dialog.Positioner>
			<Dialog.Content>
				<Dialog.Header>Title</Dialog.Header>
				<Dialog.Body>Content</Dialog.Body>
				<Dialog.Footer>
					<Button ref={cancelRef}>Cancel</Button>
					<Button>Confirm</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog.Root>
```

### Prop Changes

| v2 Prop               | v3 Equivalent     | Notes                                       |
| --------------------- | ----------------- | ------------------------------------------- |
| `isOpen`              | `open`            | Boolean to control dialog visibility        |
| `onClose`             | `onOpenChange`    | Callback with `{ open: boolean }` parameter |
| `leastDestructiveRef` | `initialFocusEl`  | Function that returns the element to focus  |
| `useDisclosure()`     | `useState(false)` | State management for open/close             |

### Button Prop Changes

| v2 Prop            | v3 Prop             |
| ------------------ | ------------------- |
| `isDisabled`       | `disabled`          |
| `isLoading`        | `loading`           |
| `spinnerPlacement` | Removed (automatic) |

## Important Notes

1. **Role Attribute**: Use `role="alertdialog"` on `Dialog.Root` to maintain AlertDialog semantics for accessibility

2. **Focus Management**:

   - v2: `leastDestructiveRef={cancelRef}`
   - v3: `initialFocusEl={() => cancelRef.current}`

3. **State Management**:

   ```tsx
   // v2
   const { open: isOpen, onOpen, onClose } = useDisclosure();

   // v3
   const [isOpen, setIsOpen] = useState(false);
   const openItem = () => setIsOpen(true);
   const closeItem = () => setIsOpen(false);
   ```

4. **Portal Required**: Always wrap Dialog content in `<Portal>` for proper z-index stacking

## Other Files Using AlertDialog

The following files also use AlertDialog and need similar migration:

- ❗ `DeleteSection.tsx`
- ❗ `EmptyCartModal.tsx`
- ❗ `AddToCartModal.tsx`
- ❗ `DeleteProductListModal.tsx`
- ❗ `EditFieldModal.tsx`

## Testing Checklist

- [x] Alert.tsx compiles without errors
- [ ] Delete confirmation dialog opens correctly
- [ ] Cancel button properly focused on open
- [ ] Clicking "Discard" closes dialog
- [ ] Delete action triggers correctly
- [ ] Loading state shows on confirm button
- [ ] Dialog closes on successful delete
- [ ] Keyboard ESC closes dialog
- [ ] Backdrop click behavior works

## References

- [Chakra UI v3 Dialog Documentation](https://www.chakra-ui.com/docs/components/dialog)
- [AlertDialog Migration Guide](https://www.chakra-ui.com/docs/migration/migrate-from-v2/dialog)

---

**Status**: ✅ Alert.tsx migrated successfully
**Next**: Migrate remaining AlertDialog components listed above
