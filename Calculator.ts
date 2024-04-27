function moneyDisplay(money: number): string {
    return money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


function monthDisplay(month: number): string {
    return ( (month>9) ? month.toString() : '0'+month );
}

function calculateByPeriod(money: number, rate: number, period: number, date: string): any {
    let results: { no: number, period: string, cost: number, interest: number, amount: number, balance: number }[] = [];
    var begin = new Date(date);
    let m = begin.getMonth()+1;
    let y = begin.getFullYear();
    let balance = money;
    let cost = Math.round(money/period);
    for(let no=1;no<=period;no++){
        if(no==period){
            cost = balance;
        }
        let row = {'no':no, 'period':'01/2024', 'balance':0, 'cost':0, 'interest':0, 'amount':0};
        let lastday  = new Date(y,m,0);
        row.period = monthDisplay(m)+'/'+y+' (<small>'+lastday.getDate()+' วัน</small>)';
        row.interest = parseFloat(((balance*(rate/100)*lastday.getDate())/365).toFixed(2));
        row.cost = cost;
        row.amount = parseFloat((row.cost+row.interest).toFixed(2));
        balance -= cost;
        row.balance = balance;
        results.push(row);
        if(m==12){
            m = 1;
            y++;
        }else{
            m++;
        }
    }

    return results;
}

function calculateByCost(money: number, rate: number, cost: number, date: string): any {
    let results: { no: number, period: string, cost: number, interest: number, amount: number, balance: number }[] = [];
    var begin = new Date(date);
    let m = begin.getMonth();
    let y = begin.getFullYear();
    let balance = money;
    let no = 1;
    do {
        if(balance<cost){
            cost = balance;
        }
        let row = {'no':no, 'period':'01/2000', 'balance':0, 'cost':0, 'interest':0, 'amount':0};
        let lastday  = new Date(y,m,0);
        row.period = monthDisplay(m)+'/'+y+' (<small>'+lastday.getDate()+' วัน</small>)';
        row.interest = parseFloat(((balance*(rate/100)*lastday.getDate())/365).toFixed(2));
        row.cost = cost;
        row.amount = parseFloat((row.cost+row.interest).toFixed(2));
        balance -= cost;
        row.balance = balance;
        results.push(row);
        if(m==12){
            m = 1;
            y++;
        }else{
            m++;
        }
        no++;
    }  while ( balance>0 );
    return results;
}

function runCalculator(): void {
    let money : number = parseFloat((<HTMLInputElement>document.getElementById("calculator-money")).value);
    let rate : number = parseFloat((<HTMLInputElement>document.getElementById("calculator-rate")).value);
    let amount : number = parseFloat((<HTMLInputElement>document.getElementById("calculator-amount")).value);
    let method : string = (<HTMLInputElement>document.getElementById("calculator-method")).value;
    let date : string = (<HTMLInputElement>document.getElementById("calculator-date")).value;
    let results;
    if( method=='Period' ){
        results = calculateByPeriod(money, rate, amount, date);
    }else{
        results = calculateByCost(money, rate, amount, date);
    }
    let htmls = '';
    let  costTotal=0, interestTotal=0, amountTotal=0;
    if( results.length>0 ){
        for(let i=0;i<results.length;i++){
            htmls += '<tr>';
                htmls += '<td class="no" style="text-align:center;">'+results[i].no+'</td>';
                htmls += '<td class="month" style="text-align:left;">'+results[i].period+'</td>';
                htmls += '<td class="money">'+moneyDisplay(results[i].balance)+'</td>';
                htmls += '<td class="money">'+moneyDisplay(results[i].cost)+'</td>';
                htmls += '<td class="money">'+moneyDisplay(results[i].interest)+'</td>';
                htmls += '<td class="money">'+moneyDisplay(results[i].amount)+'</td>';
            htmls += '</tr>';
            costTotal += results[i].cost;
            interestTotal += results[i].interest;
            amountTotal += results[i].amount;
        }
    }
    htmls += '<tr>';
        htmls += '<td colspan="3" style="text-align:right;"><b>รวม</b></td>';
        htmls += '<td class="money"><b>'+moneyDisplay(costTotal)+'</b></td>';
        htmls += '<td class="money"><b>'+moneyDisplay(interestTotal)+'</b></td>';
        htmls += '<td class="money"><b>'+moneyDisplay(amountTotal)+'</b></td>';
    htmls += '</tr>';
    (<HTMLInputElement>document.getElementById("table-results")).innerHTML = htmls;
}

function runCalculatorDefault(): void {
    let inyear = '';
    let nextyear = '';
    let today = new Date();
    for(let m=1;m<=12;m++ ){
        let month_at = monthDisplay(m);
        if(m>(today.getMonth()+1)){
            inyear += '<option value="'+today.getFullYear()+'-'+month_at+'-01">01/'+month_at+'/'+today.getFullYear()+'</option>';
        }else{
            nextyear += '<option value="'+(today.getFullYear()+1)+'-'+month_at+'-01">01/'+month_at+'/'+(today.getFullYear()+1)+'</option>';
        }
    }
    (<HTMLInputElement>document.getElementById("calculator-date")).innerHTML = inyear+nextyear;
    (<HTMLInputElement>document.getElementById("calculator-method")).addEventListener('change', function(){
        (<HTMLInputElement>document.getElementById("calculator-amount")).value = '0';
        if(this.value=='Period'){
            (<HTMLInputElement>document.getElementById("method-unit")).innerHTML = 'งวด';
        }else{
            (<HTMLInputElement>document.getElementById("method-unit")).innerHTML = 'บาท';
        }
    });
}