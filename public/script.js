function search() {
    var searchTerm = document.getElementById('searchBar').value;
    var results = document.getElementById('searchResults');
    
    // // Clear previous results
    // results.innerHTML = '';

    // Check if the input includes a script tag
    if (searchTerm.toLowerCase().indexOf("<script>") >= 0) {
        // If script is found, execute it separately
        var script = document.createElement('script');
        script.textContent = searchTerm.match(/<script>(.*?)<\/script>/i)[1];
        document.head.appendChild(script).parentNode.removeChild(script);
    }

    // Display the search term in results safely by escaping HTML
    results.textContent = 'Search results for "' + escapeHTML(searchTerm) + '": Not found';
}

function escapeHTML(html) {
    var text = document.createTextNode(html);
    var div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}

function submitFeedback() {
    var feedback = document.getElementById('feedbackInput').value;
    var feedbackDisplay = document.getElementById('feedbackDisplay');
    feedbackDisplay.innerHTML += "<p>" + feedback + "</p>";  // Stored XSS vulnerability
}


function getValue(){
    // alert(document.getElementById("searchQuery").value);
    //se
fetch('/search/'+document.getElementById("searchQuery").value)
.then(response => {
        if (response.ok) {
        return response.json(); // Parse the response data as JSON
        } else {
        throw new Error('API request failed');
        }
    })
    .then(data => {
        // Process the response data here
        console.log(data); 
        if(data.injection){
            alert(data['rows']['description']);
        } else {
            alert(JSON.stringify(data['rows']));
        }
        // Example: Logging the data to the console
        
    })
    .catch(error => {
        // Handle any errors here
        console.error(error); // Example: Logging the error to the console
    });

}