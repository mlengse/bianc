const pptr = require('puppeteer-core')
const waitOpt = {
  waitUntil: 'networkidle2',
  timeout: 0
}

exports.waitOpt = waitOpt      
exports._waitNav = async ({ that }) => await that.page.waitForNavigation(waitOpt)

exports._loginBian = async ({ that }) => {
  let needLogin = await that.page.$('input#username')

  if(needLogin) {
    that.spinner.start('login bian')
    await that.page.waitForSelector('input#username')
    await that.page.type('input#username', that.config.BIAN_USR)
    await that.page.waitForSelector('input#userpassword')
    await that.page.type('input#userpassword', that.config.BIAN_PWD, { delay: 100 })
    await that.page.waitForSelector('button[type="submit"]')
    await that.page.focus('button[type="submit"]')
    await that.page.click('button[type="submit"]')
  }

  let needName = await that.page.$('input#name')

  if(needName) {
    await that.page.waitForSelector('input#name')
    await that.page.type('input#name', that.config.BIAN_NAME)
    await that.page.waitForSelector('input#nik')
    await that.page.type('input#nik', that.config.BIAN_NIK)
    await that.page.waitForSelector('input#phone')
    await that.page.type('input#phone', that.config.BIAN_WA)
    await that.page.waitForSelector('button[type="submit"]')
    await that.page.focus('button[type="submit"]')
    await that.page.click('button[type="submit"]')
  }

    
  await that.page.waitForSelector('input#caribalita')
    

  that.spinner.succeed('logged in')
  

}

exports._isVisible = async ({ that, el }) => {
  return await that.page.evaluate( elem => {
    if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
    const style = getComputedStyle(elem);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    const elemCenter   = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0) return false;
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
    if (elemCenter.y < 0) return false;
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
    let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    do {
        if (pointContainer === elem) return true;
    } while (pointContainer = pointContainer.parentNode);
    return false;
  }, el)
}

exports._findXPathAndClick = async ({ that, xpath }) => {
  that.spinner.start(`findXPathAndClick ${xpath}`)
  let visible = false
  while(!visible){
    for(let el of await that.page.$x(xpath)){
      await that.page.evaluate(e => {
        e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
      }, el);
      visible = await that.isVisible({ el })
      if(visible){
        // await el.focus()
        await el.evaluate( el => el.click())
        break
      }
    }

    await that.page.waitForTimeout(100)
  
  }
  await that.page.waitForTimeout(500)

}

exports._clickBtn = async({ that, text}) => await that.findXPathAndClick({xpath: `//button[contains(., '${text}')]`});

exports._checkNIK = async ({ that, sasaran }) => {
  try{

    await that.page.evaluate( () => document.getElementById("caribalita").value = "")
    await that.page.type('input#caribalita', sasaran.nik)
    await that.clickBtn({ text: 'cari'})

  }catch(e){
    console.error(e)
  }
}

exports._runScript = async ({ that }) => {
  await that.loginBian()
}

exports._initBrowser = async ({ that }) => {
  if(that.init){
    await that.init()
  }
  that.Browser = await pptr.launch({
    headless: false,
    executablePath: `${that.config.CHROME_PATH}`,
    userDataDir: `${that.config.USER_DATA_PATH}`,
  })

  that.pages = await that.Browser.pages()

  that.page = that.pages[0]

  that.page.on('response', async response => {
    if(response && response.request().resourceType() === 'xhr' && response.ok() && (response.url().includes('search'))){
      try {
        let resp = await response.json()
        if(resp && resp.data && resp.data[0]){
          that.response = resp.data[0]
        }
      } catch (e){
        console.error(`process error: ${new Date()} ${JSON.stringify(e, Object.getOwnPropertyNames(e))}`)
      }
      // for(let konter of konters){
      //   console.log(JSON.stringify(konter))
      // }
      // that.response = konters

    }
  })
  
  await that.page.goto(`${that.config.BIAN_URL}/Login`, waitOpt)

  await that.runScript()


}