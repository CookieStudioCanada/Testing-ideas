let detailedLogs = "";
let totIncome;
let dMmajoration;
let ndMajoration;

function logDetailedResults(logs) {
    detailedLogs = logs.join('\n');
    console.log(detailedLogs);
}

function calculateFederalTax(income) {
    let logs = [`Calcul des impôts fédéraux pour un revenu de $${income}.`];
    let tax = 0;
    if (income <= 55867) {
        tax = income * 0.15;
        logs.push(`Le revenu jusqu'à $55,867 est imposé à 15% : $${tax.toFixed(2)}`);
    } else {
        let initialTax = 55867 * 0.15;
        tax = initialTax;
        logs.push(`Les premiers $55,867 sont imposés à 15% : $${initialTax.toFixed(2)}`);
        if (income <= 111733) {
            tax += (income - 55867) * 0.205;
            logs.push(`Le revenu de $55,867 à $111,733 est imposé à 20.5% : $${((income - 55867) * 0.205).toFixed(2)}`);
        } else {
            let middleTax = (111733 - 55867) * 0.205;
            tax += middleTax;
            logs.push(`Les $55,866 suivants sont imposés à 20.5% : $${middleTax.toFixed(2)}`);
            if (income <= 173205) {
                tax += (income - 111733) * 0.26;
                logs.push(`Le revenu de $111,733 à $173,205 est imposé à 26% : $${((income - 111733) * 0.26).toFixed(2)}`);
            } else {
                let higherTax = (173205 - 111733) * 0.26;
                tax += higherTax;
                logs.push(`Les $61,472 suivants sont imposés à 26% : $${higherTax.toFixed(2)}`);
                if (income <= 246752) {
                    tax += (income - 173205) * 0.29;
                    logs.push(`Le revenu de $173,205 à $246,752 est imposé à 29% : $${((income - 173205) * 0.29).toFixed(2)}`);
                } else {
                    let highestTax = (246752 - 173205) * 0.29;
                    tax += highestTax;
                    tax += (income - 246752) * 0.33;
                    logs.push(`Les $73,547 suivants sont imposés à 29% : $${highestTax.toFixed(2)}`);
                    logs.push(`Le revenu supérieur à $246,752 est imposé à 33% : $${((income - 246752) * 0.33).toFixed(2)}`);
                }
            }
        }
    }
    
    let abatedTax = tax - (tax * 0.165);
    
    // console.log("majorations : deter" + dMmajoration + "nd : " + ndMajoration);
    // finalTax = abatedTax - (dMmajoration * (6/11)) - (ndMajoration * (9/13));
    
    logs.push(`Application de l'abattement de 16.5%, réduction de l'impôt de $${(tax * 0.165).toFixed(2)} à $${abatedTax.toFixed(2)}.`);
    return [abatedTax, logs];
}

function calculateQuebecTax(income) {
    let logs = [`Calcul des impôts du Québec pour un revenu de $${income}.`];
    let tax = 0;
    if (income <= 51780) {
        tax = income * 0.14;
        logs.push(`Le revenu jusqu'à $51,780 est imposé à 14% : $${tax.toFixed(2)}`);
    } else {
        let initialTax = 51780 * 0.14;
        tax = initialTax;
        logs.push(`Les premiers $51,780 sont imposés à 14% : $${initialTax.toFixed(2)}`);
        if (income <= 103545) {
            tax += (income - 51780) * 0.19;
            logs.push(`Le revenu de $51,780 à $103,545 est imposé à 19% : $${((income - 51780) * 0.19).toFixed(2)}`);
        } else {
            let middleTax = (103545 - 51780) * 0.19;
            tax += middleTax;
            logs.push(`Les $51,765 suivants sont imposés à 19% : $${middleTax.toFixed(2)}`);
            if (income <= 126000) {
                tax += (income - 103545) * 0.24;
                logs.push(`Le revenu de $103,545 à $126,000 est imposé à 24% : $${((income - 103545) * 0.24).toFixed(2)}`);
            } else {
                let higherTax = (126000 - 103545) * 0.24;
                tax += higherTax;
                tax += (income - 126000) * 0.2575;
                logs.push(`Les $22,455 suivants sont imposés à 24% : $${higherTax.toFixed(2)}`);
                logs.push(`Le revenu supérieur à $126,000 est imposé à 25.75% : $${((income - 126000) * 0.2575).toFixed(2)}`);
            }
        }
    }
    return [tax, logs];
}

function calculateTotalTax() {

    // Income
    const employmentIncome = parseFloat(document.getElementById('employmentIncome').value) || 0;
    const capitalGains = parseFloat(document.getElementById('capitalGains').value) || 0;
    const determinedDividend = parseFloat(document.getElementById('determinedDividend').value) || 0;
    const undeterminedDividend = parseFloat(document.getElementById('undeterminedDividend').value) || 0;
    const propertyIncome = parseFloat(document.getElementById('propertyIncome').value) || 0;

    const capitalGainsOver = 0;

    if (capitalGains > 250000) {
        capitalGainsOver = capitalGains - 250000;
    } else {
        return;
    }

    const totalIncome = employmentIncome + + (capitalGainsOver * 0,6667) + (capitalGains * 0.50) + (determinedDividend * 1.38) + (undeterminedDividend * 1.15) + propertyIncome;
    totIncome = totalIncome;
    dMmajoration = (determinedDividend * 1.38) - determinedDividend;
    ndMajoration = (undeterminedDividend * 1.15) - undeterminedDividend;
    
    if (isNaN(totalIncome) || totalIncome === 0) {
        document.getElementById('result').textContent = 'Veuillez entrer un chiffre valide dans au moins une catégorie.';
        return;
    }

    // Deduction - TO DO

    // Tax Calculations and logs
    const [federalTax, federalLogs] = calculateFederalTax(totalIncome);
    const [quebecTax, quebecLogs] = calculateQuebecTax(totalIncome);
    const totalTax = federalTax + quebecTax;

    // Tax credits - TO DO 

    // Logs

    const totalLogs = [...federalLogs, ...quebecLogs, `Calcul total des impôts : Impôt fédéral $${federalTax.toFixed(2)} + Impôt du Québec $${quebecTax.toFixed(2)} = $${totalTax.toFixed(2)}`];

    logDetailedResults(totalLogs);

    document.getElementById('result').innerHTML = `<strong>Détail des Impôts:</strong><br>` +
                                                  `Impôt fédéral estimé: $${federalTax.toFixed(2)}<br>` +
                                                  `Impôt du Québec estimé: $${quebecTax.toFixed(2)}<br>` +
                                                  `Impôt total estimé: $${totalTax.toFixed(2)}`;

    
}

function resetFields() {
    document.getElementById('employmentIncome').value = '';
    document.getElementById('capitalGains').value = '';
    document.getElementById('determinedDividend').value = '';
    document.getElementById('undeterminedDividend').value = '';
    document.getElementById('propertyIncome').value = '';
    document.getElementById('businessIncome').value = '';
    document.getElementById('result').innerHTML = '';
}

function showLogs() {
    document.getElementById('toastBody').textContent = detailedLogs;
    var toastLiveExample = document.getElementById('liveToast');
    var toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}

// Deductions
function calculateReerImpact() {
    const investment = parseFloat(document.getElementById('reerInput').value);
    console.log(totIncome);

    // Deduction - TO DO
    if (isNaN(investment) || isNaN(totIncome)) {
        alert("Veuillez entrer un montant valide.");
        return;
    }

    let netIncome = totIncome - investment;

    // Tax Calculations and logs
    const [federalTax, federalLogs] = calculateFederalTax(netIncome);
    const [quebecTax, quebecLogs] = calculateQuebecTax(netIncome);
    const totalTax = federalTax + quebecTax;

    // Regular calculation
    const [federalTax2, federalLogs2] = calculateFederalTax(totIncome);
    const [quebecTax2, quebecLogs2] = calculateQuebecTax(totIncome);
    const totalTax2 = federalTax2 + quebecTax2;

    // Tax credits - TO DO 

    // Logs
    const taxImpact = totalTax2 - totalTax;
    alert(`En allouant ${investment.toLocaleString('fr-CA')} CAD à votre REER, vous allez réduire votre obligation fiscale d'environ ${taxImpact.toLocaleString('fr-CA')} CAD.`);
}

function calculateCeliappImpact() {
    const investment = parseFloat(document.getElementById('celiappInput').value);
    console.log(totIncome);

    // Deduction - TO DO
    if (isNaN(investment) || isNaN(totIncome)) {
        alert("Veuillez entrer un montant valide.");
        return;
    }

    let netIncome = totIncome - investment;

    // Tax Calculations and logs
    const [federalTax, federalLogs] = calculateFederalTax(netIncome);
    const [quebecTax, quebecLogs] = calculateQuebecTax(netIncome);
    const totalTax = federalTax + quebecTax;

    // Regular calculation
    const [federalTax2, federalLogs2] = calculateFederalTax(totIncome);
    const [quebecTax2, quebecLogs2] = calculateQuebecTax(totIncome);
    const totalTax2 = federalTax2 + quebecTax2;

    // Tax credits - TO DO 

    // Logs
    const taxImpact = totalTax2 - totalTax;
    alert(`En allouant ${investment.toLocaleString('fr-CA')} CAD à votre CELIAPP, vous allez réduire votre obligation fiscale d'environ ${taxImpact.toLocaleString('fr-CA')} CAD.`);
}
