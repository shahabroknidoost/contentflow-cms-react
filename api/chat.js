// api/chat.js
// Vercel Serverless Function — proxies chat requests to Groq.
// Runs on the server, so GROQ_API_KEY is never exposed to the browser.

export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `You are a helpful assistant embedded in ContentFlow, a content management system (CMS).

The CMS has the following features:
- Posts management: Users can create, edit, preview, and delete blog posts. Posts have a title, content, category (Technology, Business, Lifestyle, or Education), and a status (published or draft).
- Users management: Admin users can create, edit, and delete user accounts. Users have a username, email, password, and role (admin or editor). Only admin users can access the Users tab.
- Navigation: The dashboard has two tabs — Posts and Users (Users tab is admin-only).
- Pagination: Both posts and users are paginated, showing 5 items per page.

You can help users with:
- How to create, edit, or delete posts
- How to manage user accounts (admin only)
- Explaining features and workflows in the CMS
- Writing or improving content for posts
- General writing assistance

Be concise and friendly. If a user asks you to draft content for a post, provide the full draft directly.`;

export default async function handler(request) {
  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY is not configured on the server.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages, context } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'messages must be a non-empty array' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Build contextual system prompt with session info
  const username = context?.username ?? 'user';
  const role = context?.role ?? 'editor';
  const postCount = context?.postCount ?? 0;
  const userCount = context?.userCount ?? 0;

  const systemPrompt =
    SYSTEM_PROMPT +
    `\n\nCurrent session context: The logged-in user is "${username}" with role "${role}". The CMS currently has ${postCount} post(s) and ${userCount} user(s).`;

  // Call Groq with streaming enabled
  const groqResponse = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 1024,
        stream: true,
      }),
    }
  );

  if (!groqResponse.ok) {
    const errText = await groqResponse.text();
    return new Response(
      JSON.stringify({ error: `Groq API error: ${errText}` }),
      { status: groqResponse.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Pipe Groq's SSE stream straight back to the browser
  return new Response(groqResponse.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}