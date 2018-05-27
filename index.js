"use strict";

const YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/search";
const youtubeKey = "AIzaSyDnPT4EujVD-K1SE7JjJGXP19eW8AvAraQ";
const FOOD_URL = "https://api.edamam.com/search";
const foodId = "7fd223ec";
const foodKey = "817ee5945f6f33e30affd1cededc234a";
const RESTAURANT_URL = "https://api.foursquare.com/v2/venues/explore";

//request to foursquare API
function restaurantRequest(searchTerm, city, callback) {
    const query = {
        near: `${city}`,
        query: `${searchTerm}`,
        v: 20180224,
        limit: 8,
        client_id: 'QG4SQH5BFABB4D5YVEMC5PD4IHEU4UJBMAK3FWVERQ4JS1YJ',
        client_secret: 'U3VKEED1ES2N4M54K3RLAYLMQNVVDISGP4C01MUUZWA3E1XX'
    }
    let result = $.ajax({
            /* update API end point */
            url: RESTAURANT_URL,
            data: query,
            dataType: "json",
            /*set the call type GET / POST*/
            type: "GET"
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (result) {
            /* if the results are meeningful, we can just console.log them */
            console.log(result);
            callbackRestaurant(result);
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

}

//what to do with the foursquare data that's sent back
function callbackRestaurant(data) {
    console.log(data);
    const display = data.response.groups["0"].items.map((item, index) => renderRestaurants(item));
    $("#restaurantResults").html(display);
}

//how to show the data from foursquare on the page
function renderRestaurants(item) {
    const restaurantName = item.venue.name;
    const restaurantNumber = item.venue.contact.formattedPhone;
    const restaurantAddress = item.venue.location.address;
    const restaurantUrl = item.venue.url;
    const restaurantRating = item.venue.rating;
    //    const restaurantMessage = item.tips["0"].text;

    return `<div class="hover">
<h3><a href='${restaurantUrl}' class='links'>${restaurantName}</a></h3>
<ul>
<li>Phone: ${restaurantNumber || ""}</li>
<li>Address: ${restaurantAddress || ""}</li>
<li>Rating: ${restaurantRating || ""}</li>


</ul>
</br>
</br>
</br>
</div>`

}




//request to Edamam API
function recipeRequest(searchTerm, callback) {
    const query = {
        q: `${searchTerm}`,
        app_id: `${foodId}`,
        app_key: `${foodKey}`,
        to: 8,
        image: ""
    }

    $.getJSON(FOOD_URL, query, callback)
}

//what to do with the Edamam data that's sent back
function callbackFood(data) {
    console.log(data);
    const display = data.hits.map((item, index) => renderRecipes(item));
    $("#recipeResults").html(display);
};

//how to show Edamam data on the page.
function renderRecipes(item) {
    const label = item.recipe.label;
    const image = item.recipe.image;
    const originalRecipe = item.recipe.url;

    return `<div class="hover">
<a href="${originalRecipe}" class="links"><h3>${label}</h3></a>
<div><img src="${image}" alt="image of recipe dish"></div>

</br>
</br>
</br>
</div>`
}

//request to YouTube API
function youtubeRequest(searchTerm, callback) {
    const query = {
        part: 'snippet',
        key: `${youtubeKey}`,
        q: `The best recipe for ${searchTerm} in: name`
    }
    $.getJSON(YOUTUBE_URL, query, callback)
}


//what to do with the data that is sent back from the YouTube request
function callbackTube(data) {
    console.log(data);
    const display = data.items.map((item, index) => render(item));
    $("#youtubeResults").html(display);

}

//how to show the data on the page
function render(item) {
    let href = "https://www.youtube.com/watch?v=" + item.id.videoId;
    let title = item.snippet.title;
    let image = item.snippet.thumbnails.medium.url;
    return `<div class="youTubeContainer hover">
<h3><a href= ${href} class="links">${title}</a></h3>
<img src=${image} alt=${title}>
<br/>
<br/>
<br/>
</div>`;
}

//making sure the user enters a valid search entry, and calling the three API's and showing the data on the page
function submitHandler() {
    $('form').on('submit', function (event) {
        event.preventDefault();
        let searchTerm = $('#search').val();
        let city = $("#city").val();

        if (searchTerm === "" && city === "") {
            $("#errorFood").html("Oops, enter a food");
            $("#errorCity").html("Oops, enter a city please");
        } else if (city === "") {
            $("#errorCity").html("Oops, enter a city");
        } else if (searchTerm === "") {
            $("#errorFood").html("Oops, enter a food");
        } else {
            $("#errorCity").html("");
            $("#errorFood").html("");
            $("#city").val("");
            $('#search').val("");
            $(".recipesHeader").html("<h2>Recipes</h2>");
            $(".restaurantsHeader").html("<h2>Restaurants</h2>");
            $(".youtubeHeader").html("<h2>YouTube</h2>");
            youtubeRequest(searchTerm, callbackTube);
            recipeRequest(searchTerm, callbackFood);
            restaurantRequest(searchTerm, city, callbackRestaurant);
        }
    });
}



$(submitHandler);
