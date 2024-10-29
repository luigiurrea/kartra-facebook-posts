const fetch = require('node-fetch'); // Required for fetching from external APIs
const { Octokit } = require("@octokit/rest"); // GitHub API client

exports.handler = async function(event, context) {
  // Use environment variables for sensitive data
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const facebookApiUrl = `https://graph.facebook.com/v17.0/257164774896525/posts?access_token=${accessToken}`;
  const githubToken = process.env.GITHUB_ACCESS_TOKEN;
  const repo = 'luigiurrea/kartra-facebook-posts';

  try {
    // 1. Fetch Facebook posts
    const response = await fetch(facebookApiUrl);
    const data = await response.json();

    // 2. Use GitHub's API client to update the JSON file with new posts
    const octokit = new Octokit({ auth: githubToken });
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64'); // Encode content in base64

    // 3. Commit the updated content to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: 'luigiurrea',
      repo: 'kartra-facebook-posts',
      path: 'facebook-posts.json', // File path in GitHub repo
      message: 'Update Facebook posts', // Commit message
      content: content, // Base64 encoded content of updated file
      committer: { name: 'Netlify Bot', email: 'bot@netlify.com' },
      author: { name: 'Netlify Bot', email: 'bot@netlify.com' }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Facebook posts updated!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
