import { routing } from '@/i18n/routing'

export default function RootPage() {
  const targetUrl = `/${routing.defaultLocale}/code-canvas/`

  // Static redirect for static export - uses meta refresh as primary method
  // The URL is a constant from config, not user input, so this is safe
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0;url=${targetUrl}`} />
        <link rel="canonical" href={targetUrl} />
      </head>
      <body>
        <noscript>
          <p>
            Redirecting to <a href={targetUrl}>{targetUrl}</a>
          </p>
        </noscript>
      </body>
    </html>
  )
}
