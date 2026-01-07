$(document).ready(function() {
    if (!localStorage.getItem('walletBalance')) localStorage.setItem('walletBalance', '0');
    if (!localStorage.getItem('transactions')) localStorage.setItem('transactions', JSON.stringify([]));
    function updateUI() {
        const balance = localStorage.getItem('walletBalance');
        if ($('#balanceDisplay').length) {
            $('#balanceDisplay').text(`$${parseFloat(balance).toLocaleString()}`);
        }
    }
    function addTransaction(type, amount) {
        let transactions = JSON.parse(localStorage.getItem('transactions'));
        transactions.unshift({
            date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            type: type,
            amount: amount
        });
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    updateUI();
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        window.location.href = 'menu.html';
    });
    $('#sendMoneyForm').on('submit', function(e) {
        e.preventDefault();
        const amount = parseFloat($('#sendAmount').val());
        let currentBalance = parseFloat(localStorage.getItem('walletBalance'));
        if (amount > 0 && amount <= currentBalance) {
            localStorage.setItem('walletBalance', currentBalance - amount);
            addTransaction("Envío a " + $('#contactSearch').val(), amount);
            const myModal = new bootstrap.Modal(document.getElementById('successModal'));
            myModal.show();
        } else {
            alert("Saldo insuficiente para realizar esta operación.");
        }
    });
    $('#closeModalBtn').on('click', function() {
        window.location.href = 'menu.html';
    });
    $('#depositBtn').on('click', function() {
        const amount = parseFloat($('#amountInput').val());
        if (amount > 0) {
            let currentBalance = parseFloat(localStorage.getItem('walletBalance'));
            localStorage.setItem('walletBalance', currentBalance + amount);
            addTransaction("Depósito", amount);
            window.location.href = 'menu.html';
        }
    });
    $('#withdrawBtn').on('click', function() {
        const amount = parseFloat($('#amountInput').val());
        let currentBalance = parseFloat(localStorage.getItem('walletBalance'));
        if (amount > 0 && amount <= currentBalance) {
            localStorage.setItem('walletBalance', currentBalance - amount);
            addTransaction("Retiro", amount);
            window.location.href = 'menu.html';
        } else {
            alert("Monto inválido o saldo insuficiente");
        }
    });
    if ($('#transactionBody').length) {
        let transactions = JSON.parse(localStorage.getItem('transactions'));
        transactions.forEach(t => {
            const isPositive = t.type === 'Depósito';
            $('#transactionBody').append(`
                <tr>
                    <td>${t.date}</td>
                    <td>${t.type}</td>
                    <td class="fw-bold ${isPositive ? 'text-success' : 'text-danger'}">
                        ${isPositive ? '+' : '-'}$${t.amount.toLocaleString()}
                    </td>
                </tr>
            `);
        });
    }
});