# Examples

## React Example

```tsx
import { useEffect, useState } from 'react';
import { init, getUTMs, appendToURL, type UTMParams } from 'tiny-utm-keeper';

function App() {
  const [utms, setUtms] = useState<UTMParams | null>(null);

  useEffect(() => {
    // Initialize UTM tracking
    init({
      mode: 'first-touch',
      expirationDays: 30,
    });

    // Get current UTMs
    setUtms(getUTMs());
  }, []);

  return (
    <div>
      <h1>UTM Tracking Demo</h1>
      
      {utms && (
        <div>
          <h2>Current UTM Parameters:</h2>
          <pre>{JSON.stringify(utms, null, 2)}</pre>
        </div>
      )}

      <a href={appendToURL('https://example.com/signup')}>
        Sign Up (with UTMs)
      </a>
    </div>
  );
}

export default App;
```

## Next.js App Router Example

```tsx
// app/providers.tsx
'use client';

import { useEffect } from 'react';
import { init } from 'tiny-utm-keeper';

export function UTMProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    init({
      mode: 'first-touch',
      expirationDays: 30,
    });
  }, []);

  return <>{children}</>;
}

// app/layout.tsx
import { UTMProvider } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UTMProvider>{children}</UTMProvider>
      </body>
    </html>
  );
}

// app/signup/page.tsx
'use client';

import { getUTMObject } from 'tiny-utm-keeper';

export default function SignupPage() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const utms = getUTMObject();

    await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        ...utms,
      }),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## Next.js Pages Router Example

```tsx
// pages/_app.tsx
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { init } from 'tiny-utm-keeper';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    init({
      mode: 'first-touch',
      expirationDays: 30,
    });
  }, []);

  return <Component {...pageProps} />;
}

// pages/pricing.tsx
import { appendToURL, hasStoredUTMs } from 'tiny-utm-keeper';
import { useEffect, useState } from 'react';

export default function PricingPage() {
  const [ctaLink, setCtaLink] = useState('https://example.com/signup');

  useEffect(() => {
    if (hasStoredUTMs()) {
      setCtaLink(appendToURL('https://example.com/signup'));
    }
  }, []);

  return (
    <div>
      <h1>Pricing</h1>
      <a href={ctaLink}>Get Started</a>
    </div>
  );
}
```

## Vanilla JavaScript Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>UTM Tracking Demo</title>
</head>
<body>
  <h1>UTM Tracking Demo</h1>
  <div id="utm-info"></div>
  <a id="cta-link" href="#">Sign Up</a>

  <script type="module">
    import { 
      init, 
      getUTMs, 
      appendToURL 
    } from 'https://unpkg.com/tiny-utm-keeper/dist/index.mjs';

    // Initialize
    init({
      mode: 'first-touch',
      expirationDays: 30,
    });

    // Display UTMs
    const utms = getUTMs();
    if (utms) {
      document.getElementById('utm-info').textContent = 
        JSON.stringify(utms, null, 2);
    }

    // Update CTA link
    const ctaLink = document.getElementById('cta-link');
    ctaLink.href = appendToURL('https://example.com/signup');
  </script>
</body>
</html>
```

## API Integration Example

```typescript
import { getUTMObject, createFetch } from 'tiny-utm-keeper';

// Method 1: Manual injection
async function trackConversion(data: any) {
  const utms = getUTMObject();
  
  await fetch('/api/conversions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      attribution: utms,
    }),
  });
}

// Method 2: Automatic injection via URL
const utmFetch = createFetch();

// UTMs automatically added as query parameters
await utmFetch('/api/analytics');
// GET /api/analytics?utm_source=google&utm_medium=cpc...

// Skip UTM injection for specific requests
await utmFetch('/api/public', { skipUTM: true });
```

## Analytics Integration Example

```typescript
import { getUTMs, hasStoredUTMs } from 'tiny-utm-keeper';

// Google Analytics
function trackWithGA() {
  if (hasStoredUTMs()) {
    const utms = getUTMs();
    gtag('event', 'page_view', {
      ...utms,
      page_path: window.location.pathname,
    });
  }
}

// Mixpanel
function trackWithMixpanel() {
  if (hasStoredUTMs()) {
    const utms = getUTMs();
    mixpanel.track('Page View', utms);
  }
}

// Segment
function trackWithSegment() {
  if (hasStoredUTMs()) {
    const utms = getUTMs();
    analytics.page({
      ...utms,
      path: window.location.pathname,
    });
  }
}
```

## E-commerce Checkout Example

```typescript
import { getUTMObject } from 'tiny-utm-keeper';

async function checkout(cart: any) {
  const utms = getUTMObject();
  
  // Send UTMs with order data
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cart,
      customer: {
        // ... customer data
      },
      attribution: {
        ...utms,
        timestamp: new Date().toISOString(),
      },
    }),
  });

  return response.json();
}
```

## A/B Testing Example

```typescript
import { getUTMs } from 'tiny-utm-keeper';

function getTestVariant(): 'control' | 'variant-a' | 'variant-b' {
  const utms = getUTMs();
  
  // Different variants for different traffic sources
  if (utms?.utm_source === 'google') {
    return 'variant-a';
  }
  
  if (utms?.utm_medium === 'social') {
    return 'variant-b';
  }
  
  return 'control';
}

function LandingPage() {
  const variant = getTestVariant();
  
  return (
    <div>
      {variant === 'variant-a' && <HeroA />}
      {variant === 'variant-b' && <HeroB />}
      {variant === 'control' && <HeroControl />}
    </div>
  );
}
```

## Multi-Instance Example

```typescript
import { UTMKeeper } from 'tiny-utm-keeper';

// Create multiple instances with different configs
const firstTouchKeeper = new UTMKeeper({
  mode: 'first-touch',
  expirationDays: 90,
  storageKey: 'utm_first_touch',
});

const lastTouchKeeper = new UTMKeeper({
  mode: 'last-touch',
  expirationDays: 7,
  storageKey: 'utm_last_touch',
});

// Track both attribution models
firstTouchKeeper.capture();
lastTouchKeeper.capture();

// Use in analytics
const attribution = {
  firstTouch: firstTouchKeeper.getUTMs(),
  lastTouch: lastTouchKeeper.getUTMs(),
};
```

