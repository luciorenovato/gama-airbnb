let page = 1;
let cards_page = 4;
let max_page = 0;
var cards = [];
var map, infoWindow;
var markerIcon = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/img/gama2.png`;

var ready = (callback) => {
	if (document.readyState != "loading") callback();
	else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => { 
	/* fetch('https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72') */
	console.log('a');
});

const updateCards = () => {
	removeItems('cards');
	createCards(cards);
}

const createItem = (tag, class_name, parent_id, atributes) => {
	let element = document.createElement(tag);
	if (class_name !== undefined && class_name !== null) element.classList.add(class_name);
	if (atributes !== undefined) {
		for (let [key, value] of Object.entries(atributes)) {
			key == 'textContent' ? element.textContent = value : element.setAttribute(key, value);
		  }
	}
	document.getElementById(`${parent_id}`).appendChild(element);
	return element
}

const createCard = (property) => {
	let { photo, property_type, name, price } = property;
	let id = createId(name);
	let divCard = createItem('div', 'card', 'cards', { id: `card_${id}` });
	createItem('img', 'photo', `card_${id}`, { src: photo });
	createItem('div', null, `card_${id}`, { id: `container_${id}` });
	createItem('div', 'property_type', `container_${id}`, { textContent: property_type });
	createItem('div', 'name', `container_${id}`, { textContent: name });
	createItem('div', 'price', `container_${id}`, { textContent: `R$ ${price}/noite` });
}

const createCards = (data) => {
	data.slice(cards_page * (page - 1), cards_page * (page - 1) + cards_page).forEach(property => {
		createCard(property);
		markMap(property);
	});
}

const removeItems = (id) => {
	document.getElementById(id).textContent = '';
}

// Funcao para criar um id para cada registro
const createId = (s) => {
	var id = 0, i, chr;
	for (i = 0; i < s.length; i++) {
		chr = s.charCodeAt(i);
		id = ((id << 5) - id) + chr;
		id |= 0;
	}
	return id;
}

const updatePage = (new_page) => {
	page = new_page;
	updateCards();
	removeItems('pagination');
	if (page > 1) createItem('a', null, 'pagination', { href: '#', onclick: `updatePage(${page - 1})`, textContent: '<<' });
	for (let i = 1; i <= max_page; i++) {
		createItem('a', i == page ? 'active' : null, 'pagination', { href: '#', onclick: `updatePage(${i})`, textContent: i });
	}
	if (page < max_page) createItem('a', null, 'pagination', { href: '#', onclick: `updatePage(${page+ 1})`, textContent: '>>' });
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
	center: { lat: 40.0232507, lng: 4.1654541 },
	zoom: 2
  });
    
  fetch('db/data.json')
  .then((response) => {
	  response.json().then((data) => {
		  cards = data;
		  max_page = Math.round(cards.length / cards_page);
		  updatePage(page);
	  });
  }).catch(error => {
	  console.log('Fail!');
  });	


  /*
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
	  var pos = {
		lat: position.coords.latitude,
		lng: position.coords.longitude
	  };

	  infoWindow.setPosition(pos);
	  infoWindow.setContent('Location found.');
	  infoWindow.open(map);
	  map.setCenter(pos);
	}, function() {
	  handleLocationError(true, infoWindow, map.getCenter());
	});
  } else {
	// Browser doesn't support Geolocation
	handleLocationError(false, infoWindow, map.getCenter());
  }
  */
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
						'Error: The Geolocation service failed.' :
						'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


const markMap = (property) => {
	console.log(`lat: ${property.lat}, lng: ${property.lng}`);
	var marker = new google.maps.Marker({		
		position: { lat: parseFloat(property.lat), lng: parseFloat(property.lng) },
		map: map,
		animation: google.maps.Animation.DROP,
		icon: markerIcon,
		labelOrigin: new google.maps.Point(9, 9),
		labelClass: "label",
   		labelInBackground: false,
		label: { color: '#060', backgroundCcolor: 'white', border: '1px solid #000', fontSize: '14px', text: `R$ ${property.price}` }
	  });

}

function toggleBounce() {
	if (marker.getAnimation() !== null) {
	  marker.setAnimation(null);
	} else {
	  marker.setAnimation(google.maps.Animation.BOUNCE);
	}
  }


