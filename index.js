// Get the search form element
const searchForm = document.getElementById('search-form');

// Get the query input element
const queryInput = document.getElementById('query');

// Get the results container element
const resultsContainer = document.getElementById('results');

// Handle the search form submit event
async function handleSearch(event) {
  event.preventDefault();

  // Get the search query from the input
  const query = queryInput.value;

  // Make a request to the server to generate a search query and select the relevant results
  const response = await fetch(`/api/search?q=${query}`);
  const data = await response.json();

  // Get the relevant results from the response
  const relevantResults = data.relevantResults;
  console.log(relevantResults);
  // Show the relevant results on the page
  showResults([relevantResults]);
}

searchForm.addEventListener('submit', handleSearch);

// Show the results on the page
function showResults(results) {
  // Clear the results container
  resultsContainer.innerHTML = '';

  // Iterate over the results
  results.forEach(result => {
    // Create a new list item element for the result
    const li = document.createElement('li');
    li.classList.add('list-group-item');

    // Set the text of the list item to the result
    li.textContent = result;

    // Append the list item to the results container
    resultsContainer.appendChild(li);
  });
}
