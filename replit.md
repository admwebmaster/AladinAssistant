# Aladin IA Assistant - Loan Quote Management System

## Overview

This is a full-stack web application built for managing loan quotes. The system provides user authentication and quote management functionality through a modern React frontend with a Node.js/Express backend. The application uses external APIs for authentication and data management while maintaining a clean, responsive user interface built with shadcn/ui components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but using external APIs primarily)
- **Authentication**: External API integration (gateway.teamupservice.com)
- **Session Management**: Local storage for client-side token management

### Data Storage
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **In-Memory Storage**: Fallback storage implementation for development
- **External APIs**: Primary data source for authentication and quote management

## Key Components

### Authentication System
- JWT token-based authentication through external API
- Local storage for token persistence
- Protected routes with authentication guards
- Login/Register forms with validation

### Quote Management
- Quote listing and display functionality
- Status tracking (In attesa, etc.)
- Comprehensive quote data model including personal and financial information
- External API integration for quote data retrieval

### UI Components
- Complete shadcn/ui component library implementation
- Responsive design with mobile-first approach
- Toast notifications for user feedback
- Loading states and error handling
- Dark/light theme support via CSS custom properties

### Database Schema
- **Users Table**: Basic user information (nome, cognome, email, password)
- **Quotes Table**: Comprehensive loan quote data including:
  - Personal information (nome, cognome, data_nascita, codice_fiscale)
  - Contact details (indirizzo, numero_telefono, email)
  - Financial information (occupazione, reddito_mensile, importo_richiesto)
  - Loan terms (numero_rate, rata_mensile, finalita)
  - Status tracking and timestamps

## Data Flow

1. **User Authentication**: Users authenticate through external API, tokens stored locally
2. **Quote Data**: Quote information fetched from external APIs
3. **State Management**: React Query manages server state with caching and synchronization
4. **UI Updates**: Real-time updates through query invalidation and refetching
5. **Form Submissions**: Data validated client-side, submitted to external endpoints

## External Dependencies

### Authentication API
- **Endpoint**: https://gateway.teamupservice.com/api/v2/users/login
- **Purpose**: User authentication and session management
- **Integration**: Direct fetch calls from frontend

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **React Hook Form**: Form management and validation

### Development Tools
- **Drizzle Kit**: Database schema management
- **ESBuild**: Production bundling for server
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` 
- **Server**: Express with Vite middleware for HMR
- **Database**: PostgreSQL with connection pooling
- **Port**: 5000 (configured in .replit)

### Production Build
- **Client Build**: Vite builds static assets to `dist/public`
- **Server Build**: ESBuild bundles server code to `dist/index.js`
- **Deployment**: Autoscale deployment target on Replit
- **Database**: Neon serverless PostgreSQL

### Configuration
- **Environment Variables**: DATABASE_URL required for database connection
- **Modules**: Node.js 20, Web, PostgreSQL 16 (Replit configuration)
- **Port Mapping**: Internal 5000 → External 80

## Changelog

Changelog:
- June 20, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.