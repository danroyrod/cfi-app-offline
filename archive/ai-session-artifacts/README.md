# CFI Airplane ACS Reference Application

A modern, mobile-friendly web application for the **Flight Instructor for Airplane Category Airman Certification Standards (FAA-S-ACS-25)**.

## Overview

This application provides an intuitive, user-friendly way to navigate and reference the official FAA CFI Airplane ACS document. Built with React and TypeScript, it's designed with future iOS app conversion in mind.

## Features

- **Landing Page**: Clean introduction with document title and FAA document number
- **Areas Index**: Browse all 14 Areas of Operation with task counts
- **Area Details**: View all tasks within a specific area of operation
- **Task Details**: Complete task information including:
  - References
  - Objectives
  - Notes
  - Knowledge requirements
  - Risk Management considerations
  - Skills with highlighted tolerances (e.g., ±5 knots, ±100 feet)

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **CSS3** - Modern, responsive styling

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx      # Home page
│   ├── AreasIndex.tsx        # All areas of operation
│   ├── AreaDetail.tsx        # Tasks within an area
│   └── TaskDetail.tsx        # Full task details
├── types.ts                  # TypeScript interfaces
├── acs_data.json            # Parsed ACS data
├── App.tsx                  # Main app with routing
└── App.css                  # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd cfi-acs-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Design Principles

### Mobile-First
- Responsive design that works on all screen sizes
- Touch-friendly interface
- Optimized for iOS Safari

### User Experience
- Clear navigation hierarchy
- Consistent visual language
- Quick access to any task
- Highlighted tolerances for easy reference

### iOS App Readiness
- Component-based architecture compatible with React Native
- Simple routing structure
- Minimal external dependencies
- Clean separation of data and presentation

## Data Source

The application uses data parsed from the official FAA document:
- **Document**: FAA-S-ACS-25
- **Title**: Flight Instructor for Airplane Category Airman Certification Standards
- **Date**: November 2023

## Future Enhancements

Potential features for future development:
- Search functionality across all tasks
- Bookmarking favorite tasks
- Notes and annotations
- Progress tracking for checkride preparation
- Offline mode
- iOS native app using React Native

## Development Notes

### Converting to iOS App

When ready to convert to iOS:
1. Use React Native with React Navigation
2. Replace `react-router-dom` with `@react-navigation/native`
3. Convert CSS to React Native StyleSheet
4. Store `acs_data.json` locally in the app bundle
5. Add native iOS features (e.g., haptic feedback, share functionality)

### Key Dependencies for iOS Conversion

```bash
# React Native essentials
react-native
@react-navigation/native
@react-navigation/stack

# Additional utilities
react-native-safe-area-context
react-native-screens
```

## License

This is a reference tool based on public FAA documents. The official FAA-S-ACS-25 document is available at [www.faa.gov](https://www.faa.gov).

## Contributing

This is a personal reference tool. Feel free to fork and customize for your own use.

---

**Note**: Always refer to the official FAA publications for authoritative information during flight training and checkrides.
