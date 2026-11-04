# Android Studio build

This is the Android WebView wrapper for **Just Prince2 Study App**. It loads the public `index.html` as a local, offline app. Restricted course PDFs are **not** included.

Open the `android` folder in Android Studio using JDK 17 and an Android SDK with API 35 installed. Run **Build > Build Bundle(s) / APK(s) > Build APK(s)**. The `syncStudyApp` task copies the repository's root HTML file into Android assets before compilation.

Command-line alternative: `gradle assembleDebug` from this directory if you have Gradle and a configured Android SDK.

The provided public APK in `downloads/` is already signed with a distinct certificate; your own build will use a **different signing key** and cannot update that installed app without first uninstalling it (back up progress first). Never commit private signing keys.

The Android 7+ WebView wrapper is deliberately minimal. The public GitHub edition does not include the private full-screen PDF collection. Browser-based source links open through the phone's default browser.
