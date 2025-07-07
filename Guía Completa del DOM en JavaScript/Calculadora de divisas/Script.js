const exchangeRates = {
    COP: { USD: 0.00024, EUR: 0.00022 },
    USD: { COP: 4200, EUR: 0.93 },
    EUR: { COP: 4500, USD: 1.08 }
};

function convert() {
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDisplay = document.getElementById('result');

    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        resultDisplay.textContent = 'Por favor, ingresa una cantidad válida.';
        return;
    }

    if (fromCurrency === toCurrency) {
        resultDisplay.textContent = `Resultado: ${amount.toFixed(2)} ${toCurrency}`;
        return;
    }

    const tasaCambio = exchangeRates[fromCurrency]?.[toCurrency];

    if (!tasaCambio) {
        resultDisplay.textContent = 'Conversión no disponible.';
        return;
    }

    const resultado = amount * tasaCambio;
    resultDisplay.textContent = `Resultado: ${resultado.toFixed(2)} ${toCurrency}`;
}
