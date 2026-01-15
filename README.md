<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 闲鱼文案生成器

View your app in AI Studio: https://ai.studio/apps/drive/1sEZnQC2_NSo2-Dqvmc22F8QuoLmjCpQP

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the app:
   
   **Option A: Using Vercel CLI (Recommended)**
   This ensures the API routes work locally.
   ```bash
   npm i -g vercel
   vercel dev
   ```

   **Option B: Using Vite (UI Only)**
   The UI will load, but API calls will fail because there is no backend running.
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. In the "Environment Variables" section, add:
   - Name: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key`
4. Click **Deploy**.

Vercel will automatically detect the Vite framework and the `api` folder for serverless functions.
