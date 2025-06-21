const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// List of known bot User-Agents
const botUserAgents = [
  'twitterbot',
  'discordbot',
  'facebookexternalhit',
  'slackbot',
  'telegrambot',
  'whatsapp',
  'linkedinbot',
];

exports.handler = async function (event) {
  const { id } = event.queryStringParameters || {};
  const userAgent = (event.headers['user-agent'] || '').toLowerCase();
  const isBot = botUserAgents.some(bot => userAgent.includes(bot));

  if (!id) {
    return {
      statusCode: 400,
      body: 'Missing post ID',
    };
  }

  // Fetch the post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('id, content, user_id, timestamp')
    .eq('id', id)
    .single();

  if (postError || !post) {
    return {
      statusCode: 404,
      body: 'Post not found',
    };
  }

  // Fetch the username
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('username')
    .eq('id', post.user_id)
    .single();

  if (userError || !user) {
    return {
      statusCode: 404,
      body: 'User not found',
    };
  }

  const title = `Post by ${user.username}`;
  const description = post.content;
  const imageUrl = `https://yourdomain.netlify.app/Assets/${post.user_id}.png`;
  const postUrl = `https://achorasocial.site/post.html?id=${id}`;

  const metaTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${postUrl}" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
  `;

  if (isBot) {
    // Serve meta tags for bots
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          ${metaTags}
        </head>
        <body>
          <p>Preview for bots.</p>
        </body>
        </html>
      `,
    };
  }

  // Redirect real users to the post page
  return {
    statusCode: 302,
    headers: {
      Location: postUrl,
    },
    body: '',
  };
};

