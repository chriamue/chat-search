const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");
const fetch = require('node-fetch');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.get("/api/search", async (req, res) => {
  // Get the search query from the request parameters
  const query = req.query.q;

  // Use the OpenAI API to generate a search query
  const completion = await openai.createCompletion({
    prompt: `Generate a search query based on the following: ${query}`,
    model: "text-davinci-002",
  });

  // Extract the generated search query from the response
  const generatedQuery = encodeURIComponent(completion.data.choices[0].text);
  const duckduckgo = `https://api.duckduckgo.com/?q=${generatedQuery}&format=json`;

  // Use the generated search query to search the DuckDuckGo API
  const searchResponse = await fetch(duckduckgo);
  const searchData = await searchResponse.json();

  // Extract the top 3 relevant results from the search data
  const relevantResults = await selectRelevantResults(query, searchData.Results);

  // Send the relevant results back to the client as the response
  res.send({ relevantResults });
});

async function selectRelevantResults(query, results) {
  // Use the OpenAI API to select the most relevant results
  const response = await openai.createCompletion({
    prompt: `answer the query \"${query}\" using following information: ${results}`,
    model: "text-davinci-003",
    max_tokens: 400,
  });
  // Extract the selected results from the response
  const selectedResults = response.data.choices[0].text;

  return selectedResults;
}

const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
