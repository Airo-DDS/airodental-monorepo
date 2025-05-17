import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

export const metadata: Metadata = {
  title: 'Authentication System | AiroDental Docs',
  description: 'Documentation for the authentication system across the AiroDental ecosystem',
};

export default async function AuthDocPage() {
  // Read the markdown file
  const markdownContent = await fs.readFile(
    path.join(process.cwd(), 'src/app/auth/auth.md'),
    'utf-8'
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <article className="prose prose-invert max-w-none">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </article>
    </div>
  );
} 