/**
 * @fileoverview Lógica para calcular la Solvencia Financiera Personal.
 * Proyecto: Calculadora | Financiera (Fernando Pérez Torres)
 */

// Referencias al DOM
const resultContainer = document.getElementById('resultContainer');
const resultValue = document.getElementById('resultValue');
const resultAnalysis = document.getElementById('resultAnalysis');
const debtProgressBar = document.getElementById('debtProgressBar');

function calculatePersonalSolvency() {
    // 1. Obtener valores parseados
    const income = parseFloat(document.getElementById('monthlyIncome').value) || 0;
    const livingExpenses = parseFloat(document.getElementById('livingExpenses').value) || 0;
    const debtPayments = parseFloat(document.getElementById('debtPayments').value) || 0;

    // Validación básica en consola
    if (income <= 0) {
        console.error("El ingreso mensual debe ser un valor positivo.");
        alert("Por favor ingresa un ingreso mensual válido mayor a 0.");
        return;
    }

    // Cálculos Financieros
    const totalExpenses = livingExpenses + debtPayments;
    const cashFlow = income - totalExpenses; // Lo que sobra (o falta)
    const debtRatio = (debtPayments / income) * 100; // Ratio de Endeudamiento

    // Mostrar contenedor de resultados
    resultContainer.classList.remove('d-none');

    // Formateador de moneda MXN
    const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

    // Actualizar barra de progreso de deuda
    const ratioValue = Math.min(debtRatio, 100);
    debtProgressBar.style.width = `${ratioValue}%`;
    debtProgressBar.textContent = `${debtRatio.toFixed(1)}%`;

    // Limpiar clases previas
    resultValue.className = 'display-4 fw-bold my-2';
    debtProgressBar.className = 'progress-bar progress-bar-striped progress-bar-animated';

    // Lógica del Semáforo Financiero
    if (cashFlow < 0) {
        // --- ESCENARIO ROJO: DÉFICIT ---
        resultValue.textContent = formatter.format(cashFlow);
        resultValue.classList.add('text-danger');
        resultAnalysis.innerHTML = `
            <strong>DÉFICIT MENSUAL</strong><br>
            Cuidado. Estás gastando más de lo que ganas.<br> 
            Tus gastos superan tus ingresos en <strong>${formatter.format(Math.abs(cashFlow))}</strong>.<br> 
            Es urgente reducir gastos o consolidar deudas.
        `;
        debtProgressBar.classList.add('bg-danger');

    } else if (debtRatio > 40) {
        // --- ESCENARIO AMARILLO: SOBREENDEUDAMIENTO ---
        resultValue.textContent = formatter.format(cashFlow);
        resultValue.classList.add('text-warning');
        resultAnalysis.innerHTML = `
            <strong>SOBREENDEUDAMIENTO</strong><br>
            Tienes flujo positivo, PERO tus deudas consumen el <strong>${debtRatio.toFixed(1)}%</strong> de tu ingreso.<br>
            Lo recomendable es que las deudas no superen el 30-35%.<br> 
            Cualquier imprevisto podría ponerte en aprietos.
        `;
        debtProgressBar.classList.add('bg-warning', 'text-dark');

    } else {
        // --- ESCENARIO VERDE: SALUD FINANCIERA ÓPTIMA ---
        resultValue.textContent = formatter.format(cashFlow);
        resultValue.classList.add('text-success');
        resultAnalysis.innerHTML = `
            <strong>SALUD FINANCIERA ÓPTIMA</strong><br>
            ¡Felicidades! Tienes un excedente de <strong>${formatter.format(cashFlow)}</strong> para ahorrar o invertir.<br>
            Tu nivel de deuda es manejable (${debtRatio.toFixed(1)}%).<br>
            ¡Sigue así!
        `;
        debtProgressBar.classList.add('bg-success');
    }

    // Desplazamiento suave
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}