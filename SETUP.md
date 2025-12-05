# Project Setup Guide

## 1. Environment Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recommended)

### Verify Installation
Open your terminal (PowerShell or Command Prompt) and run:
```bash
node -v
npm -v
git --version
```
If any of these commands fail, please ensure you have installed the tools and restarted your terminal.

## 2. Supabase Setup (Backend)

1.  **Create Project**: Go to [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2.  **Get API Keys**:
    *   Go to **Project Settings** (cog icon at the bottom left).
    *   Click on **API**.
    *   You will see `Project URL` and `Project API keys`.
    *   Copy the `Project URL`.
    *   Copy the `anon` `public` key. **Do not use the `service_role` key in your frontend app.**

3.  **Database Password**: Remember the database password you set when creating the project. You will need it for direct database access if required later.

## 3. Vercel Setup (Frontend Hosting)

1.  **Sign Up/Login**: Go to [Vercel](https://vercel.com/) and sign up with your GitHub account.
2.  **Install Vercel CLI** (Optional but useful):
    ```bash
    npm i -g vercel
    ```
3.  **Deploying**:
    *   Push your code to GitHub.
    *   Import the repository in Vercel Dashboard.
    *   Vercel will automatically detect Next.js.
    *   **Environment Variables**: In the Vercel project settings, go to **Environment Variables** and add the Supabase keys you copied earlier.

## 4. Local Configuration

Create a file named `.env.local` in the `frontend` directory (once created) with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

> **WARNING**: Never commit `.env.local` to GitHub. It is already added to `.gitignore`.

## 5. Repository Structure

-   `/frontend`: The Next.js web application.
-   `/supabase`: Database migrations and configuration (if using Supabase CLI).
-   `SETUP.md`: This guide.
