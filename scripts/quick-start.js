#!/usr/bin/env node

// Quick start script for sq²ft Calculators
import fs from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 sq²ft Calculators - Quick Start')
console.log('=====================================')

// Check if this is a fresh installation
const isFreshInstall = !fs.existsSync('node_modules')

if (isFreshInstall) {
    console.log('📦 Fresh installation detected')
    console.log('Installing dependencies...')

    try {
        execSync('npm install', { stdio: 'inherit' })
        console.log('✅ Dependencies installed')
    } catch (error) {
        console.error('❌ Failed to install dependencies')
        process.exit(1)
    }
} else {
    console.log('📦 Dependencies already installed')
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
    console.log('⚙️  Creating environment file...')
    try {
        fs.copyFileSync('env.example', '.env')
        console.log('✅ Environment file created (.env)')
        console.log('💡 Edit .env file with your configuration')
    } catch (error) {
        console.log('⚠️  Could not create .env file (env.example not found)')
    }
}

// Run setup script
console.log('🔧 Running setup...')
try {
    execSync('npm run setup', { stdio: 'inherit' })
    console.log('✅ Setup completed')
} catch (error) {
    console.log('⚠️  Setup script failed, continuing...')
}

// Show available commands
console.log('\n🎉 Quick start completed!')
console.log('\nAvailable commands:')
console.log('==================')
console.log('npm run dev          # Start development server')
console.log('npm run build        # Build for production')
console.log('npm run test         # Run tests')
console.log('npm run deploy       # Deploy to production')
console.log('npm run preview      # Preview production build')
console.log('\nDeployment options:')
console.log('==================')
console.log('npm run deploy:github  # Deploy to GitHub Pages')
console.log('npm run deploy:netlify # Deploy to Netlify')
console.log('npm run deploy:vercel  # Deploy to Vercel')
console.log('\nNext steps:')
console.log('===========')
console.log('1. Edit .env file with your configuration')
console.log('2. Run "npm run dev" to start development')
console.log('3. Run "npm run deploy" to deploy to production')
console.log('\nDocumentation:')
console.log('==============')
console.log('- DEPLOYMENT.md - Complete deployment guide')
console.log('- DEV-README.md - Development documentation')
console.log('- README.md - Project overview')
