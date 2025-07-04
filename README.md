# Personal Finance Visualizer

A simple web application for tracking personal finances.

## Features (Stage 1 MVP)
- Add, edit, and delete transactions (amount, date, description)
- List view of all transactions
- Monthly expenses bar chart
- Basic form validation
- Responsive design with error states

## Tech Stack
- Next.js (React, TypeScript)
- shadcn/ui, Tailwind CSS
- Recharts (charts)
- MongoDB (Mongoose)
- Zod (validation)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd personal-finance-visualizer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your MongoDB connection string.
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set MONGODB_URI
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
- Deploy easily to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
- Set the `MONGODB_URI` environment variable in your deployment settings.

## License
MIT
