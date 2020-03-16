'use strict';

const searchUrl = 'https://api.nps.gov/api/v1/parks';
const apiKey = 'FdXlREi490J3oa6UaqKxEpo8OoJhxk3QZ8sztfL8';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
  }


function displayResults(responseJson){
    console.log(responseJson);
    $('#results-list').empty();
    for (let i=0; i<responseJson.data.length; i++) {
        $('#results-list').append(`
        <li><h3>${responseJson.data[i].fullName}</h3>
        <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
        <p>${responseJson.data[i].description}</p>
        <p>${responseJson.data[i].directionsInfo}</p>
        <p> Address:</p> 
        <p>${responseJson.data[i].addresses[0].line1}</p>
        <p>${responseJson.data[i].addresses[0].line2}</p>
        <p>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
        </li>
        `)
    }
}


function getNationalParkInfo(query, limit) {
    const params = {
        api_key: apiKey,
        stateCode: query,
        limit: limit-1
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + queryString;
    console.log(url);

    fetch(url)
        .then(response =>{
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);           
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const limit = $('#js-max-results').val();
        getNationalParkInfo(searchTerm, limit);
    });
}

$(watchForm);