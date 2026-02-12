// Load events when page loads
window.onload = function() {
  loadEvents();
  setInterval(loadEvents, 5000); // refresh every 5 seconds
};

function loadEvents() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "php/getEvents.php", true);
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var events = JSON.parse(xhr.responseText);
      showEvents(events);
    }
  };
  
  xhr.send();
}

function showEvents(events) {
  var latestContainer = document.getElementById("latestEvents");
  var oldContainer = document.getElementById("oldEvents");
  
  latestContainer.innerHTML = "";
  oldContainer.innerHTML = "";
  
  var latestCount = 0;
  var oldCount = 0;
  
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    
    var imageSrc = event.image ? event.image : 'https://via.placeholder.com/300x180?text=No+Image';
    
    // Format date
    var dateObj = new Date(event.date);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var formattedDate = months[dateObj.getMonth()] + ' ' + dateObj.getDate() + ', ' + dateObj.getFullYear();
    
    var card = "<div class='event-card'>" +
               "<img src='" + imageSrc + "' alt='" + event.title + "' class='event-image'>" +
               "<div class='event-content'>" +
               "<h3>" + event.title + "</h3>" +
               "<p>" + event.description + "</p>" +
               "<span class='event-date'>" + formattedDate + "</span>" +
               "</div>" +
               "</div>";
    
    if (event.type == "latest") {
      latestContainer.innerHTML += card;
      latestCount++;
    } else {
      oldContainer.innerHTML += card;
      oldCount++;
    }
  }
  
  if (latestCount == 0) {
    latestContainer.innerHTML = "<div class='loading-msg'>No upcoming events</div>";
  }
  
  if (oldCount == 0) {
    oldContainer.innerHTML = "<div class='loading-msg'>No past events</div>";
  }
}
