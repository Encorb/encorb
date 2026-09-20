# Deployment

This project builds as a static frontend and is ready to publish on Vercel, Netlify, GitHub Pages, or any static host.

## Verified build

```bash
npm install
npm run build
```

The production bundle is emitted to `dist/client`.

## Recommended platforms

### Vercel

1. Import the repository into Vercel.
2. Set the framework to `Vite`.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist/client`.
5. Deploy.

### Netlify

1. Import the repository into Netlify.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist/client`.
4. Deploy.

### Local production preview

```bash
npm run preview -- --host 0.0.0.0 --port 4173
```

This is the same build artifact that should be deployed to production.
