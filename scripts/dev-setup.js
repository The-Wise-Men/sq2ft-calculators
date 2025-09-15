#!/usr/bin/env node

// Development setup script
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 Setting up sq²ft development environment...')

// Create necessary directories
const directories = [
    'dist',
    'public/icons',
    'public/screenshots',
    'tests',
    'src',
    'coverage'
]

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log(`✅ Created directory: ${dir}`)
    }
})

// Create .gitignore if it doesn't exist
const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
coverage/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/`

if (!fs.existsSync('.gitignore')) {
    fs.writeFileSync('.gitignore', gitignoreContent)
    console.log('✅ Created .gitignore')
}

// Create README for development
const devReadmeContent = `# sq²ft Calculators - Development

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server with hot reload
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm test\` - Run tests
- \`npm run test:ui\` - Run tests with UI
- \`npm run test:coverage\` - Run tests with coverage
- \`npm run lint\` - Run ESLint
- \`npm run lint:fix\` - Fix ESLint errors
- \`npm run format\` - Format code with Prettier

## Project Structure

\`\`\`
├── src/                    # Source files
├── public/                 # Static assets
├── tests/                  # Test files
├── dist/                   # Build output
├── .github/workflows/      # CI/CD pipelines
└── scripts/               # Development scripts
\`\`\`

## Development Guidelines

1. **Code Style**: Use ESLint and Prettier for consistent formatting
2. **Testing**: Write tests for all calculator logic
3. **Performance**: Monitor bundle size and loading times
4. **Accessibility**: Ensure all features are accessible
5. **Mobile**: Test on various devices and screen sizes

## PWA Features

- Offline support
- Installable on mobile devices
- Background sync
- Push notifications (future)

## Performance

- Code splitting
- Lazy loading
- Image optimization
- CDN caching
- Service worker caching
\`\`\`

if (!fs.existsSync('DEV-README.md')) {
    fs.writeFileSync('DEV-README.md', devReadmeContent)
    console.log('✅ Created DEV-README.md')
}

console.log('🎉 Development environment setup complete!')
console.log('Run "npm install" to install dependencies')
console.log('Run "npm run dev" to start development server')
