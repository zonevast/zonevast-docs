# Multi-Language Support Guide

ZoneVast platform supports Arabic and English languages using `next-intl`. Language preference is stored in cookies, not URLs.

## Overview

- **Supported Languages**: Arabic (`ar`), English (`en`)
- **Default Language**: English (can be configured per app)
- **Storage**: Cookies (not URLs or localStorage)
- **Library**: `next-intl`

## Language Detection

The platform detects language from cookies in this priority order:

1. `language` cookie - Primary language cookie
2. `NEXT_LOCALE` cookie - Fallback cookie
3. Default locale (app-specific)

### Configuration Example

```typescript
// i18n.ts or i18n.js
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  // Check language cookie first, then NEXT_LOCALE, then default
  const locale = cookieStore.get('language')?.value ||
                 cookieStore.get('NEXT_LOCALE')?.value ||
                 'en';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
```

## Setting Language

### Using Cookies (Server Component)

```typescript
import { cookies } from 'next/headers';

async function setLanguage(locale: 'ar' | 'en') {
  const cookieStore = await cookies();
  cookieStore.set('language', locale, {
    httpOnly: false, // Allow client access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });
}
```

### Using Cookies (Client Component)

```typescript
'use client';

import { useRouter } from 'next/navigation';

function LanguageSwitcher() {
  const router = useRouter();

  const changeLanguage = (locale: 'ar' | 'en') => {
    // Set cookie
    document.cookie = `language=${locale}; path=/; max-age=31536000`;

    // Refresh to apply new language
    router.refresh();
  };

  return (
    <div>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}
```

### Using a Server Action

```typescript
// app/actions.ts
'use server';

import { cookies } from 'next/headers';

export async function setLanguage(locale: string) {
  const cookieStore = await cookies();
  cookieStore.set('language', locale);
}
```

```typescript
'use client';

import { setLanguage } from '@/app/actions';

function LanguageSelector() {
  return (
    <form action={async (formData) => {
      const locale = formData.get('locale');
      await setLanguage(locale as string);
    }}>
      <select name="locale">
        <option value="ar">العربية</option>
        <option value="en">English</option>
      </select>
      <button type="submit">Change Language</button>
    </form>
  );
}
```

## Using Translations

### In Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### In Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

function WelcomeMessage() {
  const t = useTranslations('HomePage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### With Parameters

```json
// messages/en.json
{
  "welcome": "Hello, {name}!",
  "itemsCount": "You have {count} items"
}
```

```typescript
const t = useTranslations('Messages');
const message = t('welcome', { name: 'John' });
// => "Hello, John!"

const count = t('itemsCount', { count: 5 });
// => "You have 5 items"
```

### Nested Keys

```json
// messages/en.json
{
  "common": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel"
    }
  }
}
```

```typescript
const t = useTranslations('common.buttons');
t('save'); // => "Save"
```

## Translation File Structure

Create translation files in `messages/` directory:

```
messages/
├── en.json
└── ar.json
```

### Example Translation Files

**messages/en.json**
```json
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "about": "About"
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "logout": "Logout"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  }
}
```

**messages/ar.json**
```json
{
  "nav": {
    "home": "الرئيسية",
    "products": "المنتجات",
    "about": "حول"
  },
  "auth": {
    "login": "تسجيل الدخول",
    "register": "التسجيل",
    "logout": "تسجيل الخروج"
  },
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف"
  }
}
```

## RTL Support

Arabic uses Right-to-Left (RTL) layout. Configure in your layout:

```typescript
// app/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'ar'];

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## Conditional Content Based on Language

```typescript
import { useLocale } from 'next-intl';

function LanguageSpecificContent() {
  const locale = useLocale();

  return (
    <div>
      {locale === 'ar' ? (
        <p>محتوى خاص باللغة العربية</p>
      ) : (
        <p>English specific content</p>
      )}
    </div>
  );
}
```

## Formatting Dates and Numbers

```typescript
import { useFormatter } from 'next-intl';

function FormattedData() {
  const format = useFormatter();

  return (
    <div>
      {/* Date formatting */}
      <p>{format.dateTime(new Date(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</p>

      {/* Number formatting */}
      <p>{format.number(1234.56, {
        style: 'currency',
        currency: 'SAR'
      })}</p>

      {/* Relative time */}
      <p>{format.relativeTime(new Date(), {
        now: new Date()
      })}</p>
    </div>
  );
}
```

## Changing Language with Dropdown

Complete example component:

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    // Set cookie
    document.cookie = `language=${newLocale}; path=/; max-age=31536000`;

    // Refresh page
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## Best Practices

1. **Use cookies, not URLs**: Language preference is stored in cookies
2. **Keep translations organized**: Use nested keys for related strings
3. **Extract all strings**: Never hardcode text in components
4. **Handle RTL properly**: Arabic requires RTL layout direction
5. **Test both languages**: Always test UI in both Arabic and English
6. **Use parameterized strings**: For dynamic content, use parameters instead of concatenation
7. **Provide context**: Use descriptive key names (e.g., `common.buttons.save` not `save`)

## Checking Current Language

```typescript
// Server Component
import { getLocale } from 'next-intl/server';

export default async function Page() {
  const locale = await getLocale();
  console.log(locale); // 'ar' or 'en'

  return <div>Current language: {locale}</div>;
}

// Client Component
import { useLocale } from 'next-intl';

function Component() {
  const locale = useLocale();
  console.log(locale); // 'ar' or 'en'

  return <div>Current language: {locale}</div>;
}
```

## Common Issues

### Language Not Changing

- Check that cookie is being set correctly
- Ensure `router.refresh()` is called after changing cookie
- Verify cookie name matches configuration (`language` or `NEXT_LOCALE`)

### Translations Not Loading

- Ensure translation files exist in `messages/` directory
- Check file names match locale codes (`en.json`, `ar.json`)
- Verify JSON files are valid

### RTL Issues

- Set `dir="rtl"` on `<html>` element for Arabic
- Test CSS with both LTR and RTL
- Use logical CSS properties (`margin-inline-start` instead of `margin-left`)
