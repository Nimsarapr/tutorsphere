TutorSphere
===========

TutorSphere is a web application built with React and TypeScript, designed to provide a modern and responsive user experience.

## Folder Structure

```
├── index.html           # Main HTML file
├── metadata.json        # Project metadata
├── package.json         # Node.js dependencies and scripts
├── README.md            # Project documentation
├── server.ts            # Server entry point
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration
└── src/
    ├── App.tsx          # Main React component
    ├── index.css        # Global styles
    ├── main.tsx         # React app entry point
    ├── types.ts         # TypeScript type definitions
    └── services/
        └── geminiService.ts # Example service module
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)

### Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (default Vite port).

### Build for Production

To build the app for production, run:

```bash
npm run build
```

## Project Structure Overview

- **index.html**: The main HTML file loaded by Vite.
- **server.ts**: Entry point for the backend server (if used).
- **src/**: Contains all frontend source code.
  - **App.tsx**: Main React component.
  - **main.tsx**: Entry point for rendering the React app.
  - **index.css**: Global CSS styles.
  - **types.ts**: Shared TypeScript types.
  - **services/**: Contains service modules for API calls and business logic.

## Contributing

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
