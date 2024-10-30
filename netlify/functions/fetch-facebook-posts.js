const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
  // Required for fetching from external APIs
const { Octokit } = require("@octokit/rest");  // GitHub API client

exports.handler = async function(event, context) {
  const accessToken = 'EAAH31k9jTaEBOyZBZB6nQBo4xWrxuYaQPd1DzRpP3lJOm9XkZAhZBPzEaOB2hkJu4O8CbOCSjVQjocDFQQhjCpZAPEVUfVOuoduGUNyC23qXexTAeAYYZBZArktZBRIUwY3BEwZBFZA4dJS3r1Dg9VBHSDBDGpsOMo4Y4nNx8M3Rl8gJaMXP39PZANQU4bxSJo3CNelPZAYZCWxuF60tN3u82JJLcc30OpPLB7Hm4KPCsToPQkgZDZD'; // Replace with your Facebook API access token
  const facebookApiUrl = `https://graph.facebook.com/v17.0/{257164774896525
}/posts?access_token=${accessToken}`;
  const githubToken = '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'; // Replace with a GitHub personal access token
  const repo = 'luigiurrea/kartra'; // Replace with your GitHub username and repository name

  try {
    // 1. Fetch Facebook posts
    const response = await fetch(facebookApiUrl);
    const data = await response.json();

    // 2. Use GitHub's API client to update the JSON file with new posts
    const octokit = new Octokit({ auth: githubToken });
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64'); // Encode content in base64

    // 3. Commit the updated content to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: 'luigiurrea',       // Replace with your GitHub username
      repo: 'kartra',      // Replace with your GitHub repository name
      path: 'posts.json',  // The file path to update in GitHub
      message: 'Update Facebook posts', // Commit message
      content: content, // Base64 encoded content of updated file
      committer: {
        name: 'Netlify Bot',
        email: 'bot@netlify.com'
      },
      author: {
        name: 'Netlify Bot',
        email: 'bot@netlify.com'
      }
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

