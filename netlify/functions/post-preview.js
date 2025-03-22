const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using Netlify environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async function(event, context) {
  const { id } = event.queryStringParameters;  // Get the post ID from the query string

  // Fetch post details using the post ID
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('id, content, user_id, timestamp')
    .eq('id', id)
    .single();

  if (postError || !post) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Post not found' })
    };
  }

  // Fetch the username of the user who made the post
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('username')
    .eq('id', post.user_id)
    .single();

  if (userError || !user) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'User not found' })
    };
  }

  const username = user.username;
  const postContent = post.content;

  // Construct Open Graph and Twitter meta tags with the fetched data
  const metaTags = `
    <meta property="og:title" content="Post by ${username}" />
    <meta property="og:description" content="${postContent}" />
    <meta property="og:image" content="https://yourdomain.netlify.app/Assets/${post.user_id}.png" />
    <meta property="og:url" content="https://effortless-frangipane-fdb9af.netlify.app/post.html?id=${id}" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Post by ${username}" />
    <meta name="twitter:description" content="${postContent}" />
    <meta name="twitter:image" content="https://yourdomain.netlify.app/Assets/${post.user_id}.png" />
  `;

  // Redirect the user to the actual post page
  return {
    statusCode: 302,
    headers: {
      Location: `https://effortless-frangipane-fdb9af.netlify.app/post.html?id=${id}`,
    },
    body: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Post Preview</title>
          ${metaTags}
        </head>
        <body>
          <p>Redirecting to the post...</p>
        </body>
      </html>
    `
  };
};

