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

// Budget update and save logic
function updateTotals() {
  var totalRevenus = 0;
  document.querySelectorAll('.revenu-input').forEach(input => {
      totalRevenus += parseFloat(input.value) || 0;
  });

  var totalDepenses = 0;
  document.querySelectorAll('.depense-input').forEach(input => {
      totalDepenses += parseFloat(input.value) || 0;
  });

  var argentDisponible = totalRevenus - totalDepenses;

  // Update DOM
  document.getElementById('totalRevenus').textContent = totalRevenus;
  document.getElementById('totalDepenses').textContent = totalDepenses;
  document.getElementById('argentDisponible').textContent = argentDisponible;

  // Save to localStorage
  localStorage.setItem('totalRevenus', totalRevenus);
  localStorage.setItem('totalDepenses', totalDepenses);
  localStorage.setItem('argentDisponible', argentDisponible);

  console.log(`Total Revenus: ${totalRevenus}, Total Dépenses: ${totalDepenses}, Argent Disponible: ${argentDisponible}`);

}

// Load
document.addEventListener('DOMContentLoaded', function() {

  document.querySelectorAll('.revenu-input, .depense-input').forEach(input => {
    // Ensure the input has a unique ID for localStorage key
    if (input.id) {
      var savedValue = localStorage.getItem(input.id);
      console.log(`Loading ${input.id}: ${savedValue}`); // Confirm value being loaded
      if (savedValue !== null) {
        input.value = savedValue;
      }
    }
  });

  updateTotals(); // Recalculate totals with the loaded values
});

// Share button
document.getElementById('shareButton').addEventListener('click', function() {
  let shareText = "Sommaire de budget:\n";
  let totalRevenus = 0;
  let totalDepenses = 0;

  // Calculate Revenus and Dépenses on the fly
  document.querySelectorAll('.revenu-input').forEach(input => {
      const value = parseFloat(input.value) || 0;
      totalRevenus += value;
      if (value !== 0) {
          shareText += `Revenus - ${input.closest('tr').querySelector('td').textContent.trim()}: ${value}\n`;
      }
  });

  document.querySelectorAll('.depense-input').forEach(input => {
      const value = parseFloat(input.value) || 0;
      totalDepenses += value;
      if (value !== 0) {
          shareText += `Dépenses - ${input.closest('tr').querySelector('td').textContent.trim()}: ${value}\n`;
      }
  });

  let argentDisponible = totalRevenus - totalDepenses;

  // Append calculated totals to the shareText
  shareText += `\nTotal Revenus: ${totalRevenus}\n`;
  shareText += `Total Dépenses: ${totalDepenses}\n`;
  shareText += `Argent Disponible: ${argentDisponible}`;

  // Use Web Share API if available
  if (navigator.share) {
      navigator.share({
          title: 'Mon sommaire de budget',
          text: shareText,
      }).then(() => console.log('Content shared successfully'))
      .catch(error => console.log('Error sharing:', error));
  } else {
      console.log('Web Share API not supported.');
  }
});

// Compound interest

function calculateCompoundInterest() {
  var principal = parseFloat(document.getElementById("principal").value);
  var rate = parseFloat(document.getElementById("rate").value) / 100;
  var time = parseInt(document.getElementById("time").value);
  var newContribution = parseFloat(document.getElementById("newContribution").value);
  var frequencyValue = getFrequencyValue(document.getElementById("frequency").value);
  var totalAmount = principal * Math.pow((1 + rate / frequencyValue), time * frequencyValue);
  
  for (var i = 1; i <= time * frequencyValue; i++) {
    totalAmount += newContribution * Math.pow((1 + rate / frequencyValue), i - 1);
  }

  var formattedAmount = formatNumber(totalAmount);
  document.getElementById("resultCI").innerText = 'Montant à l\'échéance: ' + formattedAmount + " $";
}

function getFrequencyValue(frequency) {
  switch (frequency) {
    case "monthly": return 12;
    case "quarterly": return 4;
    case "semiannually": return 2;
    case "annually": return 1;
    default: return 1;
  }
}

function formatNumber(number) {
  return number.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}