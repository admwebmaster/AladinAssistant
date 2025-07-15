# Aladin IA Assistant - React Native Mobile App

## Overview

This is a React Native mobile application built with Expo for managing loan quotes. The app provides user authentication and quote management functionality through a modern mobile interface. The application uses external APIs for authentication and data management while maintaining a clean, responsive user interface designed specifically for mobile devices.

## System Architecture

### Mobile Architecture
- **Framework**: React Native with Expo SDK 53
- **Runtime**: TypeScript with React Native 0.79.5
- **Navigation**: React Navigation 7.x with Native Stack Navigator
- **State Management**: React Context API for authentication state
- **Storage**: AsyncStorage for client-side token and user data persistence
- **HTTP Client**: Axios for API requests with interceptors
- **UI Components**: Native React Native components with custom styling
- **Icons**: Expo Vector Icons (Ionicons)
- **Gradients**: Expo Linear Gradient for visual effects

### Authentication System
- **External API**: JWT token-based authentication via gateway.teamupservice.com
- **Token Storage**: AsyncStorage for persistent token management
- **Context Provider**: React Context for global authentication state
- **Protected Routes**: Navigation-based authentication guards

### Data Management
- **Primary Data Source**: External REST API endpoints
- **Token Management**: Automatic token inclusion in API requests
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Data Persistence**: Local storage for user session data

## Key Components

### Mobile Screens
- **LoginScreen**: User authentication with email/password
- **RegisterScreen**: User registration with nome, cognome, email, password
- **PreventiviScreen**: Quote listing and management interface
- **SpeechScreen**: Voice recognition UI (static implementation)

### Authentication System
- **AuthContext**: React Context for global authentication state
- **JWT Token Management**: AsyncStorage for persistent token storage
- **External API Integration**: gateway.teamupservice.com for auth endpoints
- **Protected Navigation**: Route-based authentication guards

### Quote Management
- **Quote Listing**: FlatList with refresh functionality
- **Status Tracking**: Color-coded badges for quote states
- **Data Display**: Formatted currency, dates, and loan terms
- **Action Buttons**: View and delete options for each quote

### UI Components
- **Native React Native Components**: StyleSheet-based custom styling
- **Linear Gradients**: Purple gradient theme matching design
- **Ionicons**: Vector icons for consistent visual language
- **TouchableOpacity**: Interactive elements with proper feedback
- **Loading States**: ActivityIndicator for async operations

### API Integration
- **Axios Client**: HTTP client with request/response interceptors
- **Automatic Token Handling**: JWT tokens added to all authenticated requests
- **Error Handling**: Comprehensive error management with user alerts
- **Network Timeouts**: 10-second timeout for API requests

## Data Flow

1. **User Registration/Login**: POST requests to external API endpoints
2. **Token Storage**: JWT tokens saved to AsyncStorage for persistence
3. **Authentication State**: React Context manages global auth state
4. **Protected Routes**: Navigation conditionally renders based on auth status
5. **Quote Fetching**: GET requests with Bearer token authorization
6. **Error Handling**: Network errors handled with user-friendly alerts

## External Dependencies

### Authentication API
- **Register**: POST https://gateway.teamupservice.com/api/v2/users/register
- **Login**: POST https://gateway.teamupservice.com/api/v2/users/login
- **Quotes**: GET https://gateway.teamupservice.com/api/v2/preventivi

### Mobile Libraries
- **React Navigation**: Native stack navigation between screens
- **Expo Linear Gradient**: Gradient backgrounds and buttons
- **AsyncStorage**: Persistent storage for tokens and user data
- **Axios**: HTTP client with interceptors for API requests
- **Expo Vector Icons**: Ionicons for consistent iconography

### Development Tools
- **Expo CLI**: Development and build tooling
- **TypeScript**: Type safety for React Native components
- **Babel**: JavaScript transpilation for React Native

## Deployment Strategy

### Development Environment
- **Command**: `npm start` (Expo CLI)
- **Platform**: Expo Go app for testing on mobile devices
- **QR Code**: Scan with Expo Go to load app on device
- **Metro Bundler**: JavaScript bundler for React Native

### Testing
- **Expo Go**: Test app on iOS and Android devices
- **Hot Reload**: Real-time code updates during development
- **Device Testing**: Physical device testing via QR code scanning

### Production Build
- **EAS Build**: Expo Application Services for app store builds
- **Platform Targets**: iOS App Store and Google Play Store
- **Code Signing**: Automatic signing for distribution

## Changelog

Changelog:
- July 15, 2025. Fixed 500 server errors and MIME type issues by cleaning web artifacts
- July 15, 2025. Removed conflicting server/client web files and created pure React Native setup
- July 15, 2025. Tunnel working at exp://jrimnl4-anonymous-8081.exp.direct with cache cleared
- July 14, 2025. Converted from web React app to React Native mobile app with Expo
- July 14, 2025. All screens implemented: LoginScreen, RegisterScreen, PreventiviScreen, SpeechScreen
- July 14, 2025. Authentication system with AsyncStorage for token persistence
- July 14, 2025. App successfully running with Metro bundler and accessible via QR code
- June 20, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.