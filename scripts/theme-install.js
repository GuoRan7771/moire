import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themeUrl = process.argv[2];

if (!themeUrl) {
    console.error('Please provide a git repository URL.');
    console.error('Usage: npm run theme:install <git-url>');
    process.exit(1);
}

const targetDir = path.resolve(__dirname, '../src/theme');

console.log(`Installing theme from ${themeUrl}...`);

// 1. Remove existing theme
if (fs.existsSync(targetDir)) {
    console.log('Removing current theme...');
    fs.rmSync(targetDir, { recursive: true, force: true });
}

// 2. Clone new theme
try {
    console.log('Cloning repository...');
    execSync(`git clone ${themeUrl} ${targetDir} --depth 1`, { stdio: 'inherit' });

    // 3. Remove .git folder to avoid submodule/nesting issues
    const gitDir = path.join(targetDir, '.git');
    if (fs.existsSync(gitDir)) {
        console.log('Cleaning up .git directory...');
        fs.rmSync(gitDir, { recursive: true, force: true });
    }

    console.log('Theme installed successfully!');
} catch (error) {
    console.error('Failed to install theme:', error);
    process.exit(1);
}
