# DocSaaS - Multi-Tenant Document Processing Platform

A complete, production-ready SaaS application for processing documents (PDF, Excel, Word) with features similar to Sejda.com.

## Features

### Document Processing Tools
- **PDF Tools**: Merge, split, compress, edit, sign, protect
- **Excel Tools**: Merge, split, format, clean data, CSV conversion  
- **Word Tools**: Merge, split, find/replace, format conversion
- **Converters**: Bidirectional conversion between PDF, Word, Excel, PPT, JPG, TXT

### Platform Features
- ✅ Multi-tenant architecture with complete tenant isolation
- ✅ User authentication with JWT tokens
- ✅ Email verification system
- ✅ Password reset functionality
- ✅ Role-based access control (User, Admin)
- ✅ Subscription plans (Free, Pro, Enterprise)
- ✅ Usage tracking and rate limiting
- ✅ Asynchronous job processing
- ✅ Modern, responsive UI with drag-and-drop
- ✅ Real-time job status tracking

## Quick Start

```bash
npm install
npm run build
npm start
```

Visit http://localhost:3000

## Demo Account
- Email: demo@example.com
- Password: demo123

## Deployment

To deploy to Vercel with authentication token:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-6b0e653d
```

Then verify at: https://agentic-6b0e653d.vercel.app

## Tech Stack
- Next.js 14, React, TypeScript, Tailwind CSS
- JWT authentication, pdf-lib, exceljs, mammoth, sharp
- Mock database (easily replaceable with Prisma + PostgreSQL)

## License
MIT
