let map;

$(document).ready(function () {
    mapboxgl.accessToken = "pk.eyJ1IjoiaW5kcml5YW50aSIsImEiOiJjbGxpMWYwajQxYmlyM3JyeTRvYm9vYzVsIn0.gltrAcg5VjlHipDjLODCRg";
    map = new mapboxgl.Map({
        container: "map", // container ID
        center: [-122.420679, 37.772537],// starting position [lng, lat]
        zoom: 13, // starting zoom
        style: "mapbox://styles/mapbox/streets-v11", // style URL or style object
        hash: true, // sync `center`, `zoom`, `pitch`, and `bearing` with URL
        // Use `transformRequest` to modify requests that begin with `http://myHost`.
        transformRequest: (url, resourceType) => {
            if (resourceType === "Source" && url.startsWith("http://myHost")) {
                return {
                    url: url.replace("http", "https"),
                    headers: { "my-custom-header": true },
                    credentials: "include", // Include cookies for cross-origin requests
                };
            }
        },
    });
    let nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
    });
    map.addControl(nav, 'bottom-right');


    get_restaurants();

    let coordinates = [
        [-73.935242, 40.730610], // I
        [-73.935242, 37.730610],
        [-73.935242, 34.730610],
        [-73.935242, 31.772537],
        [-73.935242, 28.772537],
        [-73.935242, 25.772537],
        [-73.935242, 22.772537],
        [-73.935242, 19.772537],
        [-73.935242, 16.772537],

        // koordinat Y
        [-60.935242, 40.772537],
        [-58.935242, 38.772537],
        [-56.935242, 36.772537],
        [-54.935242, 34.772537],
        [-52.420679, 32.772537],
        [-40.935242, 40.772537],
        [-43.935242, 38.772537],
        [-46.935242, 36.772537],
        [-49.935242, 34.772537],
        [-52.420679, 30.772537],
        [-52.420679, 27.772537],
        [-52.420679, 24.772537],
        [-52.420679, 21.772537],
        [-52.420679, 18.772537],
        [-52.420679, 15.772537],

    ];

    // Membuat marker dengan koordinat yang membentu
    for (let i = 0; i < coordinates.length; i++) {
        let marker = new mapboxgl.Marker({ color: "#36dbf4" })
            .setLngLat(coordinates[i])
            .addTo(map);
    }
});

function get_restaurants() {
    $('#restaurant-box').empty();
    $.ajax({
        type: 'GET',
        url: '/restaurants',
        data: {},
        success: function (response) {
            if (response.result === 'success') {
                let restaurants = response.restaurants;
                for (let i = 0; i < restaurants.length; i++) {
                    let restaurant = restaurants[i];
                    make_card(i, restaurant);
                    make_marker(restaurant);
                    add_info(i, restaurant);
                }
            } else {
                alert('Something went wrong...')
            }
        }
    });
}

function make_card(i, restaurant) {
    let html_temp = `
    <div class="card" id="card-${i}" onclick="map.flyTo({center: [${restaurant.center}]}); scroll_to_card(${i});">
        <div class="card-body">
            <h5 class="card-title">
                <a href="${restaurant.link}" class="restaurant-title">${restaurant.name}</a>
                </h5>
            <h6 class="card-subtitle mb-2 text-muted">
                ${restaurant.categories}
            </h6>
            <p class="card-text">${restaurant.location}</p>
            <button class="btn btn-danger" onclick="delete_restaurant('${restaurant.name}')">Delete</button>
        </div>
    </div>
        `;
    $('#restaurant-box').append(html_temp);
}

function make_marker(restaurant) {
    new mapboxgl.Marker().setLngLat(restaurant.center).addTo(map);
}

function add_info(i, restaurant) {
    new mapboxgl.Popup({
        offset: {
            bottom: [0, -35],
        },
    }).setLngLat(restaurant.center)
        .setHTML(`
        <div class="iw-inner" onclick="map.flyTo({center: [${restaurant.center}]}); scroll_to_card(${i});">
            <h5>${restaurant.name}</h5>
            <p>${restaurant.location}</p>
        </div>
            `)
        .setMaxWidth('300px')
        .addTo(map);
}

function scroll_to_card(i) {
    let box = $('#restaurant-box');
    box.animate({
        scrollTop: box.get(0).scrollTop +
            $(`#card-${i}`).position().top
    });
}

function delete_restaurant(name) {
    $.ajax({
        type: 'POST',
        url: '/restaurant/delete',
        data: {
            name: name
        },
        success: function (response) {
            if (response.result === 'success') {
                alert(response.msg);
                window.location.reload();
            } else {
                alert('Something went wrong...');
            }
        }
    });
}

function create_restaurant() {
    let name = $('#input-name').val();
    let categories = $('#input-location').val();
    let location = $('#input-location').val();


    let longitude = $('#input-longitude').val();
    let latitude = $('#input-latitude').val();

    longitude = parseFloat(longitude);
    latitude = parseFloat(latitude);

    $.ajax({
        type: 'POST',
        url: '/restaurant/create',
        data: {
            name: name,
            categories: categories,
            location: location,
            longitude: longitude,
            latitude: latitude,
        },
        success: function (response) {
            if (response.result === 'success') {
                alert(response.msg);
                window.location.reload();
            } else {
                alert('Something went wrong...')
            }
        }
    });
}


