var page = 1;
const cards_page = 4;
var max_page = 0;
var nights = 0;
var cards = [];
var map, infoWindow;
var markerIcon = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/img/gama2.png`;
var markers = [];

/*
var ready = (callback) => {
	if (document.readyState != "loading") callback();
	else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => { 
});
*/

const updateCards = () => {
	console.log('Updating Cards...');
	removeItems('cards');
	removeMarkers();
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
	if (nights > 0) {
		createItem('div', 'nights', `container_${id}`, { textContent: `Total: R$ ${price * nights} por ${nights} noite${nights > 1 ? 's' : ''}` });
	}
}

const createCards = (data) => {
	data.slice(cards_page * (page - 1), cards_page * (page - 1) + cards_page).forEach(property => {
		createCard(property);
		createMark(property);
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

function initApp() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 40.0232507, lng: 4.1654541 },
		zoom: 2
	});

	let today = new Date();
	let tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	document.getElementById("checkin").defaultValue = today.toLocaleDateString('en-CA');
	document.getElementById("checkout").defaultValue = tomorrow.toLocaleDateString('en-CA');
	calculateNights();

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


const createMark = (property) => {
	let marker = new google.maps.Marker({		
		position: { lat: parseFloat(property.lat), lng: parseFloat(property.lng) },
		map: map,
		animation: google.maps.Animation.DROP,
		icon: markerIcon,		
		labelClass: "label",
   		labelInBackground: false,
		label: { color: '#030', border: '3px', fontSize: '14px', text: `R$ ${property.price}` }
	});
	let infowindow = new google.maps.InfoWindow({
		content: `<h1>${property.name}</h1>`
	});
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});
	markers.push(marker);
	map.setCenter(marker.getPosition());
}

const calculateNights = () => {
	let checkin = new Date(document.getElementById("checkin").value);
	let checkout = new Date(document.getElementById("checkout").value);
	console.log(checkout);
	nights = (checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24);
	if (nights < 1) {		
		checkout.setDate(checkin.getDate() + 1);
		console.log(checkin.getDate());		
		document.getElementById("checkout").value = '';
		document.getElementById("checkout").defaultValue = checkout.toLocaleDateString('en-CA');
		nights = (checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24);
	}
	updateCards();
}

const removeMarkers = () => {
	for (var i = 0; i < markers.length; i++ ) {
		markers[i].setMap(null);
	}
	markers.length = 0;
}

