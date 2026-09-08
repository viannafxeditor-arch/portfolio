# VIANNA Portfolio

React/Vite portfolio and cinematic scene library for https://www.viannafx.media/.

## Deployment

GitHub Pages serves the application. Video, thumbnail and poster files are served from a separate HTTPS media origin without recompressing the originals. The media catalog is about 9.94 GB and cannot be included in the Pages artifact.

1. Upload all files listed in `deploy/media-manifest.json` to the chosen media host, preserving the `media/` prefix.
2. Set the repository Actions variable `MEDIA_ORIGIN` to the actual HTTPS origin, without a path.
3. Keep the custom domain `www.viannafx.media` and Enforce HTTPS. Change the Pages build source to GitHub Actions only when media and repository access are ready.
4. Merge the prepared branch into `main`. The workflow builds, verifies that every media file is available, and deploys the Pages artifact.

`npm run build:pages` requires `VITE_MEDIA_ORIGIN`. The build includes direct access to `/cinematic/` and retains `CNAME`. The site rejects missing or insecure media-host configuration rather than publishing broken video links.

## Local development

Run `npm ci` and `npm run dev`. Restore the `public/media/` folder from the original local project for local media playback. Large originals, build output, environment secrets and dependencies are intentionally excluded from Git.

The old site remains in Git history at commit `83706b56ebfb4f7a05de47a33bd8c77361740737`. No force push or history replacement is needed.

## Cloudflare R2 storage budget

The selected 384 media files total 9,936,935,508 bytes. Use Standard storage. The site keeps 18 scenes in each Fallout game, with Home and process footage intact. `build:pages` rejects a media manifest that reaches 10,000,000,000 bytes. Upload only the manifest entries, preserving their `media/` paths. The local recovery archive is not part of the site. Configure CORS from `deploy/r2-cors.json`. Other account storage and R2 operation quotas are separate.
