if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const Core = require('./core')
const config = require('./config')

const app = new Core(config)

module.exports = async (isPM2) => {

  try{

    await Promise.all([
      app.listSasaran(),
      app.initBrowser()
    ])

    for(sasaran of app.listBelum){
      sasaran = Object.assign({}, sasaran, app.verifynik(sasaran.nik))
      if(!sasaran.salah){
        await app.checkNIK({sasaran})

        if(app.response && app.response.nik === sasaran.nik){
          sasaran = Object.assign({}, sasaran, app.response, {
            validasi_bian: sasaran.name
          })
        }

        if(sasaran.validasi_bian !== '#N/A'){
          await app.inputValidasi({sasaran})
        }
  
      }

    }

    await app.close(isPM2)

    console.log(`scheduled appsheet process done: ${new Date()}`)
  }catch(e){
    console.error(`process error: ${new Date()} ${JSON.stringify(e, Object.getOwnPropertyNames(e))}`)
  }
}