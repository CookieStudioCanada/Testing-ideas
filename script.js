// Tabs
function openPage(pageName, elmnt) {
    // Hide all elements with class="tabcontent" by default
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the active class from all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the active class to the button that opened the tab
    elmnt.classList.add("active");

    // Special actions for specific pages
    if (pageName === 'CELI') {
        populateBirthYearOptions();
    }
}

// Open the Home page by default when the page loads
document.addEventListener('DOMContentLoaded', function() {
    var defaultOpenElement = document.getElementById("defaultOpen");
    if (defaultOpenElement) {
        defaultOpenElement.click();
    } else {
        console.warn("Default home page element not found");
    }
});

function closeNavbar() {
    if (window.innerWidth < 992) { // Bootstrap's breakpoint for lg screens
      document.getElementById('navbarNav').classList.remove('show');
    }
  }

// Calculateur CELI
function calculateCELI() {
    var birthYear = parseInt(document.getElementById("birthYear").value);
    var deposit = parseFloat(document.getElementById("deposit").value) || 0;
    var withdrawal = parseFloat(document.getElementById("withdrawal").value) || 0;

    var currentYear = new Date().getFullYear();
    var craLimits = {
        2009: 5000, 2010: 5000, 2011: 5000, 2012: 5000, 2013: 5500,
        2014: 5500, 2015: 10000, 2016: 5500, 2017: 5500, 2018: 5500,
        2019: 6000, 2020: 6000, 2021: 6000, 2022: 6000, 2023: 6500,
        2024: 7000
    };
    
    var firstContributionYear = Math.max(2009, birthYear + 18);
    var cumulativeLimit = 0;
    var yearlyLimits = [];

    for (var year = firstContributionYear; year <= currentYear; year++) {
        if (craLimits[year]) {
            cumulativeLimit += craLimits[year];
            yearlyLimits.push({ year: year, limit: craLimits[year] });
        }
    }

    cumulativeLimit -= deposit;
    if (withdrawal > 0 && birthYear <= (currentYear - 18)) {
        cumulativeLimit += withdrawal;
    }

    var resultHTML = `
        <h4 class="mb-3">Résultat du calcul CELI</h4>
        <h5>Hypothèses :</h5>
        <ul>
            <li>Année de naissance : ${birthYear}</li>
            <li>Cotisations totales : ${formatNumber(deposit)} $</li>
            <li>Retraits totaux : ${formatNumber(withdrawal)} $</li>
        </ul>
        <h5>Droits de cotisation accumulés :</h5>
        <ul>
            <li>Première année d'admissibilité : ${firstContributionYear}</li>
            <li>Droits de cotisation cumulatifs : ${formatNumber(cumulativeLimit)} $</li>
        </ul>
        <h5>Détail des limites annuelles :</h5>
        <ul>
            ${yearlyLimits.map(yl => `<li>${yl.year} : ${formatNumber(yl.limit)} $</li>`).join('')}
        </ul>
        <p class="mt-3"><strong>Solde actuel du plafond de cotisation CELI : ${formatNumber(cumulativeLimit)} $</strong></p>
        ${withdrawal > 0 ? '<p><em>Note : Les retraits de l\'année en cours n\'augmenteront le plafond qu\'à partir de l\'année suivante.</em></p>' : ''}
    `;
    document.getElementById("result").innerHTML = resultHTML;
}

function formatNumber(number) {
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function populateBirthYearOptions() {
    const selectElement = document.getElementById('birthYear');
    if (!selectElement) {
        console.warn("Element with id 'birthYear' not found");
        return;
    }
    const currentYear = new Date().getFullYear();
    const startYear = 1930;

    selectElement.innerHTML = ''; // Clear existing options

    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selectElement.appendChild(option);
    }
    console.log("Birth year options populated");
}

document.addEventListener('DOMContentLoaded', function() {
    populateBirthYearOptions();
    console.log("DOMContentLoaded event fired");
});

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
    var principal = parseFloat(document.getElementById("principal").value) || 0;
    var rate = parseFloat(document.getElementById("rate").value) / 100;
    var time = parseInt(document.getElementById("time").value);
    var newContribution = parseFloat(document.getElementById("newContribution").value) || 0;
    var frequencyValue = getFrequencyValue(document.getElementById("frequency").value);
    var frequencyText = getFrequencyText(document.getElementById("frequency").value);
    
    var totalAmount = principal;
    var totalContributions = 0;
    var yearlyData = [{year: 0, principalAndContributions: principal, interest: 0, total: principal}];

    for (var year = 1; year <= time; year++) {
        var yearlyContribution = newContribution * frequencyValue;
        totalContributions += yearlyContribution;
        var interestEarned = (totalAmount + yearlyContribution) * (Math.pow(1 + rate / frequencyValue, frequencyValue) - 1);
        totalAmount = totalAmount + yearlyContribution + interestEarned;
        
        yearlyData.push({
            year: year,
            principalAndContributions: principal + totalContributions,
            interest: totalAmount - principal - totalContributions,
            total: totalAmount
        });
    }

    var interestEarned = totalAmount - principal - totalContributions;

    var resultHTML = `
        <h4 class="mb-3">Résultats de votre investissement</h4>
        <h5>Hypothèses :</h5>
        <ul>
            <li>Capital initial : ${formatNumber(principal)} $</li>
            <li>Contributions : ${formatNumber(newContribution)} $ par période ${frequencyText.toLowerCase()}</li>
            <li>Taux de rendement annuel : ${(rate * 100).toFixed(2)}%</li>
            <li>Durée de l'investissement : ${time} ans</li>
        </ul>
        <h5>Résultats :</h5>
        <ul>
            <li>Montant total à l'échéance : ${formatNumber(totalAmount)} $</li>
            <li>Total des contributions : ${formatNumber(totalContributions)} $</li>
            <li>Intérêts gagnés : ${formatNumber(interestEarned)} $</li>
        </ul>
    `;

    document.getElementById("resultCI").innerHTML = resultHTML;

    // Create chart
    createCompoundInterestChart(yearlyData);
}

function createCompoundInterestChart(data) {
    var ctx = document.getElementById('compoundInterestChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.compoundInterestChart instanceof Chart) {
        window.compoundInterestChart.destroy();
    }
    
    window.compoundInterestChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.year),
            datasets: [{
                label: 'Capital et contributions',
                data: data.map(d => d.principalAndContributions),
                borderColor: '#36A2EB',
                fill: false
            }, {
                label: 'Intérêts',
                data: data.map(d => d.interest),
                borderColor: '#FFCE56',
                fill: false
            }, {
                label: 'Total',
                data: data.map(d => d.total),
                borderColor: '#4BC0C0',
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Évolution de l\'investissement au fil du temps'
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Années'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Valeur ($)'
                    }
                }
            }
        }
    });
}

function formatNumber(number) {
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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

function getFrequencyText(frequency) {
    switch (frequency) {
        case "monthly": return "Mensuelle";
        case "quarterly": return "Trimestrielle";
        case "semiannually": return "Semi-annuelle";
        case "annually": return "Annuelle";
        default: return "Annuelle";
    }
}
