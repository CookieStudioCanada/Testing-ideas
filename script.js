// Tabs
function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }
  
    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";
  
    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
  }
  
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();

function closeNavbar() {
    if (window.innerWidth < 992) { // Bootstrap's breakpoint for lg screens
      document.getElementById('navbarNav').classList.remove('show');
    }
  }

// Calculateur CELI
function calculateCELI() {
    var birthYear = document.getElementById("birthYear").value;
    var deposit = parseFloat(document.getElementById("deposit").value) || 0; // Cotisation
    var withdrawal = parseFloat(document.getElementById("withdrawal").value) || 0; // Retrait

    var currentYear = 2024;
    var craLimits = {
        2009: 5000,
        2010: 5000,
        2011: 5000,
        2012: 5000,
        2013: 5500,
        2014: 5500,
        2015: 10000,
        2016: 5500,
        2017: 5500,
        2018: 5500,
        2019: 6000,
        2020: 6000,
        2021: 6000,
        2022: 6000,
        2023: 6500,
        2024: 7000
    };
    
    var firstContributionYear = Math.max(2009, parseInt(birthYear) + 18);
    var cumulativeLimit = 0;
    for (var year = firstContributionYear; year <= currentYear; year++) {
        cumulativeLimit += craLimits[year];
    }

    // Ajustement du plafond en fonction des cotisations et retraits
    cumulativeLimit -= deposit; // Les cotisations diminuent le plafond
    if (withdrawal > 0 && birthYear <= (currentYear - 18)) {
        // Les retraits augmentent le plafond, mais pas pour l'année en cours
        cumulativeLimit += withdrawal;
    }

    var finalBalance = cumulativeLimit;
    var resultMessage = "Solde actuel du plafond de cotisation CELI : " + finalBalance + " $.";
    if (withdrawal > 0) {
        resultMessage += " Important: Les retraits de l'année en cours n'augmenteront le plafond qu'à partir de l'année suivante.";
    }
    document.getElementById("result").innerHTML = resultMessage;
}

window.onload = function() {
    var select = document.getElementById("birthYear");
    for (var year = 2006; year >= 1900; year--) {
        var option = document.createElement("option");
        option.value = year;
        option.text = year;
        select.appendChild(option);
    }
};  