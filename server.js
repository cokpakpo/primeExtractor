const express = require('express')
const app = express()
const puppeteer = require('puppeteer')
const fs = require('fs')


app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    //Execute extraction here
    res.send('working...')
})


function isPrime(_n)
{
 var _isPrime=true;
 var _sqrt=Math.sqrt(_n);
 for(var _i=2;_i<=_sqrt;_i++)
  if((_n%_i)==0) _isPrime=false;
 return _isPrime;
}



// app.get('/extract', (req, res) => {
//     console.log('Welcome to extractor')
//     var i = 70000000
//     var _n=i + 80000000;
//     var primeNumbers="";
//     for(;i<_n;++i){
//         if(isPrime(i)){
//              primeNumbers += i.toString()+"\n";
            
//         }
//     } 
//     fs.appendFile('prime.txt' + _n, primeNumbers, (err)=>{
//         if(err) throw err
//         // console.log('Saved files...', primeNumbers) 
//     })
//     res.send("Extraction completed")
// })


app.get('/extract', (req, res) => {
    console.log('Extractor running...')
    const extract =  () => { 
            new Promise(async (resolve, reject) => {
                try {
                    const url = "http://compoasso.free.fr/primelistweb/page/prime/liste_online_en.php"
                    const browser = await puppeteer.launch({
                        // headless:false,
                        // args: [ '--disable-web-security', '--window-size=1920x1080']
                    })
                    const page = await browser.newPage()
                    await page.goto(url, {timeout:0})
                    await page.evaluate(() => {
                       document.getElementsByName("numberInput")[0].value = 36212497;
                       document.getElementsByName("primePageInput")[0].value = 600
                        let k = document.getElementsByName('firstButton')[0]
                         k.click()
                        return 
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    await page.waitFor(1000)
                    
                    for(let i = 0; i < 80000; i++){
                        await page.waitFor(2000)
                        await page.waitForSelector('input[value="next page"]', {timeout:0})
                        let primeNumbers = await page.evaluate(() => {
                            let data = document.getElementsByTagName('td')
                            let value = []
                            for(let i = 7; i < data.length; i++){
                                value.push(data[i].textContent) 
                            }
                            return value
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        if(primeNumbers){
                            let digitLength = primeNumbers[9].length
                            let file = `primes/${digitLength}DigitsPrime.txt`
                            fs.appendFile(file, primeNumbers, (err)=>{
                                if(err) throw err
                                console.log(primeNumbers.length)
                                console.log('Saved files...', primeNumbers[589])
                            })
                           await page.evaluate(() => {
                                let next = document.getElementsByName('nextButton')[0]
                                next.click()
                                return next
                            }) 
                        }
                       
                    }
                    browser.close()
                    resolve()
                }
                catch(err){
                    console.log(err)
                    reject()
                }
        })
    }
    extract()
    res.send('Extraction Completed')
})

app.listen(2222, () => {
    console.log('Extractor App running on port 2222')
})