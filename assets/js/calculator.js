/**
 * MRB Energy Solutions — Advanced Mathematical & Financial Sizing Engine
 * Integrated with Chart.js for 25-year wealth accumulation forecast
 */

class AdvancedSolarCalculator {
  constructor() {
    this.mode = 'residential'; // 'residential' | 'commercial'
    this.chart = null;

    // DOM Elements
    this.billSlider = document.getElementById('billSlider');
    this.billDisplay = document.getElementById('billDisplay');
    this.categorySelect = document.getElementById('categorySelect');
    this.resModeBtn = document.getElementById('resModeBtn');
    this.comModeBtn = document.getElementById('comModeBtn');

    // Outputs
    this.capacityOutput = document.getElementById('calcCapacity');
    this.areaOutput = document.getElementById('calcArea');
    this.monthlySavingsOutput = document.getElementById('calcMonthlySavings');
    this.annualSavingsOutput = document.getElementById('calcAnnualSavings');
    this.paybackOutput = document.getElementById('calcPayback');
    this.lifetimeSavingsOutput = document.getElementById('calcLifetimeSavings');
    this.co2Output = document.getElementById('calcCO2');
    this.treesOutput = document.getElementById('calcTrees');
    this.incentiveLabel = document.getElementById('calcIncentiveLabel');
    this.incentiveOutput = document.getElementById('calcIncentive');
    this.incentiveDesc = document.getElementById('calcIncentiveDesc');
    this.chartCanvas = document.getElementById('savingsChart');

    this.init();
  }

  init() {
    if (this.resModeBtn && this.comModeBtn) {
      this.resModeBtn.addEventListener('click', () => this.setMode('residential'));
      this.comModeBtn.addEventListener('click', () => this.setMode('commercial'));
    }

    if (this.billSlider) {
      this.billSlider.addEventListener('input', () => this.calculate());
    }

    if (this.categorySelect) {
      this.categorySelect.addEventListener('change', () => this.calculate());
    }

    this.setMode('residential');
  }

  setMode(mode) {
    this.mode = mode;

    if (this.resModeBtn && this.comModeBtn) {
      if (mode === 'residential') {
        this.resModeBtn.classList.add('bg-[#5aad2b]', 'text-white', 'font-bold');
        this.resModeBtn.classList.remove('text-slate-400', 'font-medium');
        this.comModeBtn.classList.remove('bg-[#5aad2b]', 'text-white', 'font-bold');
        this.comModeBtn.classList.add('text-slate-400', 'font-medium');

        this.billSlider.min = '1000';
        this.billSlider.max = '20000';
        this.billSlider.step = '500';
        this.billSlider.value = '4500';

        if (this.categorySelect) {
          this.categorySelect.innerHTML = `
            <option value="home_ind">Independent Villa / House (₹7.50/unit)</option>
            <option value="home_apt">Housing Society / Apartment (₹7.80/unit)</option>
            <option value="home_rural">Suburban / Farmhouse (₹7.00/unit)</option>
          `;
        }

        if (this.incentiveLabel) this.incentiveLabel.innerHTML = '<i class="fa-solid fa-gift mr-1 text-[#74c741]"></i> PM Surya Ghar Subsidy';
        if (this.incentiveDesc) this.incentiveDesc.innerText = 'Central Govt DBT Direct Bank Credit:';

      } else {
        this.comModeBtn.classList.add('bg-[#5aad2b]', 'text-white', 'font-bold');
        this.comModeBtn.classList.remove('text-slate-400', 'font-medium');
        this.resModeBtn.classList.remove('bg-[#5aad2b]', 'text-white', 'font-bold');
        this.resModeBtn.classList.add('text-slate-400', 'font-medium');

        this.billSlider.min = '25000';
        this.billSlider.max = '1500000';
        this.billSlider.step = '5000';
        this.billSlider.value = '150000';

        if (this.categorySelect) {
          this.categorySelect.innerHTML = `
            <option value="com_office">Commercial Office / Showroom (₹10.50/unit)</option>
            <option value="com_school">School / Hospital / Hotel (₹9.80/unit)</option>
            <option value="fac_textile">Textile / Weaving Mill (₹9.20/unit)</option>
            <option value="fac_cold">Cold Storage & Agro Processing (₹9.80/unit)</option>
            <option value="fac_plastic">Plastic Molding / Machining (₹9.50/unit)</option>
            <option value="fac_warehouse">Warehouse & PEB Logistics Shed (₹8.80/unit)</option>
          `;
        }

        if (this.incentiveLabel) this.incentiveLabel.innerHTML = '<i class="fa-solid fa-receipt mr-1 text-[#74c741]"></i> Section 32 Tax Shield';
        if (this.incentiveDesc) this.incentiveDesc.innerText = '40% Accelerated Depreciation Year 1 Tax Shield:';
      }
    }

    this.calculate();
  }

  formatINR(val) {
    if (val >= 10000000) {
      return '₹' + (val / 10000000).toFixed(2) + ' Cr';
    } else if (val >= 100000) {
      return '₹' + (val / 100000).toFixed(2) + ' Lakh';
    } else {
      return '₹' + Math.round(val).toLocaleString('en-IN');
    }
  }

  calculate() {
    const monthlyBill = parseFloat(this.billSlider.value);
    if (this.billDisplay) {
      this.billDisplay.innerText = '₹' + Number(monthlyBill).toLocaleString('en-IN') + ' / mo';
    }

    let tariff = 7.50;
    let systemKw = 3;
    let subsidyOrTaxBenefit = 0;
    let totalCapex = 0;
    let paybackYears = 3.0;

    if (this.mode === 'residential') {
      tariff = 7.50;
      const monthlyUnits = monthlyBill / tariff;
      systemKw = Math.max(1, Math.round(monthlyUnits / 120));
      systemKw = Math.min(10, systemKw);

      totalCapex = systemKw * 60000;

      if (systemKw === 1) subsidyOrTaxBenefit = 30000;
      else if (systemKw === 2) subsidyOrTaxBenefit = 60000;
      else subsidyOrTaxBenefit = 78000;

      const netCost = totalCapex - subsidyOrTaxBenefit;
      const monthlySavingsINR = Math.min(monthlyBill * 0.90, systemKw * 120 * tariff);
      const annualSavingsINR = monthlySavingsINR * 12;
      paybackYears = (netCost / annualSavingsINR).toFixed(1);

    } else {
      const cat = this.categorySelect ? this.categorySelect.value : 'com_office';
      if (cat.includes('office') || cat.includes('hotel')) tariff = 10.50;
      else if (cat.includes('cold') || cat.includes('school')) tariff = 9.80;
      else if (cat.includes('textile') || cat.includes('plastic')) tariff = 9.40;
      else tariff = 8.80;

      const monthlyUnits = monthlyBill / tariff;
      const targetUnits = monthlyUnits * 0.75;
      systemKw = Math.max(10, Math.round((targetUnits / 120) / 5) * 5);

      totalCapex = systemKw * 44000;
      subsidyOrTaxBenefit = totalCapex * 0.40 * 0.2517;

      const netCost = totalCapex - subsidyOrTaxBenefit;
      const annualGen = systemKw * 1440;
      const annualSavingsINR = annualGen * tariff;
      paybackYears = (netCost / annualSavingsINR).toFixed(1);
    }

    const annualGenKwh = systemKw * 1440;
    const annualSavingsINR = annualGenKwh * tariff;
    const monthlySavingsINR = annualSavingsINR / 12;

    // Build 25-Year Data points for Chart
    const yearsLabels = ['Year 1', 'Year 5', 'Year 10', 'Year 15', 'Year 20', 'Year 25'];
    const cumulativeGains = [];
    let runningTotal = 0;
    let curGen = annualGenKwh;
    let curTariff = tariff;

    for (let yr = 1; yr <= 25; yr++) {
      runningTotal += (curGen * curTariff);
      curGen *= 0.994; // 0.6% panel degradation per year
      curTariff *= 1.02; // 2% grid inflation
      if ([1, 5, 10, 15, 20, 25].includes(yr)) {
        cumulativeGains.push(Math.round(runningTotal));
      }
    }

    const annualCo2 = (annualGenKwh * 0.82) / 1000;
    const trees = Math.round(annualCo2 * 45);
    const roofArea = Math.round(systemKw * 85);

    // Update DOM
    if (this.capacityOutput) this.capacityOutput.innerText = systemKw + ' kW' + (this.mode === 'commercial' ? 'p' : '');
    if (this.areaOutput) this.areaOutput.innerText = '~' + roofArea.toLocaleString('en-IN') + ' sq.ft roof';
    if (this.monthlySavingsOutput) this.monthlySavingsOutput.innerText = this.formatINR(monthlySavingsINR);
    if (this.annualSavingsOutput) this.annualSavingsOutput.innerText = this.formatINR(annualSavingsINR);
    if (this.paybackOutput) this.paybackOutput.innerText = paybackYears + ' Yrs';
    if (this.lifetimeSavingsOutput) this.lifetimeSavingsOutput.innerText = this.formatINR(runningTotal);
    if (this.co2Output) this.co2Output.innerText = Math.round(annualCo2) + ' T/yr';
    if (this.treesOutput) this.treesOutput.innerText = trees.toLocaleString('en-IN') + ' Trees';
    if (this.incentiveOutput) this.incentiveOutput.innerText = this.formatINR(subsidyOrTaxBenefit);

    this.renderChart(yearsLabels, cumulativeGains);
    this.updateWhatsAppLink(systemKw, monthlyBill, monthlySavingsINR, paybackYears, subsidyOrTaxBenefit);
  }

  renderChart(labels, data) {
    if (!this.chartCanvas || typeof Chart === 'undefined') return;

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
      return;
    }

    const ctx = this.chartCanvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cumulative Power Savings (₹)',
          data: data,
          borderColor: '#5aad2b',
          backgroundColor: 'rgba(90, 173, 43, 0.12)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#74c741',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ' Cumulative Savings: ₹' + Number(ctx.raw).toLocaleString('en-IN')
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94a3b8',
              font: { size: 10 },
              callback: (val) => {
                if (val >= 10000000) return '₹' + (val / 10000000).toFixed(1) + ' Cr';
                if (val >= 100000) return '₹' + (val / 100000).toFixed(0) + ' L';
                return '₹' + val;
              }
            }
          }
        }
      }
    });
  }

  updateWhatsAppLink(kw, bill, savings, payback, incentive) {
    const waBtn = document.getElementById('calcWhatsAppBtn');
    if (waBtn) {
      const typeStr = this.mode === 'residential' ? 'Residential (Home)' : 'Commercial / Factory';
      const incStr = this.mode === 'residential' ? 'PM Surya Ghar Subsidy: ' + this.formatINR(incentive) : 'Tax Shield: ' + this.formatINR(incentive);
      
      const text = `Hi MRB Energy Solutions Team,\n\nI calculated Solar Feasibility for our ${typeStr} property:\n- Monthly Power Bill: ₹${bill.toLocaleString('en-IN')}\n- Recommended Capacity: ${kw} kW\n- Est. Monthly Savings: ${this.formatINR(savings)}\n- ${incStr}\n- Est. Payback: ${payback} Yrs\n\nPlease share a detailed engineering proposal and schedule a free site survey.`;
      waBtn.href = 'https://wa.me/919477004493?text=' + encodeURIComponent(text);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.solarCalc = new AdvancedSolarCalculator();
});
