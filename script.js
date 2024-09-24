function toggleFields() {
    const calcType = document.getElementById('calcType').value;
    
    // Hide all input fields by default
    document.getElementById('cashFlowField').classList.add('hidden');
    document.getElementById('rateField').classList.add('hidden');
    document.getElementById('timeField').classList.add('hidden');
    document.getElementById('initialInvestmentField').classList.add('hidden');
    document.getElementById('cashFlowInputs').innerHTML = ''; // Clear dynamic inputs

    // Show specific fields based on the selected calculation
    if (calcType === 'pv_single' || calcType === 'fv_single') {
        document.getElementById('cashFlowField').classList.remove('hidden');
        document.getElementById('rateField').classList.remove('hidden');
        document.getElementById('timeField').classList.remove('hidden');
    } else if (calcType === 'pv_multiple' || calcType === 'fv_multiple' || calcType === 'npv') {
        document.getElementById('rateField').classList.remove('hidden');
        document.getElementById('timeField').classList.remove('hidden');
    } else if (calcType === 'ordinary_perpetuity' || calcType === 'perpetuity_due') {
        document.getElementById('cashFlowField').classList.remove('hidden');
        document.getElementById('rateField').classList.remove('hidden');
    } else if (calcType === 'ordinary_annuity' || calcType === 'annuity_due') {
        document.getElementById('cashFlowField').classList.remove('hidden');
        document.getElementById('rateField').classList.remove('hidden');
        document.getElementById('timeField').classList.remove('hidden');
    } else if (calcType === 'loan_amortization') {
        document.getElementById('cashFlowField').classList.remove('hidden');
        document.getElementById('rateField').classList.remove('hidden');
        document.getElementById('timeField').classList.remove('hidden');
    }
}

function addCashFlowInputs() {
    const time = parseInt(document.getElementById('time').value);
    const calcType = document.getElementById('calcType').value;
    const cashFlowInputsDiv = document.getElementById('cashFlowInputs');

    cashFlowInputsDiv.innerHTML = ''; // Clear previous inputs

    // Generate the correct number of cash flow inputs based on the period
    for (let i = 0; i < time; i++) {
        cashFlowInputsDiv.innerHTML += `
            <label for="cashFlow_${i}">Cash Flow for Year ${i}:</label>
            <input type="number" id="cashFlow_${i}" class="cashFlowYear" placeholder="Cash flow for year ${i}">
        `;
    }
}

function calculate() {
    const calcType = document.getElementById('calcType').value;
    const cashFlow = parseFloat(document.getElementById('cashFlow').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const time = parseInt(document.getElementById('time').value);
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    
    let result = 0;
    let formula = '';
    let calculationSteps = '';

    // Get all cash flows entered for multiple cash flow options
    const cashFlowYears = document.querySelectorAll('.cashFlowYear');
    let cashFlows = Array.from(cashFlowYears).map(input => parseFloat(input.value));

    let stepsHTML = '';
    let formulaHTML = '';

    switch (calcType) {
        case 'pv_single':
            result = cashFlow / Math.pow(1 + rate, time);
            formulaHTML = `<tr><td>PV = CF / (1 + r)^t</td></tr>`;
            stepsHTML += `<tr><td>PV = ${cashFlow} / (1 + ${rate})^${time} = ${result.toFixed(2)}</td></tr>`;
            break;
        case 'pv_multiple':
            result = cashFlows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i), 0);
            formulaHTML = `<tr><td>PV = Σ CF_t / (1 + r)^t</td></tr>`;
            cashFlows.forEach((cf, i) => {
                stepsHTML += `<tr><td>Year ${i}: CF = ${cf} -> PV = ${cf} / (1 + ${rate})^${i} = ${(cf / Math.pow(1 + rate, i)).toFixed(2)}</td></tr>`;
            });
            stepsHTML += `<tr><td>Total PV = ${result.toFixed(2)}</td></tr>`;
            break;
        case 'fv_single':
            result = cashFlow * Math.pow(1 + rate, time);
            formulaHTML = `<tr><td>FV = CF * (1 + r)^t</td></tr>`;
            stepsHTML += `<tr><td>FV = ${cashFlow} * (1 + ${rate})^${time} = ${result.toFixed(2)}</td></tr>`;
            break;
        case 'fv_multiple':
            result = cashFlows.reduce((acc, cf, i) => acc + cf * Math.pow(1 + rate, time - i - 1), 0);
            formulaHTML = `<tr><td>FV = Σ CF_t * (1 + r)^(T-t)</td></tr>`;
            cashFlows.forEach((cf, i) => {
                stepsHTML += `<tr><td>Year ${i}: CF = ${cf} -> FV = ${cf} * (1 + ${rate})^(${time - i - 1}) = ${(cf * Math.pow(1 + rate, time - i - 1)).toFixed(2)}</td></tr>`;
            });
            stepsHTML += `<tr><td>Total FV = ${result.toFixed(2)}</td></tr>`;
            break;
        case 'ordinary_perpetuity':
            result = cashFlow / rate;
            formulaHTML = `<tr><td>PV = CF / r</td></tr>`;
            stepsHTML += `<tr><td>PV = ${cashFlow} / ${rate} = ${result.toFixed(2)}</td></tr>`;
            break;
        case 'perpetuity_due':
            result = (cashFlow / rate) * (1 + rate);
            formulaHTML = `<tr><td>PV = (CF / r) * (1 + r)</td></tr>`;
            stepsHTML += `<tr><td>PV = (${cashFlow} / ${rate}) * (1 + ${rate}) = ${result.toFixed(2)}</td></tr>`;
            break;
        case 'ordinary_annuity':
            result = cashFlow * ((1 - Math.pow(1 + rate, -time)) / rate);
            formulaHTML = `<tr><td>PV = CF * [(1 - (1 + r)^-t) / r]</td></tr>`;
            stepsHTML += `<tr><td>PV = ${cashFlow} * [(1 - (1 + ${rate})^-${time}) / ${rate}] = ${result.toFixed(2)}</td></tr>`;
            break;
        case 'annuity_due':
            result = cashFlow * ((1 - Math.pow(1 + rate, -time)) / rate) * (1 + rate);
            formulaHTML = `<tr><td>PV = CF * [(1 - (1 + r)^-t) / r] * (1 + r)</td></tr>`;
            stepsHTML += `<tr><td>PV = ${cashFlow} * [(1 - (1 + ${rate})^-${time}) / ${rate}] * (1 + ${rate}) = ${result.toFixed(2)}</td></tr>`;
            break;
        case 'loan_amortization':
            result = (cashFlow * rate) / (1 - Math.pow(1 + rate, -time));
            formulaHTML = `<tr><td>PMT = CF * [r / (1 - (1 + r)^-t)]</td></tr>`;
            stepsHTML += `<tr><td>PMT = ${cashFlow} * [${rate} / (1 - (1 + ${rate})^-${time})] = ${result.toFixed(2)}</td></tr>`;
            break;
        case 'npv':
            result = cashFlows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i), 0) - initialInvestment;
            formulaHTML = `<tr><td>NPV = Σ CF_t / (1 + r)^t - Initial Investment</td></tr>`;
            cashFlows.forEach((cf, i) => {
                stepsHTML += `<tr><td>Year ${i}: CF = ${cf} -> NPV = ${cf} / (1 + ${rate})^${i} = ${(cf / Math.pow(1 + rate, i)).toFixed(2)}</td></tr>`;
            });
            stepsHTML += `<tr><td>Total NPV = ${result.toFixed(2)}</td></tr>`;
            break;
    }

    document.getElementById('output').textContent = `Result: ${result.toFixed(2)}`;
    document.getElementById('calculationSteps').innerHTML = stepsHTML;
    document.getElementById('formula').innerHTML = formulaHTML;
    document.getElementById('calculationTable').classList.remove('hidden');
    document.getElementById('formulaTable').classList.remove('hidden');
}

function clearFields() {
    document.getElementById('calcType').value = "pv_single";
    document.getElementById('cashFlow').value = '';
    document.getElementById('rate').value = '';
    document.getElementById('time').value = '';
    document.getElementById('cashFlowInputs').innerHTML = '';
    document.getElementById('initialInvestment').value = '';
    document.getElementById('output').textContent = '';
    document.getElementById('calculationSteps').innerHTML = '';
    document.getElementById('formula').innerHTML = '';
    document.getElementById('calculationTable').classList.add('hidden');
    document.getElementById('formulaTable').classList.add('hidden');
}
