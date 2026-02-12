// Admin login check
var ADMIN_USER = "admin";
var ADMIN_PASS = "admin123";

window.onload = function() {
  if (sessionStorage.getItem("loggedIn") == "true") {
    showDashboard();
  }
};

// Handle login
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  
  if (username == ADMIN_USER && password == ADMIN_PASS) {
    sessionStorage.setItem("loggedIn", "true");
    showDashboard();
  } else {
    var errorDiv = document.getElementById("loginError");
    errorDiv.textContent = "Wrong username or password!";
    errorDiv.classList.remove("d-none");
  }
});

function showDashboard() {
  document.getElementById("loginContainer").classList.add("d-none");
  document.getElementById("adminDashboard").classList.remove("d-none");
  loadStats();
}

function logout() {
  sessionStorage.removeItem("loggedIn");
  location.reload();
}

// Handle event form
document.getElementById("eventForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  var title = document.getElementById("title").value;
  var date = document.getElementById("date").value;
  var desc = document.getElementById("desc").value;
  var type = document.getElementById("type").value;
  var imageFile = document.getElementById("image").files[0];
  
  var formData = new FormData();
  formData.append("title", title);
  formData.append("date", date);
  formData.append("desc", desc);
  formData.append("type", type);
  if (imageFile) {
    formData.append("image", imageFile);
  }
  
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "php/saveEvent.php", true);
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      document.getElementById("msg").innerHTML = "<div class='alert-success'>" + xhr.responseText + "</div>";
      document.getElementById("eventForm").reset();
      loadStats();
      setTimeout(function() {
        document.getElementById("msg").innerHTML = "";
      }, 3000);
    }
  };
  
  xhr.send(formData);
});

// Load statistics
function loadStats() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "php/getEvents.php", true);
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var events = JSON.parse(xhr.responseText);
      updateStats(events);
      showRecentEvents(events);
    }
  };
  
  xhr.send();
}

function updateStats(events) {
  var upcoming = 0;
  var past = 0;
  
  for (var i = 0; i < events.length; i++) {
    if (events[i].type == "latest") {
      upcoming++;
    } else {
      past++;
    }
  }
  
  document.getElementById("upcomingCount").textContent = upcoming;
  document.getElementById("pastCount").textContent = past;
}

function showRecentEvents(events) {
  var recentDiv = document.getElementById("recentEvents");
  recentDiv.innerHTML = "";
  
  if (events.length == 0) {
    recentDiv.innerHTML = "<p style='text-align:center; color:#999;'>No events yet</p>";
    return;
  }
  
  var recent = events.slice(-5).reverse();
  
  for (var i = 0; i < recent.length; i++) {
    var event = recent[i];
    var badge = event.type == "latest" ? "bg-primary" : "bg-secondary";
    var label = event.type == "latest" ? "Upcoming" : "Past";
    
    recentDiv.innerHTML += 
      "<div class='event-item' style='display:flex; justify-content:space-between; align-items:center;'>" +
        "<div>" +
          "<h6 style='margin:0;'>" + event.title + "</h6>" +
          "<small>" + event.date + " <span class='badge " + badge + "'>" + label + "</span></small>" +
        "</div>" +
        "<button onclick='deleteEvent(\"" + event.id + "\")' style='background:#dc3545; color:white; border:none; padding:5px 12px; cursor:pointer; border-radius:3px; font-size:12px;'>Delete</button>" +
      "</div>";
  }
}

function deleteEvent(eventId) {
  if (!confirm("Are you sure you want to delete this event?")) {
    return;
  }
  
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "php/deleteEvent.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      loadStats();
    }
  };
  
  xhr.send("id=" + encodeURIComponent(eventId));
}

// Auto refresh every 5 seconds
setInterval(loadStats, 5000);
