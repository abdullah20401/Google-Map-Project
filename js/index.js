
// () => can also be function()
window.onload = () => {
}


var map;
var markers = [];
var infoWindow;

function initMap() {
    var darkMapType = new google.maps.StyledMapType([
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#242f3e"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#746855"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#242f3e"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#263c3f"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#6b9a76"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#38414e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#212a37"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9ca5b3"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#746855"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#1f2835"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#f3d19c"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#2f3948"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#17263c"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#515c6d"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#17263c"
            }
            ]        
        },
      ],
      {name: 'Dark Mode'});
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap',
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'Dark Mode']
        }
    });

    map.mapTypes.set('Dark Mode', darkMapType);
    map.setMapTypeId('Dark Mode');

    colorChanger()
    
    
    infoWindow = new google.maps.InfoWindow();
    searchStores()
}

function colorChanger() {
    if (map.mapTypeId == 'Dark Mode') {
        document.getElementById('title').style.color = "white";
    } else {
        document.getElementById('title').style.color = "#333";
    }
}

function searchStores() {
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;

    if (zipCode) {
        for (var store of stores) {
            var postal = store['address']['postalCode'].substring(0, 5);
            if (postal == zipCode) {
                foundStores.push(store);
            }
        }
    } else {
        foundStores = stores;
    }

    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener()
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener() {
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function (elem, index) {
        elem.addEventListener('click', function () {
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}

function displayStores(stores) {
    var storesHtml = '';
    for (var [index, store] of stores.entries()) {
        var address = store['addressLines'];
        var phone = store['phoneNumber'];

        storesHtml += `
            <div class="store-container">
            <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number">${phone}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index + 1}
                        </div>
                    </div>
                </div>
            </div>
        `
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    for (var [index, store] of stores.entries()) {
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        var name = store["name"];
        var address = store["addressLines"][0];
        var openStatusText = store["openStatusText"];
        var phoneNumber = store["phoneNumber"];
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phoneNumber, index + 1);
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, openStatusText, phoneNumber, index) {
  
    var html = `
    <div class="store-info-window">
        <div class="store-info-name">
            ${name}
        </div>
        <div class="store-info-status">
            ${openStatusText}
        </div>
        <div class="store-info-address">
            <div class="circle">
                <i class="fas fa-location-arrow"></i>
            </div>
            <div id="addressLink">
            ${address}
            </div>
            
        </div>
        <div class="store-info-phone">
            <div class="circle">
                <i class="fas fa-phone-alt"></i>
            </div>
            ${phoneNumber}
        </div>
    </div>
    `;

    var image = {
        url: '../image/Starbucks_icon.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(100, 85),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(17, -12),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };
    
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: index.toString(),
      icon: image
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}
