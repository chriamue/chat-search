async function search(query) {
  // Use the fetch API to send a request to the DuckDuckGo API
  const response = await fetch(
    `https://api.duckduckgo.com/?q=${query}&format=json`
  );

  // Check the status of the response
  if (response.ok) {
    // If the response is successful, parse the JSON data
    const data = await response.json();
    // Extract the search results from the data
    const searchResults = data.Results;
    // Return the search results
    return searchResults;
  } else {
    // If the response is not successful, throw an error
    throw new Error("Failed to search");
  }
}

async function selectRelevantResults(results) {
  // Convert the search results into a string
  const resultsString = results.map((result) => result.Text).join("\n");

  // Use the fetch API to send a request to the OpenAI API
  const response = await fetch("https://api.openai.com/v1/text-davinci-003", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_API_KEY",
    },
    body: JSON.stringify({
      prompt: `Select the three most relevant results from the following list: \n${resultsString}`,
      model: "text-davinci-003",
      max_tokens: 0,
    }),
  });

  // Check the status of the response
  if (response.ok) {
    // If the response is successful, parse the JSON data
    const data = await response.json();
    // Extract the selected results from the data
    const selectedResults = data.choices[0].text.split("\n").slice(1);
    // Return the selected results
    return selectedResults;
  } else {
    // If the response is not successful, throw an error
    throw new Error("Failed to select relevant results");
  }
}

function showResults(results) {
  // Get the results container element
  const resultsContainer = document.getElementById("results");

  // Clear the contents of the container
  resultsContainer.innerHTML = "";

  // Iterate over the results
  for (const result of results) {
    // Create a new list item for the result
    const resultItem = document.createElement("li");
    resultItem.innerText = result;

    // Add the list item to the container
    resultsContainer.appendChild(resultItem);
  }
}

async function handleSearch(event) {
  // Prevent the form from submitting
  event.preventDefault();

  // Get the search query from the form
  const query = document.getElementById("query").value;

  // Use the fetch API to send a request to the OpenAI API to generate a search query
  const response = await fetch("https://api.openai.com/v1/text-davinci-003", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_API_KEY",
    },
    body: JSON.stringify({
      prompt: `Generate a search query based on the following: ${query}`,
      model: "text-davinci-003",
      max_tokens: 0,
    }),
  });

  // Check the status of the response
  if (response.ok) {
    // If the response is successful, parse the JSON data
    const data = await response.json();
    // Extract the generated search query from the data
    const generatedQuery = data.choices[0].text;

    // Send a request to the DuckDuckGo API to search for the generated query
    const searchResults = await search(generatedQuery);

    // Select the three most relevant results from the search results
    const relevantResults = await selectRelevantResults(searchResults);

    // Display the selected relevant results on the page
    showResults(relevantResults);
  } else {
    // If the response is not successful, throw an error
    throw new Error("Failed");
  }
}

// Add an event listener for the search form submission
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', handleSearch);
