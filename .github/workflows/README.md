# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Current Workflows

### 🔍 CI - Lint and Test (`ci.yml`)

**Triggers:** Runs automatically on:
- Push to `main`, `master`, or `develop` branches
- All pull requests

**What it does:**
1. ✅ Checks out your code
2. ✅ Sets up Node.js 18
3. ✅ Installs dependencies
4. ✅ Runs ESLint to check code quality
5. ✅ Runs TypeScript type checking
6. ✅ Runs Jest tests with coverage

**Status:** ✅ Active

---

### 🤖 Build Android (`build-android.yml`)

**Triggers:** 
- **Manual:** Click "Run workflow" in GitHub Actions tab
- **Automatic:** Push a version tag (e.g., `git tag v1.0.0 && git push --tags`)

**What it does:**
1. ✅ Sets up Node.js and Java 17
2. ✅ Installs dependencies
3. ✅ Builds Android APK (Debug or Release)
4. ✅ Uploads APK as downloadable artifact
5. ✅ Creates GitHub Release (for version tags)

**Build Types:**
- **Debug:** For testing, uses debug keystore
- **Release:** For production, uses release keystore (requires secrets)

**Status:** ✅ Active

---

## Next Steps

### Step 3: Release Configuration
Set up signing keys and GitHub Secrets for production releases.

---

## How to Use

### Testing the CI Workflow

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Add CI workflow"
   git push origin main
   ```

2. **View workflow results:**
   - Go to your GitHub repository
   - Click on the "Actions" tab
   - You'll see the "CI - Lint and Test" workflow running

3. **Check status:**
   - ✅ Green checkmark = All checks passed
   - ❌ Red X = Something failed (click to see details)

### Creating a Pull Request

When you create a PR, the CI workflow will automatically run and show the status in the PR page.

---

## Available NPM Scripts

These scripts are used by the workflows:

- `npm run lint` - Run ESLint
- `npm run lint:ci` - Run linting with zero warnings allowed
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run Jest tests
- `npm run test:ci` - Run tests with coverage for CI
- `npm run android:build:debug` - Build debug APK locally
- `npm run android:build:release` - Build release APK locally
- `npm run android:clean` - Clean Android build cache

---

## Quick Reference

### Trigger Debug Build
```bash
# Via GitHub Actions UI
Actions → Build Android → Run workflow → Select "debug"

# Or locally
npm run android:build:debug
# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

### Trigger Release Build
```bash
# Via GitHub Actions UI (requires secrets)
Actions → Build Android → Run workflow → Select "release"

# Or create a version tag
git tag v1.0.0
git push origin v1.0.0
```

### Check CI Status
```bash
# Push code and check Actions tab
git add .
git commit -m "Your changes"
git push origin your-branch
# Then go to: GitHub → Actions tab
```

---

## Troubleshooting

### Workflow not running?
- Make sure you've pushed the `.github/workflows/ci.yml` file to GitHub
- Check that your repository has Actions enabled (Settings → Actions)

### Tests failing?
- Run `npm test` locally to see the same errors
- Fix the failing tests and push again

### Linting errors?
- Run `npm run lint` locally
- Fix the errors or run `npm run lint -- --fix` to auto-fix
