
var player = require('play-sound')(opts = {})

const scraperObject = {
    url: 'https://locate.synlab.it/',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        let input = await page.waitForSelector('input[name="search"]');
        await input.type("Monza");
        await page.waitFor(1000)
        await page.click('select[name=serviceName]');
        await page.waitFor(1000)
        await page.select('select[name=serviceName]', "Tamponi Molecolari Covid 19");
        await page.click("#searchButton")
        await page.waitFor(1000)
        console.log("Looking")
        const res = await page.$$eval("a.list-group-item.list-group-item-action .font-synlab-s",
            elements=> elements.map(item=> {
                const i = item.textContent
                return i
            }))

        const isMatching = matcher(res).some(val=>val!==null)
        if(isMatching){
            player.play('alert.mp3', function(err){
                if (err) throw err
            })
            console.log( "FOUND!!!")
        }
        await page.waitFor(5000)
        browser.close()
    }
}

// Check for nums in dec mins than 30 as day (only first 13 results[nearest])
const matcher = (items) => {
    return items.slice(0,13).map(i=> {
        const onlyNums =i.toString().replace(/\D/g, "")
        console.log("Invalid date: ", onlyNums[2]+onlyNums[3])
        if(onlyNums[2]+onlyNums[3] === "12" && onlyNums[0]+onlyNums[1]<="28"){
            return onlyNums[2]+onlyNums[3]
        }else{
            return null
        }
    })
}

module.exports = scraperObject;