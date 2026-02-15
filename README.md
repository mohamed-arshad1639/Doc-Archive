# DocX - Document Archive Web Application

A modern, mobile-first document management system built with Angular 21 and TailwindCSS. DocX allows users to organize, view, and manage their documents (PDFs and Images) efficiently directly in the browser with local persistence.

## 🚀 Features

- **📂 Smart Organization**: Create nested folders and organize documents with ease.
- **✨ Drag & Drop**: Intuitive drag-and-drop interface for moving files and folders.
- **🔍 Powerful Search**: Real-time filtering and search capabilities.
- **📄 PDF & Image Support**: View and manage PDF documents and images directly within the app.
- **🗑️ Trash Management**: Safely delete items to the trash and restore them if needed.
- **💾 Local Persistence**: All data is stored locally in your browser using IndexedDB (via Dexie.js), ensuring privacy and offline capability.
- **🎨 Modern UI**: Built with TailwindCSS for a sleek, responsive, and mobile-first design.

## 🛠️ Tech Stack

- **Framework**: [Angular 21](https://angular.io/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Database**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **PDF Handling**: [PDF.js](https://mozilla.github.io/pdf.js/)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohamed-arshad1639/Doc-Archive.git
   cd Doc-Archive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm start
```

Navigate to `http://localhost:4201/`. The application will automatically reload if you change any of the source files.

*(Note: The default port is configured to 4201 to avoid conflicts with other common services)*

## 📦 Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## 🧪 Running Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
