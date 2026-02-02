
import type { PageServerLoad } from './$types';
import { marked } from 'marked';

type Memo = {
	slug: string;
  content: string; // Now HTML
	date: Date;
};

export const load: PageServerLoad = async () => {
  // 1. Import all Markdown files
  // query: '?raw' and import: 'default' handles the raw string import correctly in newer Vite
  const memoModules = import.meta.glob('/src/memos/**/*.md', { query: '?raw', import: 'default', eager: true });

  // 2. Import all Image assets (colocated)
  // eager: true ensures they are included in the bundle and we get their final URLs.
  const assetModules = import.meta.glob('/src/memos/**/*.{png,jpg,jpeg,gif,webp}', { eager: true });

  const memos: Memo[] = await Promise.all(
    Object.entries(memoModules).map(async ([path, rawContent]) => {
      const slug = path.split('/').pop()?.replace('.md', '') || 'unknown';

      // Cast rawContent to string because glob import can be unknown
      const markdownString = rawContent as string;

      // Resolve relative paths function
      const resolveAssets = (markdown: string, memoPath: string) => {
        return markdown.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, distinctUrl) => {
          let assetKeyLink = '';

          // Check if it's a raw GitHub URL that maps to our local files
          // Example: https://raw.github.../src/memos/images/file.png
          if (distinctUrl.includes('/src/memos/')) {
            // Extract path starting from /src/memos
            const matchPath = distinctUrl.match(/\/src\/memos\/(.*?)(?:\?|$)/);
            if (matchPath && matchPath[1]) {
              assetKeyLink = `/src/memos/${ matchPath[1] }`;
            }
          }
          // Handle standard relative paths
          else if (!distinctUrl.startsWith('http') && !distinctUrl.startsWith('/')) {
            const memoDir = memoPath.substring(0, memoPath.lastIndexOf('/'));
            let assetPath = `${ memoDir }/${ distinctUrl }`;
            assetPath = assetPath.replace('/./', '/');
            // handling ../ traversal if needed, but path normalization is better
            // Simple normalization for ../
            const parts = assetPath.split('/');
            const stack = [];
            for (const part of parts) {
              if (part === '..') stack.pop();
              else if (part !== '.') stack.push(part);
            }
            assetKeyLink = stack.join('/');
          }

          if (assetKeyLink) {
            // Look up in our assetModules
            const assetModule = assetModules[assetKeyLink] as { default: string } | string;
            const assetUrl = assetModule && typeof assetModule === 'object' ? assetModule.default : assetModule;

            if (assetUrl) {
              return `![${ alt }](${ assetUrl })`;
            }
          }

          // Fallback: return original if key not found (or if it was a real external URL)
          return match;
        });
      };

      const resolvedMarkdown = resolveAssets(markdownString, path);
      const htmlContent = await marked.parse(resolvedMarkdown);

      let date = new Date();
      // Parse date from filename: YYYYMMDDHHMMSS
      const match = slug.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
      if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1; // Months are 0-indexed
        const day = parseInt(match[3]);
        const hour = parseInt(match[4]);
        const minute = parseInt(match[5]);
        const second = parseInt(match[6]);
        date = new Date(year, month, day, hour, minute, second);
      }

      return {
        slug,
        content: htmlContent, // Send HTML to client
        date
      };
    })
  );

  // Sort logic (optional, but good to have) - sorting by filename (date prefix) descending
  memos.sort((a, b) => b.slug.localeCompare(a.slug));

	return {
		memos
	};
};
