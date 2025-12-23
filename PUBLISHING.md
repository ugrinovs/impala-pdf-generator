# Publishing Guide for impala-pdf-generator

This guide explains how to publish the `@ugrinovs/impala-pdf-generator` package to GitHub Package Registry.

## Prerequisites

1. **GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" (classic)
   - Select the following scopes:
     - `read:packages` - Download packages from GitHub Package Registry
     - `write:packages` - Upload packages to GitHub Package Registry
     - `delete:packages` - Delete packages from GitHub Package Registry (optional)
   - Copy the token (you won't be able to see it again)

2. **NPM Authentication**
   - Create a `.npmrc` file in the project root (or copy `.npmrc.example`)
   - Replace `YOUR_GITHUB_TOKEN` with your actual token:
   
   ```
   @ugrinovs:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

   **Important:** Never commit the `.npmrc` file with your token to git!

## Publishing Steps

### 1. Ensure all changes are committed

```bash
git status
git add .
git commit -m "Prepare for release"
```

### 2. Update version (if needed)

```bash
# For patch version (bug fixes): 1.0.0 -> 1.0.1
npm version patch

# For minor version (new features): 1.0.0 -> 1.1.0
npm version minor

# For major version (breaking changes): 1.0.0 -> 2.0.0
npm version major
```

### 3. Build the package

```bash
npm run build
```

### 4. Test the package locally (optional)

```bash
npm pack --dry-run
```

This shows what files will be included in the package.

### 5. Publish to GitHub Package Registry

```bash
npm publish
```

If successful, you should see output like:
```
npm notice
npm notice 📦  @ugrinovs/impala-pdf-generator@1.0.0
npm notice === Tarball Contents ===
...
npm notice === Tarball Details ===
...
+ @ugrinovs/impala-pdf-generator@1.0.0
```

### 6. Verify the package

- Visit: https://github.com/ugrinovs/impala-pdf-generator/packages
- You should see your published package listed

## Using the Published Package

### Installation

Users need to configure their npm to use GitHub Package Registry for your scope:

1. Create `.npmrc` in their project:
```
@ugrinovs:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=THEIR_GITHUB_TOKEN
```

2. Install the package:
```bash
npm install @ugrinovs/impala-pdf-generator
```

### Usage

```typescript
import { generatePDF, CandidateData } from '@ugrinovs/impala-pdf-generator';

const candidateData: CandidateData = {
  candidate_name: 'John Doe',
  // ... rest of the data
};

const pdfPath = await generatePDF(candidateData);
console.log(`PDF generated at: ${pdfPath}`);
```

## Troubleshooting

### Authentication Failed

If you get `401 Unauthorized` or `403 Forbidden`:
- Verify your GitHub token has the correct scopes
- Make sure the token is correctly set in `.npmrc`
- Check that the package name matches your GitHub username/organization

### Package Not Found

If users get `404 Not Found`:
- Ensure the package is set to public visibility on GitHub
- Verify they have the correct `.npmrc` configuration
- Check they have a valid GitHub token with `read:packages` scope

### Build Fails

If `npm run build` fails:
- Check that all dependencies are installed: `npm install`
- Verify TypeScript version: `npx tsc --version`
- Check for TypeScript errors: `npm run build 2>&1 | less`

## Best Practices

1. **Version Management**
   - Follow semantic versioning (semver)
   - Update CHANGELOG.md with each release
   - Tag releases in git

2. **Testing**
   - Run `npm run build` before publishing
   - Test the build locally with `npm pack`
   - Consider setting up automated tests

3. **Security**
   - Never commit `.npmrc` with tokens
   - Rotate GitHub tokens periodically
   - Use environment variables in CI/CD

4. **Documentation**
   - Keep README.md up to date
   - Document breaking changes
   - Provide migration guides for major versions

## Unpublishing

To remove a version (within 72 hours of publishing):

```bash
npm unpublish @ugrinovs/impala-pdf-generator@1.0.0
```

**Note:** Use with caution as this can break dependent projects.

## CI/CD Publishing

For automated publishing with GitHub Actions:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@ugrinovs'
      
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Support

For issues or questions:
- Open an issue: https://github.com/ugrinovs/impala-pdf-generator/issues
- Check documentation: https://github.com/ugrinovs/impala-pdf-generator#readme
