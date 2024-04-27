/*  ฟังก์ชั่นการแสดงจำนวนเงิน
    เช่น จาก 10000 เป็น 10,000.00
*/
function moneyDisplay(money) {
    return money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
/*  ฟังก์ชั่นการแสดงเดือน
    เช่น จาก 1 เป็น 01
*/
function monthDisplay(month) {
    return ((month > 9) ? month.toString() : '0' + month);
}
/*  ฟังก์ชั่นการคำนวนตารางเงินกู้
    คืนค่าเป็น array
*/
function calLoanEstimate(money, rate, amount, method, date) {
    var begin = new Date(date);
    var no = 1, balance = money, m = begin.getMonth() + 1, y = begin.getFullYear();
    var results = [];
    if (method == 'Cost') {
        var cost = amount;
        do {
            if (balance < cost) {
                cost = balance;
            }
            var lastday = new Date(y, m, 0);
            var row = { 'no': no++, 'period': monthDisplay(m) + '/' + y + ' (<small>' + lastday.getDate() + ' วัน</small>)', 'balance': 0, 'cost': cost, 'interest': 0, 'amount': 0 };
            row.interest = parseFloat(((balance * (rate / 100) * lastday.getDate()) / 365).toFixed(2));
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
        } while (balance > 0);
    }
    else {
        var period = amount, cost = Math.round(money / period);
        for (var i = 0; i < period; i++) {
            if (no == period) {
                cost = balance;
            }
            var lastday = new Date(y, m, 0);
            var row = { 'no': no++, 'period': monthDisplay(m) + '/' + y + ' (<small>' + lastday.getDate() + ' วัน</small>)', 'balance': 0, 'cost': cost, 'interest': 0, 'amount': 0 };
            row.interest = parseFloat(((balance * (rate / 100) * lastday.getDate()) / 365).toFixed(2));
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
    }
    return results;
}
//  ฟังก์ชั่นแสดงตารางเงินกู้
function runCalculator() {
    var money = parseFloat(document.getElementById("calculator-money").value);
    var rate = parseFloat(document.getElementById("calculator-rate").value);
    var amount = parseFloat(document.getElementById("calculator-amount").value);
    var method = document.getElementById("calculator-method").value;
    var date = document.getElementById("calculator-date").value;
    var results = calLoanEstimate(money, rate, amount, method, date);
    var htmls = '';
    var costTotal = 0, interestTotal = 0, amountTotal = 0;
    if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
            htmls += '<tr>';
            htmls += '<td class="no" style="text-align:center;">' + results[i].no + '</td>';
            htmls += '<td class="month" style="text-align:left;">' + results[i].period + '</td>';
            htmls += '<td class="money">' + moneyDisplay(results[i].balance) + '</td>';
            htmls += '<td class="money">' + moneyDisplay(results[i].cost) + '</td>';
            htmls += '<td class="money">' + moneyDisplay(results[i].interest) + '</td>';
            htmls += '<td class="money">' + moneyDisplay(results[i].amount) + '</td>';
            htmls += '</tr>';
            costTotal += results[i].cost;
            interestTotal += results[i].interest;
            amountTotal += results[i].amount;
        }
    }
    htmls += '<tr>';
    htmls += '<td colspan="3" style="text-align:right;"><b>รวม</b></td>';
    htmls += '<td class="money"><b>' + moneyDisplay(costTotal) + '</b></td>';
    htmls += '<td class="money"><b>' + moneyDisplay(interestTotal) + '</b></td>';
    htmls += '<td class="money"><b>' + moneyDisplay(amountTotal) + '</b></td>';
    htmls += '</tr>';
    document.getElementById("table-results").innerHTML = htmls;
}
// ฟังก์ชั่นกำหนดค่าเริ่มต้น
function runCalculatorDefault() {
    var inyear = '';
    var nextyear = '';
    var today = new Date();
    for (var m = 1; m <= 12; m++) {
        var month_at = monthDisplay(m);
        if (m > (today.getMonth() + 1)) {
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
