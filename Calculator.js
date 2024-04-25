function displayMonth(month) {
    return ((month > 9) ? month.toString() : '0' + month);
}
function calculateByPeriod(money, rate, period, date) {
    var results = [];
    var begin = new Date(date);
    var m = begin.getMonth();
    var y = begin.getFullYear();
    var balance = money;
    var cost = Math.ceil(money / period);
    for (var no = 1; no <= period; no++) {
        if (balance < cost) {
            cost = balance;
        }
        var row = { 'no': no, 'period': '01/2024', 'balance': 0, 'cost': 0, 'interest': 0, 'amount': 0 };
        row.period = displayMonth(m) + '/' + y;
        row.interest = parseFloat(((balance * (rate / period)) / 12).toFixed(2));
        row.cost = cost;
        row.amount = parseFloat((row.cost + row.interest).toFixed(2));
        balance -= cost;
        row.balance = balance;
        results.push(row);
        if (m == 12) {
            m = 1;
            y++;
        }
        else {
            m++;
        }
    }
    return results;
}
function calculateByCost(money, rate, cost, date) {
    var results = [];
    var begin = new Date(date);
    var m = begin.getMonth();
    var y = begin.getFullYear();
    var balance = money;
    var no = 1;
    do {
        if (balance < cost) {
            cost = balance;
        }
        var row = { 'no': no, 'period': '01/2000', 'balance': 0, 'cost': 0, 'interest': 0, 'amount': 0 };
        row.period = displayMonth(m) + '/' + y;
        row.interest = parseFloat(((balance * (rate / 100)) / 12).toFixed(2));
        row.cost = cost;
        row.amount = parseFloat((row.cost + row.interest).toFixed(2));
        balance -= cost;
        row.balance = balance;
        results.push(row);
        if (m == 12) {
            m = 1;
            y++;
        }
        else {
            m++;
        }
        no++;
    } while (balance > 0);
    return results;
}
function runCalculator() {
    var money = parseFloat(document.getElementById("calculator-money").value);
    var rate = parseFloat(document.getElementById("calculator-rate").value);
    var amount = parseFloat(document.getElementById("calculator-amount").value);
    var method = document.getElementById("calculator-method").value;
    var date = document.getElementById("calculator-date").value;
    var results;
    if (method == 'Period') {
        results = calculateByPeriod(money, rate, amount, date);
    }
    else {
        results = calculateByCost(money, rate, amount, date);
    }
    var htmls = '';
    var costTotal = 0, interestTotal = 0, amountTotal = 0;
    if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
            htmls += '<tr>';
            htmls += '<td class="no" style="text-align:center;">' + results[i].no + '</td>';
            htmls += '<td class="month" style="text-align:left;">' + results[i].period + '</td>';
            htmls += '<td class="money">' + (results[i].balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td>';
            htmls += '<td class="money">' + (results[i].cost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td>';
            htmls += '<td class="money">' + (results[i].interest).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td>';
            htmls += '<td class="money">' + (results[i].amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td>';
            htmls += '</tr>';
            costTotal += results[i].cost;
            interestTotal += results[i].interest;
            amountTotal += results[i].amount;
        }
    }
    htmls += '<tr>';
    htmls += '<td colspan="3" style="text-align:right;"><b>รวม</b></td>';
    htmls += '<td class="money"><b>' + (costTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</b></td>';
    htmls += '<td class="money"><b>' + (interestTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</b></td>';
    htmls += '<td class="money"><b>' + (amountTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</b></td>';
    htmls += '</tr>';
    document.getElementById("table-results").innerHTML = htmls;
}
function runCalculatorDefault() {
    var inyear = '';
    var nextyear = '';
    var today = new Date();
    for (var m = 1; m <= 12; m++) {
        var month_at = displayMonth(m);
        if (m > today.getMonth()) {
            inyear += '<option value="' + today.getFullYear() + '-' + month_at + '-01">01/' + month_at + '/' + today.getFullYear() + '</option>';
        }
        else {
            nextyear += '<option value="' + (today.getFullYear() + 1) + '-' + month_at + '-01">01/' + month_at + '/' + (today.getFullYear() + 1) + '</option>';
        }
    }
    document.getElementById("calculator-date").innerHTML = inyear + nextyear;
    document.getElementById("calculator-method").addEventListener('change', function () {
        document.getElementById("calculator-amount").value = '0';
        if (this.value == 'Period') {
            document.getElementById("method-unit").innerHTML = 'งวด';
        }
        else {
            document.getElementById("method-unit").innerHTML = 'บาท';
        }
    });
}
