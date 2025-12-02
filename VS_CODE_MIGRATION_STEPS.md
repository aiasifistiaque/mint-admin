# Chakra UI v3 Migration - VS Code Quick Steps

## ✅ What's Already Done:

1. ✅ Provider configuration fixed (AppProvider.tsx)
2. ✅ Theme migrated to v3 system (theme/index.ts)
3. ✅ Sample files updated (CreateNav.tsx, EditorNav.tsx)

## 🔥 CRITICAL: Do These Steps Now in VS Code

### Step 1: Replace colorPalette with colorPalette (MOST IMPORTANT)

**Press `Cmd + Shift + H` (Mac) or `Ctrl + Shift + H` (Windows)**

```
Find:        colorPalette=
Replace:     colorPalette=
Files:       src/**/*.{ts,tsx}
```

Click **"Replace All"** - This will fix 100+ occurrences

---

### Step 2: Replace Divider with Separator

**Option A - Find & Replace in Imports:**

```
Find:        import (.*), Divider, (.*) from '@chakra-ui/react'
Replace:     import $1, Separator, $2 from '@chakra-ui/react'
Files:       src/**/*.{ts,tsx}
Enable:      ☑ Use Regular Expression
```

**Option B - Simple Replace:**

```
Find:        Divider
Replace:     Separator
Files:       src/**/*.{ts,tsx}
```

Then manually fix imports that have `Divider` → change to `Separator`

---

### Step 3: Fix FormControl → Field (if you have any)

Search for files with FormControl:

```
Find:        FormControl
Files:       src/**/*.{ts,tsx}
```

For each file found, manually update:

- `import { FormControl, FormLabel, FormHelperText, FormErrorMessage }`
  → `import { Field }`
- `<FormControl` → `<Field.Root`
- `<FormLabel` → `<Field.Label`
- `<FormHelperText` → `<Field.HelperText`
- `<FormErrorMessage` → `<Field.ErrorText`
- `</FormControl>` → `</Field.Root>`
- `isInvalid=` → `invalid=`
- `isRequired=` → `required=`

---

### Step 4: Check for Modal Usage (Optional - only if you use Modals)

Search for Modal components:

```
Find:        from '@chakra-ui/react'.*Modal
Files:       src/**/*.{ts,tsx}
```

If you find any, refer to CHAKRA_V3_MIGRATION_GUIDE.md for Dialog migration pattern.

---

### Step 5: Find Other v2 Patterns

Search for these and replace as needed:

**Stack spacing → gap:**

```
Find:        spacing=
Replace:     gap=
Context:     Only in <Stack>, <HStack>, <VStack> components
```

**Boolean Props:**

```
Find:        isActive=
Replace:     data-active=
```

```
Find:        isExternal=
Replace:     external=
Context:     Only in <Link> components
```

---

## 🧪 Testing After Migration

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Check for errors:**

   - Look for TypeScript errors
   - Look for missing imports
   - Look for deprecated prop warnings

3. **Test in browser:**
   - Check all buttons render correctly
   - Test form validation
   - Test modals/dialogs (if any)
   - Toggle dark/light mode
   - Check responsive design

---

## 📊 Migration Progress

- [x] Provider & Theme Configuration
- [ ] colorPalette → colorPalette (100+ files) **← DO THIS NOW**
- [ ] Divider → Separator (15+ files) **← DO THIS NEXT**
- [ ] FormControl → Field (5 files)
- [ ] Modal → Dialog (if applicable)
- [ ] Other prop updates
- [ ] Testing & Validation

---

## 🆘 Common Issues After Migration

### Issue: Colors not showing

**Fix:** Make sure you completed Step 1 (colorPalette → colorPalette)

### Issue: Separator not found

**Fix:** Check imports - should be `Separator` not `Divider`

### Issue: Build errors about Field

**Fix:** Update FormControl to Field pattern (see Step 3)

### Issue: Theme not applying

**Fix:** Check that AppProvider.tsx is using the custom system

---

## 💡 Pro Tips

1. **Use Git:** Commit your work before running find & replace operations
2. **Test incrementally:** After each major find & replace, run `npm run build`
3. **Check git diff:** Review changes to make sure nothing broke
4. **Use VS Code's "Replace All"**: It's safe and fast for simple replacements
5. **Manual review:** For complex components (Forms, Modals), review manually

---

## 📝 Files You Manually Fixed (Examples for Reference)

- ✅ src/components/library/nav/CreateNav.tsx
- ✅ src/components/library/nav/EditorNav.tsx
- ✅ src/components/provider/AppProvider.tsx
- ✅ src/components/ui/provider.tsx
- ✅ src/theme/index.ts

Use these as reference for the migration pattern!
