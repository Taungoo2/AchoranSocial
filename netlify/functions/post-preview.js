const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const postId = event.queryStringParameters.id;

  if (!postId) {
    return {
      statusCode: 400,
      body: 'Post ID missing.',
    };
  }

  const { data, error } = await supabase
    .from('posts')
    .select('content, user_id, timestamp')
    .eq('id', postId)
    .single();

  if (error || !data) {
    return {
      statusCode: 404,
      body: 'Post not found.',
    };
  }

  // Optional: truncate content for description
  const description = data.content.length > 150 ? data.content.substring(0, 150) + '...' : data.content;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta property="og:title" content="Post by User ${data.user_id}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="https://yourdomain.netlify.app/Assets/${data.user_id}.png" />
      <meta property="og:url" content="https://effortless-frangipane-fdb9af.netlify.app/post.html?id=${postId}" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Post by User ${data.user_id}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="https://yourdomain.netlify.app/Assets/${data.user_id}.png" />

      <meta http-equiv="refresh" content="0; URL=https://effortless-frangipane-fdb9af.netlify.app/post.html?id=${postId}" />
      <title>Redirecting to Post...</title>
    </head>
    <body>
      <p>Redirecting to post...</p>
    </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: html,
  };
};
