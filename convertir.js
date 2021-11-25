// JavaScript Document
var v1 = document.getElementById("v1")
    var v2 = document.getElementById("v2")
    var v1input = document.getElementById("v1input")
    var v2input = document.getElementById("v2input")
    var Input1 = document.getElementById("Input1")
    var Input2 = document.getElementById("Input2")
    var info = document.getElementById("info")
    var CurrentImage = document.getElementById("CurrentImage")
    var CurrentName = document.getElementById("CurrentName") 
    var currentConvertionPrice = 0
    var linked = false

    var currency = "BTC-USD"

    let HystoryChart

    var CurrencyName = ""

    var SymbolNames = [

    ]

    var mainData = []
    var Currencies = [
        [ "BTC", [] ], [ "ETH", [] ], [ "ADA", [] ], [ "DOGE", [] ],
    ]

    function isListed(x){
        for (let i = 0; i < Currencies.length; i++) {
            if (x == Currencies[i][0]) {
                return true
            } 
        }
        return false
    }

    function listConvertions(x,y){
        for (let i = 0; i < Currencies.length; i++) {
            if (x == Currencies[i][0]) {
                Currencies[i][1].push(y)
            } 
        }
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

	//funcion que dibuja los graficos de las criptomonedas teniendo como argumento el tiempo que se desea mostrar
    function GetPriceChart(timeSet){
		// de acuerdo al boton que se eliga aparecera la grafica de acuerdo al tiempo seleccionado
        var buttons = document.getElementsByClassName("TimeButton")
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            console.log(buttons[i])
            button.classList.remove("TBselected");

            if (button.innerHTML == timeSet) {
                button.classList.add("TBselected");
            }
        }

        var timeToRest = 0
        var now = Math.round(Date.now()/1000)

        if (timeSet == "1y") {
            timeToRest = 31536000
        }else if (timeSet == "6m") {
            timeToRest = 15768000
        }else if (timeSet == "3m") {
            timeToRest = 2628288*3
        }else if (timeSet == "1m") {
            timeToRest = 2628288
        }else if (timeSet == "7d") {
            timeToRest = 86400*7
        }else if (timeSet == "24h") {
            timeToRest = 86400
        }else if (timeSet == "All") {
            timeToRest = now
        }

        var fCurrency = Input2.value
        if (fCurrency.toLocaleLowerCase() == "usdt" || fCurrency.toLocaleLowerCase() == "usdc" || fCurrency.toLocaleLowerCase() == "ust"){ fCurrency = "usd" }
        fetch("https://api.coingecko.com/api/v3/coins/"+CurrencyName.toLocaleLowerCase()+"/market_chart/range?vs_currency="+fCurrency.toLocaleLowerCase()+"&from="+(now-timeToRest)+"&to="+now)
        .then(response3 => response3.json())
        .then(data3 => {
            
            document.getElementById('HystoryChart').innerHTML = ""
            var Pdata = []
            var Plabels = []

            for (let i = 0; i < data3.prices.length; i++) {
                Pdata.push(data3.prices[i][1])
                var d = new Date(data3.prices[i][0]); d.getMonth()
                if (timeSet == "24h"){
                    Plabels.push((d.getHours()+1)+":"+d.getMinutes()+" - "+(d.getDate() + 1))
                }else{
                    Plabels.push((d.getDate()+1)+" "+monthNames[d.getMonth()]+" "+d.getFullYear())
                }
            }
			// permite realizar el cambio de tiempo de los graficos de las criptomonedas
            var timeSetted = timeSet
            const ctx = document.getElementById('HystoryChart').getContext('2d');
            if (HystoryChart != null) {
                HystoryChart.destroy();
            }
            HystoryChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Plabels,
                    datasets: [{
                        label: timeSetted+' Price',
                        data: Pdata,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                        ],
                        borderColor: [
                            'rgba(99, 99, 255, 1)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                    }
                }
            });
        });
    }
	// funcion que hace la conversion de la criptomoneda 
    function convert(){
        var cr1 = Input1.value
        currency = Input1.value+"-"+Input2.value
        console.log("currency: "+currency)
        if (Input1.value == Input2.value){
            v2.value = v1.value
        }else{
            fetch('https://api.pro.coinbase.com/products/'+currency+"/ticker")// se obtiene la informacion de la api
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                v2.value = (data.price * parseFloat(v1.value))
                currentConvertionPrice = data.price // luego de realizar los calculos se obtiene el valor convertido

                info.innerHTML = "<strong>Last trade: Ask:</strong> "+data.ask+" <strong>Bid:</strong> "+data.bid+" <strong>Size:</strong> "+data.size+" <strong>Volume:</strong> "+data.volume+" "+ v1input.value

                fetch("https://api.exchange.coinbase.com/currencies/"+cr1)
                .then(response2 => response2.json())
                .then(data2 => {
                    console.log(data2.name)
                    CurrencyName = data2.name
                    CurrentName.innerHTML = CurrencyName +" = "+currentConvertionPrice+" "+Input2.value // se muestra ya el valor convertido
                    CurrentImage.src = 'https://cryptoicon-api.vercel.app/api/icon/'+cr1.toLowerCase()
                    CurrentImage.style.display = ''
                    GetPriceChart("1y")

                });
            });
        }
    }
	//la funcion permite actualizar los datos por si se realiza algun cambio de moneda o criptomoneda
    function update(){
        // console.log(Input1.value)
        v2input.innerHTML = ""
        var l = 0
        for (let i = 0; i < Currencies.length; i++) {
            if (Input1.value == Currencies[i][0]) {
                l = Currencies[i][1].length
                for (let j = 0; j <  Currencies[i][1].length; j++) {
                    v2input.innerHTML += '<option value="'+Currencies[i][1][j]+'" data-thumbnail="https://cryptoicon-api.vercel.app/api/icon/'+Currencies[i][1][j].toLowerCase()+'">'+Currencies[i][1][j]+'</option>'
                }
            }
        }

        document.getElementById("b2").style.height = (35*l)+"px"

        var cryptoArray2 = [];
        var cryptoNames = [];
		// se selecciona la imagen correspondiente a la criptomoneda
        $('.vodiapicker2 option').each(function(){
            var img = $(this).attr("data-thumbnail");
            var text = this.innerText;
            var value = $(this).val();
            var item = '<li><img src="'+ img +'" alt="" value="'+value+'"/><span>'+ text +'</span></li>';
            cryptoArray2.push(item);
            cryptoNames.push(value)
        })

        $('#a2').html(cryptoArray2);
        $('.btn-select2').html(cryptoArray2[0]);
        $('.btn-select2').attr('value', cryptoNames[0]);

        $('#a2 li').click(function(){
            var img = $(this).find('img').attr("src");
            var value = $(this).find('img').attr('value');
            var text = this.innerText;
            var item = '<li><img src="'+ img +'" alt="" /><span>'+ text +'</span></li>';
            $('.btn-select2').html(item);
            $('.btn-select2').attr('value', value);
            $(".b2").toggle();

            convert()
            //console.log(value);
        });

        if (linked == false){
            linked = true
            $(".btn-select2").click(function(){
                console.log("click")
                $(".b2").toggle();
            });
        }

        // var currentConversion = cryptoArray2.indexOf("USD")
        //$('.btn-select2').html(cryptoArray2[0]);
        //$('.btn-select2').attr('value', sessionLang);

        // var sessionLang = localStorage.getItem('lang');
        // if (sessionLang){
        //     //find an item with value of sessionLang
        //     var langIndex = cryptoArray2.indexOf(sessionLang);
        //     $('.btn-select2').html(cryptoArray2[langIndex]);
        //     $('.btn-select2').attr('value', sessionLang);
        // } else {
        //     var langIndex = cryptoArray2.indexOf('ch');
        //     console.log(langIndex);
        //     $('.btn-select2').html(cryptoArray2[langIndex]);
        //     //$('.btn-select').attr('value', 'en');
        // }

        convert()
    }
    function update2(){
        convert()
    }
	// muestra el valor convertido de la criptomoneda
    function updateValue1(){
        if (!parseFloat(v2.value)) {
            v2.value = 1
        }
        v1.value = parseFloat(v2.value) / currentConvertionPrice
    }
    function updateValue2(){
        if (!parseFloat(v1.value)) {
            v1.value = 1
        }
        v2.value = currentConvertionPrice * parseFloat(v1.value)
    }
	// se obtiene la informacion de la api
     fetch('https://api.pro.coinbase.com/products/')
        .then(response => response.json())
        .then(data => {
            mainData = data
            console.log(data)
            for (let i = 0; i < mainData.length; i++) {
                if (!isListed(mainData[i].base_currency)) {
                    Currencies.push([
                        mainData[i].base_currency,
                        []
                    ]) 
                }
                listConvertions(mainData[i].base_currency,mainData[i].quote_currency)
            }

            console.log(Currencies)
            for (let i = 0; i < Currencies.length; i++) {
                v1input.innerHTML += '<option value="'+Currencies[i][0]+'" class="test"  data-thumbnail="https://cryptoicon-api.vercel.app/api/icon/'+Currencies[i][0].toLowerCase()+'"  >'+Currencies[i][0]+'</option>'
            }

            document.getElementById("b").style.height = (35*Currencies.length)+"px"

            var cryptoArray1 = [];
            $('.vodiapicker option').each(function(){
                var img = $(this).attr("data-thumbnail");
                var text = this.innerText;
                var value = $(this).val();
                var item = '<li><img src="'+ img +'" alt="" value="'+value+'"/><span>'+ text +'</span></li>';
                cryptoArray1.push(item);
            })

            $('#a').html(cryptoArray1);
            $('.btn-select').html(cryptoArray1[0]);
            $('.btn-select').attr('value', 'BTC');

            //change button stuff on click
            $('#a li').click(function(){
                var img = $(this).find('img').attr("src");
                var value = $(this).find('img').attr('value');
                var text = this.innerText;
                var item = '<li><img src="'+ img +'" alt="" /><span>'+ text +'</span></li>';
                $('.btn-select').html(item);
                $('.btn-select').attr('value', value);
                $(".b").toggle();

                update()
                //console.log(value);
            });

            $(".btn-select").click(function(){
                    $(".b").toggle();
                });

            //check local storage for the lang
            var sessionLang = localStorage.getItem('lang');
            if (sessionLang){
            //find an item with value of sessionLang
            var langIndex = cryptoArray1.indexOf(sessionLang);
            $('.btn-select').html(cryptoArray1[langIndex]);
            $('.btn-select').attr('value', sessionLang);
            } else {
            var langIndex = cryptoArray1.indexOf('ch');
            console.log(langIndex);
            $('.btn-select').html(cryptoArray1[langIndex]);
            //$('.btn-select').attr('value', 'en');
            }
         

            update()
            updateValue2()
        });
