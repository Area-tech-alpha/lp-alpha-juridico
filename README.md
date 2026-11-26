This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Lead

O formulário chama `app/api/lead` (servidor), que repassa o lead para a entrada de leads do CRM:
`POST {CRM_API_URL}/external/lead-intake/food/lp`, com `x-api-key` = `LEAD_INTAKE_FOOD_KEY` do CRM e
`origem: "juridico"` (`LEAD_ORIGIN` em `lib/config.ts`). O CRM aplica a régua do jurídico (por
faturamento; "Sou apenas eu" fica de fora) e o lead entra na Matriz. Nada vai mais ao n8n.

Envs (só servidor, **Sensitive** na Vercel): `CRM_API_URL` e `CRM_LEAD_INTAKE_FOOD_KEY`.
Públicas: `NEXT_PUBLIC_GTM_ID` e `NEXT_PUBLIC_META_PIXEL_ID`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
