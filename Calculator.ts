function setUnit(self): void {
    (<HTMLInputElement>document.getElementById("calculator-amount")).value = '0';
    if(self.value=='M1'){
        document.getElementById("method-unit").innerHTML = 'งวด';
    }else{
        document.getElementById("method-unit").innerHTML = 'บาท';
    }
}

function calculateByPeriod(money: number, rate: number, period: number, date: string): any {
    let results: { no: number, period: string, cost: number, interest: number, amount: number, balance: number }[] = [];
    console.log(date);
    var begin = new Date(date);
    console.log(begin);
    let balance = money;
    let cost = Math.ceil(money/period);
    for(let no=1;no<=period;no++){
        if(balance<cost){
            cost = balance;
        }
        let row = {'no':no, 'period':'01/2024', 'balance':0, 'cost':0, 'interest':0, 'amount':0};
        row.period = (begin.getMonth()+1).toString()+'/'+begin.getFullYear().toString();
        row.interest = parseFloat(((balance*(rate/period))/12).toFixed(2));
        row.cost = cost;
        row.amount = parseFloat((row.cost+row.interest).toFixed(2));
        balance -= cost;
        row.balance = balance;
        results.push(row);
    }

    return results;
}

function calculateByCost(money: number, rate: number, cost: number, date: string): any {
    let results: { no: number, period: string, cost: number, interest: number, amount: number, balance: number }[] = [];
    var begin = new Date(date);
    let balance = money;
    let no = 1;
    do {
        if(balance<cost){
            cost = balance;
        }
        let row = {'no':no, 'period':'01/2000', 'balance':0, 'cost':0, 'interest':0, 'amount':0};
        row.period = ( (begin.getMonth()<=9) ? '0'+begin.getMonth() : begin.getMonth() )+'/'+begin.getFullYear();
        row.interest = parseFloat(((balance*(rate/100))/12).toFixed(2));
        row.cost = cost;
        row.amount = parseFloat((row.cost+row.interest).toFixed(2));
        balance -= cost;
        row.balance = balance;
        results.push(row);
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
    if( results.length>0 ){
        for(let i=0;i<results.length;i++){
            htmls += '<tr>';
                htmls += '<td class="no" style="text-align:center;">'+results[i].no+'</td>';
                htmls += '<td class="month" style="text-align:left;">'+results[i].period+'</td>';
                htmls += '<td class="money">'+(results[i].balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+'</td>';
                htmls += '<td class="money">'+(results[i].cost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+'</td>';
                htmls += '<td class="money">'+(results[i].interest).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+'</td>';
                htmls += '<td class="money">'+(results[i].amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+'</td>';
            htmls += '</tr>';
        }
    }
    document.getElementById("table-results").innerHTML = htmls;
}

function runCalculatorDefault(): void {
    let inyear = '';
    let nextyear = '';
    let today = new Date();
    for(let m=1;m<=12;m++ ){
        let month_at = ( (m>=10) ? m : '0'+m );
        if(m>today.getMonth()){
            inyear += '<option value="'+today.getFullYear()+'-'+month_at+'-01">01/'+month_at+'/'+today.getFullYear()+'</option>';
        }else{
            nextyear += '<option value="'+(today.getFullYear()+1)+'-'+month_at+'-01">01/'+month_at+'/'+(today.getFullYear()+1)+'</option>';
        }
    }
    document.getElementById("calculator-date").innerHTML = inyear+nextyear;
}