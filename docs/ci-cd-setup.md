# CI/CD Setup Guide - Android

This guide will walk you through setting up CI/CD for your Android app using GitHub Actions.

## Prerequisites

- ✅ GitHub repository for your project
- ✅ GitHub Actions enabled (free for public repos, included in private repo plans)

## Phase 1: Basic CI (✅ Complete)

The basic CI workflow is already set up and will run automatically on every push and pull request.

**What it does:**
- Runs ESLint to check code quality
- Runs TypeScript type checking
- Runs Jest tests

**No action needed** - this works out of the box!

---

## Phase 2: Android Builds (✅ Complete)

The Android build workflow is set up and ready to use.

### How to Trigger a Debug Build

1. Go to your GitHub repository
2. Click on **Actions** tab
3. Click on **Build Android** workflow
4. Click **Run workflow** button
5. Select **debug** as build type
6. Click **Run workflow**

After a few minutes, you'll see a green checkmark and can download the APK:
- Click on the completed workflow run
- Scroll down to **Artifacts**
- Download `app-debug.zip`
- Extract and install the APK on your Android device

### How to Trigger a Release Build

For production releases, you need to set up signing keys first (see Phase 3 below).

---

## Phase 3: Release Signing Setup

To build production-ready APKs, you need to create a release keystore and add it to GitHub Secrets.

### Step 1: Generate a Release Keystore

Run this command in your project root:

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore release.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**You'll be prompted for:**
- Keystore password (remember this!)
- Key password (remember this!)
- Your name, organization, city, state, country

**IMPORTANT:** 
- ⚠️ Keep this keystore file safe - you'll need it for all future releases
- ⚠️ Never commit this file to Git (it's in `.gitignore`)
- ⚠️ Store it securely (password manager, encrypted backup)

### Step 2: Convert Keystore to Base64

```bash
base64 -i release.keystore -o release.keystore.base64
```

This creates a text file with the base64-encoded keystore.

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add these 4 secrets:

| Secret Name | Value |
|------------|-------|
| `ANDROID_KEYSTORE_BASE64` | Contents of `release.keystore.base64` file |
| `ANDROID_KEYSTORE_PASSWORD` | The keystore password you entered |
| `ANDROID_KEY_ALIAS` | `my-key-alias` (or whatever you used) |
| `ANDROID_KEY_PASSWORD` | The key password you entered |

### Step 4: Test Release Build

1. Go to **Actions** → **Build Android**
2. Click **Run workflow**
3. Select **release** as build type
4. Click **Run workflow**

After completion, download the `app-release.apk` from artifacts.

---

## Phase 4: Automated Releases with Git Tags

Once secrets are set up, you can create releases automatically by pushing version tags.

### Create a Release

```bash
# Tag the current commit
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

This will automatically:
1. ✅ Build a release APK
2. ✅ Create a GitHub Release
3. ✅ Attach the APK to the release

### Download the Release

1. Go to your repository
2. Click **Releases** (right sidebar)
3. Find your version (e.g., v1.0.0)
4. Download the attached APK

---

## How to Use the Workflows

### Manual Builds (On-Demand)

**Use case:** You want to build an APK without creating a release

1. Go to **Actions** tab
2. Select **Build Android**
3. Click **Run workflow**
4. Choose build type (debug/release)
5. Download from Artifacts

### Automatic Builds (Version Tags)

**Use case:** You're ready to release a new version

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow runs automatically and creates a GitHub Release.

### Pull Request Checks

**Use case:** Automatic - runs on every PR

When you create a pull request, the CI workflow automatically:
- Checks code quality
- Runs tests
- Shows pass/fail status in the PR

---

## Troubleshooting

### Build fails with "Keystore not found"

**Solution:** Make sure you've added all 4 GitHub Secrets correctly.

### "Invalid keystore format"

**Solution:** Regenerate the base64 file:
```bash
base64 -i release.keystore -o release.keystore.base64
```

### APK won't install on device

**For debug builds:**
- Make sure "Install from unknown sources" is enabled
- Uninstall any previous version first

**For release builds:**
- The APK is signed with your release key
- Should install normally

### Workflow doesn't appear in Actions tab

**Solution:** 
- Make sure `.github/workflows/` files are pushed to GitHub
- Check that Actions are enabled in Settings → Actions

---

## Next Steps

### Optional Enhancements

1. **Add AAB builds** for Google Play Store
2. **Set up Fastlane** for automated Play Store uploads
3. **Add build notifications** to Slack/Discord
4. **Set up staging environment** with separate signing

### Recommended Workflow

1. **Development:** Work on feature branches
2. **Testing:** Create PR → CI runs automatically
3. **QA:** Merge to `develop` → Manually trigger debug build
4. **Release:** Tag version → Automatic release build

---

## Summary

✅ **CI Workflow** - Automatic linting and testing  
✅ **Android Build Workflow** - Manual and automatic builds  
✅ **Release Signing** - Production-ready APKs  
✅ **GitHub Releases** - Automatic release creation  

You're all set! 🎉
