# Frappe Expo Template

<div align="center">

**A production-ready React Native template with Expo and Frappe integration**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-blue)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-purple)](https://reactnative.dev/)

</div>

---

## ✨ Features

- 🔐 **OAuth 2.0 Authentication** - Secure authentication with Frappe using PKCE flow
- 📱 **Push Notifications** - Native push notifications with `expo-notifications`
- 🔄 **API Integration** - Seamless Frappe API calls with `frappe-react-sdk`
- 🧭 **React Navigation** - Pre-configured navigation with Stack + Bottom Tabs
- 🔒 **Secure Storage** - Token management with `expo-secure-store`
- 📦 **TypeScript** - Full type safety throughout the codebase
- 🔄 **Auto Token Refresh** - Automatic token refresh on app launch

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) (for building)
- A Frappe instance with OAuth 2.0 configured
- Physical device or emulator for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/frappe-expo-template.git
   cd frappe-expo-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   FRAPPE_BASE_URL=https://your-frappe-instance.com
   FRAPPE_CLIENT_ID=your_oauth_client_id
   EXPO_PROJECT_ID=your-expo-project-id
   ```

4. **Start development server**
   ```bash
   npx expo start
   ```

5. **Build for device**
   ```bash
   # iOS
   eas build --platform ios --profile development
   
   # Android
   eas build --platform android --profile development
   ```

## Configuration

### Frappe OAuth Setup

1. **Create OAuth Client in Frappe**
   - Go to: **Settings → OAuth Client**
   - Set **Redirect URIs**: `frappeexpo://auth/callback`
   - Note your **Client ID**

2. **Configure Scopes**
   - `openid` - Required for ID token
   - `all` - Full API access (or specific scopes)

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `FRAPPE_BASE_URL` | Your Frappe instance URL | `https://erp.example.com` |
| `FRAPPE_CLIENT_ID` | OAuth Client ID from Frappe | `abc123xyz` |
| `EXPO_PROJECT_ID` | Your Expo project ID | `your-project-id` |
| `APP_NAME` | Application display name | `My App` |
| `APP_SCHEME` | URL scheme for deep linking | `myapp` |
| `IOS_BUNDLE_ID` | iOS bundle identifier | `com.company.app` |
| `ANDROID_PACKAGE` | Android package name | `com.company.app` |

## Project Structure

```
frappe-expo/
├── src/
│   ├── auth/                 # Authentication logic
│   │   ├── AuthContext.tsx   # Auth state management
│   │   └── useFrappeAuth.ts  # OAuth hook
│   ├── config/               # Centralized configuration
│   │   └── index.ts          # App configuration
│   ├── hooks/                # Custom hooks
│   │   └── usePushNotifications.ts
│   ├── navigation/           # Navigation setup
│   │   ├── index.tsx         # Navigation container
│   │   └── screens/          # App screens
│   ├── providers/            # Context providers
│   │   ├── FrappeNativeProvider.tsx
│   │   └── PushNotificationProvider.tsx
│   └── App.tsx              # Root component
├── assets/                   # Images, fonts, etc.
├── .env.example             # Environment template
├── app.config.js            # Dynamic Expo config
└── package.json
```

## Authentication Flow

1. User taps "Login with Frappe"
2. App opens browser for OAuth authorization
3. User authenticates on Frappe
4. Browser redirects back with authorization code
5. App exchanges code for access + refresh tokens
6. Tokens stored securely with `expo-secure-store`
7. Auto-refresh on app restart

## Push Notifications

The template uses `expo-notifications` for a seamless notification experience:

- **Foreground**: Notifications shown as banners
- **Background**: Native notification tray
- **Interaction**: Handle taps and actions
- **Token Management**: Auto-registration with Expo Push Service

To send notifications, use the Expo Push Token with [Expo Push API](https://docs.expo.dev/push-notifications/sending-notifications/).

## API Integration

Frappe API calls are handled via `frappe-react-sdk`:

```typescript
import { useFrappeGetCall } from 'frappe-react-sdk';

function MyComponent() {
  const { data, error, isLoading } = useFrappeGetCall('method.name');
  // Use your data here
}
```

The `FrappeNativeProvider` automatically injects your access token into all requests.

##  Development

### Available Scripts

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web
```

### Building for Production

```bash
# Configure EAS
eas build:configure

# Build production apps
eas build --platform all --profile production
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Frappe Framework](https://frappeframework.com/) - Backend framework
- [Expo](https://expo.dev/) - React Native toolchain
- [frappe-react-sdk](https://github.com/nikkothari22/frappe-react-sdk) - Frappe React integration

---

<div align="center">

**⭐ If this template helped you, please star the repo! ⭐**

</div>
