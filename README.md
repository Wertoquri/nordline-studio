# Nordline Studio

Преміальний багатомовний сайт для студії дизайну інтер’єру та ремонту повного циклу в Києві.

**Live:** [nordline-studio-kyiv.vercel.app](https://nordline-studio-kyiv.vercel.app)

## Що отримує бізнес

- чітке позиціонування послуг і цінового сегмента з першого екрана;
- портфоліо з детальними картками проєктів;
- структурований опис процесу, послуг, строків і географії роботи;
- форма кваліфікації лідів із серверною валідацією та захистом від спаму;
- повна українська й англійська локалізація з окремими URL;
- адаптивний інтерфейс для мобільних, планшетів і великих екранів;
- SEO-метадані, sitemap, robots.txt і структуровані дані Local Business;
- підготовлена інтеграція аналітики для CTA, дзвінків, кейсів і форми.

## Основні сценарії

1. Відвідувач розуміє спеціалізацію та формат роботи студії.
2. Переглядає послуги, стартові ціни та реалізовані простори.
3. Вивчає етапи співпраці й відповіді на типові запитання.
4. Надсилає запит із типом об’єкта, площею та зручним контактом.

## Локалізація

| Мова | Головна | Privacy | Thank you |
| --- | --- | --- | --- |
| Українська | `/` | `/privacy` | `/thank-you` |
| English | `/en` | `/en/privacy` | `/en/thank-you` |

Перемикач зберігає поточний тип сторінки. Заголовок документа, description, canonical URL і мова HTML оновлюються відповідно до локалі.

## Технології

- React, TypeScript, Vite
- React Router
- Zod
- Express / Vercel Functions
- Vitest і Testing Library
- Vercel

## Редагування контенту

Тексти, ціни, контакти, послуги, кейси, FAQ та обидві локалі зібрані в одному типізованому файлі:

```text
src/siteConfig.ts
```

Аналітичний провайдер ізольований у `src/lib/analytics.ts`. CRM або поштовий webhook підключається через серверну змінну `LEAD_WEBHOOK_URL`; секрет не потрапляє до браузера.

## Локальний запуск

Потрібен Node.js 20 або новіший.

```bash
npm install
cp .env.example .env
npm run dev
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm run dev
```

Перевірка production-збірки:

```bash
npm test
npm run build
npm run preview
```

## Змінні середовища

| Variable | Scope | Description |
| --- | --- | --- |
| `PORT` | server | Порт локального Express-сервера |
| `CORS_ORIGIN` | server | Дозволений origin фронтенда |
| `LEAD_WEBHOOK_URL` | server | Захищений endpoint CRM або поштового сервісу |
| `VITE_API_URL` | client | URL форми, стандартно `/api/leads` |
| `VITE_ANALYTICS_MODE` | client | Режим аналітичного адаптера |

## Структура

```text
api/                 Vercel Function для лідів
server/              Express API та production fallback
src/components/      Інтерфейсні компоненти
src/lib/             Валідація й аналітика
src/siteConfig.ts    Контент і локалізації
public/              Sitemap та robots.txt
```

## Production checklist

- замінити контакти й соціальні посилання на робочі;
- підключити `LEAD_WEBHOOK_URL`;
- вказати production domain у metadata та sitemap, якщо використовується власний домен;
- перевірити форму, телефонні посилання й аналітику;
- виконати Lighthouse-аудит після підключення домену та фінальних зображень.

## Автор

Frontend development — [Wertoquri](https://github.com/Wertoquri)
