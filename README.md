# 🎯 tiny-utm-keeper

[![npm version](https://img.shields.io/npm/v/tiny-utm-keeper.svg)](https://www.npmjs.com/package/tiny-utm-keeper)
[![npm downloads](https://img.shields.io/npm/dm/tiny-utm-keeper.svg)](https://www.npmjs.com/package/tiny-utm-keeper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/tiny-utm-keeper)](https://bundlephobia.com/package/tiny-utm-keeper)

<div dir="rtl">

ابزاری سبک، بدون وابستگی و TypeScript-first برای ردیابی و نگه‌داری پارامترهای UTM در جاوااسکریپت.
مناسب برای Next.js و هر فریمورک دیگر با پشتیبانی کامل از SSR.

</div>

---

A zero-dependency, TypeScript-first UTM parameter tracker for first-touch/last-touch attribution. Built for JavaScript/TypeScript apps with full SSR support (Next.js friendly).

## ✨ Features

- 🎯 **Zero Dependencies** - Lightweight and fast
- 📦 **TypeScript-First** - Full type safety out of the box
- 🔄 **First-Touch & Last-Touch** - Flexible attribution modes
- 💾 **Persistent Storage** - Configurable expiration (7/30/90 days)
- 🌐 **SSR-Friendly** - Works seamlessly with Next.js and other SSR frameworks
- 🔗 **Auto-Injection** - Automatically append UTMs to links and fetch requests
- 📊 **Analytics Ready** - Easy integration with analytics and attribution systems
- 🛡️ **Type-Safe** - Full TypeScript support with comprehensive types

## 📦 Installation

```bash
npm install tiny-utm-keeper
```

```bash
yarn add tiny-utm-keeper
```

```bash
pnpm add tiny-utm-keeper
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { init, getUTMs, appendToURL } from 'tiny-utm-keeper';

// Initialize and auto-capture UTMs from current URL
init({
  mode: 'first-touch',    // or 'last-touch'
  expirationDays: 30,     // Store for 30 days
  autoCapture: true       // Automatically capture on init
});

// Get stored UTM parameters
const utms = getUTMs();
console.log(utms);
// { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'summer_sale' }

// Append UTMs to any URL
const ctaLink = appendToURL('https://example.com/signup');
// https://example.com/signup?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale
```

### Next.js Usage

```typescript
// app/providers.tsx or pages/_app.tsx
'use client'; // for Next.js 13+ app directory

import { useEffect } from 'react';
import { init } from 'tiny-utm-keeper';

export function UTMProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize on client-side only
    init({
      mode: 'first-touch',
      expirationDays: 30,
    });
  }, []);

  return <>{children}</>;
}
```

```typescript
// app/layout.tsx or pages/_app.tsx
import { UTMProvider } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <UTMProvider>
          {children}
        </UTMProvider>
      </body>
    </html>
  );
}
```

## 📚 API Reference

### Initialization

#### `init(config?: UTMKeeperConfig): UTMKeeper`

Initialize the default UTMKeeper instance.

```typescript
import { init } from 'tiny-utm-keeper';

const keeper = init({
  mode: 'first-touch',        // Attribution mode
  expirationDays: 30,         // Storage duration
  storageKey: 'utm_keeper',   // localStorage key
  autoCapture: true,          // Auto-capture on init
  captureUrl: undefined       // Custom URL to capture from
});
```

### Core Functions

#### `capture(url?: string): boolean`

Manually capture UTM parameters from URL.

```typescript
import { capture } from 'tiny-utm-keeper';

// Capture from current URL
capture();

// Capture from specific URL
capture('https://example.com?utm_source=facebook&utm_medium=social');
```

#### `getUTMs(): UTMParams | null`

Get stored UTM parameters.

```typescript
import { getUTMs } from 'tiny-utm-keeper';

const utms = getUTMs();
if (utms) {
  console.log(utms.utm_source);  // 'google'
  console.log(utms.utm_medium);  // 'cpc'
  console.log(utms.utm_campaign); // 'summer_sale'
}
```

#### `appendToURL(url: string): string`

Append stored UTMs to a URL.

```typescript
import { appendToURL } from 'tiny-utm-keeper';

const link = appendToURL('https://example.com/pricing');
// https://example.com/pricing?utm_source=google&utm_medium=cpc...
```

#### `getUTMObject(): Record<string, string>`

Get UTMs as a plain object (useful for API calls).

```typescript
import { getUTMObject } from 'tiny-utm-keeper';

const utmData = getUTMObject();

// Use in API calls
fetch('/api/signup', {
  method: 'POST',
  body: JSON.stringify({
    email: 'user@example.com',
    ...utmData  // Inject UTMs
  })
});
```

#### `clear(): boolean`

Clear stored UTM parameters.

```typescript
import { clear } from 'tiny-utm-keeper';

clear(); // Remove stored UTMs
```

### Fetch Integration

#### `createFetch(): typeof fetch`

Create a fetch wrapper that automatically injects UTMs.

```typescript
import { createFetch } from 'tiny-utm-keeper';

const utmFetch = createFetch();

// UTMs automatically added to query string
utmFetch('https://api.example.com/data')
  .then(res => res.json())
  .then(data => console.log(data));

// Skip UTM injection for specific request
utmFetch('https://api.example.com/public', { 
  skipUTM: true 
});
```

### Class API

```typescript
import { UTMKeeper } from 'tiny-utm-keeper';

// Create custom instance
const keeper = new UTMKeeper({
  mode: 'last-touch',
  expirationDays: 7
});

keeper.capture();
keeper.getUTMs();
keeper.appendToURL('https://example.com');
keeper.clear();
keeper.hasStoredUTMs();
keeper.getMode();
keeper.setMode('first-touch');
```

## 🎨 Use Cases

### 1. First-Touch Attribution for Signup

<div dir="rtl">

نگه‌داری منبع اصلی کاربر برای ۳۰ روز و استفاده در فرم ثبت‌نام

</div>

```typescript
import { init, getUTMObject } from 'tiny-utm-keeper';

// Initialize with first-touch mode
init({ mode: 'first-touch', expirationDays: 30 });

// In your signup form
async function handleSignup(email: string, password: string) {
  const utms = getUTMObject();
  
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      ...utms  // Include original attribution data
    })
  });
  
  return response.json();
}
```

### 2. Auto-Append UTMs to CTA Links

<div dir="rtl">

افزودن خودکار UTMهای ذخیره‌شده به لینک‌های کمپین

</div>

```typescript
import { appendToURL } from 'tiny-utm-keeper';

function CTAButton() {
  const href = appendToURL('https://example.com/pricing');
  
  return <a href={href}>Start Free Trial</a>;
}
```

### 3. Fetch Interceptor for Backend Attribution

<div dir="rtl">

تزریق خودکار UTMها به درخواست‌های API

</div>

```typescript
import { createFetch } from 'tiny-utm-keeper';

// Create UTM-enabled fetch
const utmFetch = createFetch();

// Replace global fetch (optional)
if (typeof window !== 'undefined') {
  window.fetch = utmFetch;
}

// All fetch calls now include UTMs automatically
fetch('/api/analytics')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 4. Analytics Integration

```typescript
import { getUTMs, hasStoredUTMs } from 'tiny-utm-keeper';

function trackPageView() {
  if (hasStoredUTMs()) {
    const utms = getUTMs();
    
    // Send to analytics
    analytics.track('Page View', {
      ...utms,
      page: window.location.pathname
    });
  }
}
```

### 5. A/B Testing with Attribution

```typescript
import { getUTMs } from 'tiny-utm-keeper';

function getExperimentVariant() {
  const utms = getUTMs();
  
  // Show different variant based on traffic source
  if (utms?.utm_source === 'google') {
    return 'variant-a';
  }
  
  return 'variant-b';
}
```

## 🔧 Configuration Options

```typescript
interface UTMKeeperConfig {
  /**
   * Attribution mode: 'first-touch' or 'last-touch'
   * @default 'first-touch'
   */
  mode?: 'first-touch' | 'last-touch';
  
  /**
   * Expiration time in days
   * @default 30
   */
  expirationDays?: number;
  
  /**
   * localStorage key prefix
   * @default 'utm_keeper'
   */
  storageKey?: string;
  
  /**
   * Automatically capture UTMs on init
   * @default true
   */
  autoCapture?: boolean;
  
  /**
   * Custom URL to capture UTMs from
   */
  captureUrl?: string;
}
```

## 🌐 SSR Support

The library is fully SSR-safe and will gracefully handle server-side environments:

- All storage operations check for browser environment
- Safe to import and initialize in Next.js app/page components
- No errors or warnings in server-side rendering
- Automatically activates only on client-side

## 📊 Supported UTM Parameters

- `utm_source` - Traffic source (e.g., google, facebook)
- `utm_medium` - Marketing medium (e.g., cpc, email, social)
- `utm_campaign` - Campaign name (e.g., summer_sale)
- `utm_term` - Paid search keywords
- `utm_content` - A/B testing content variation

## 🤝 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type { 
  UTMParams, 
  UTMKeeperConfig, 
  AttributionMode,
  StoredUTMData 
} from 'tiny-utm-keeper';
```

## 📝 License

MIT

## 🙏 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<div dir="rtl" align="center">

ساخته شده با ❤️ برای جامعه توسعه‌دهندگان

Made with ❤️ for the developer community

</div>

