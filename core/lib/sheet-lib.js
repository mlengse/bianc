exports._listSasaran = async ({ that }) =>{

  let ret = await that.listFile({
    SheetID: that.config.BIAN_SHEET
  })

  if(ret.length){
    that.spinner.succeed(`sasaran data found: ${ret.length}`)
    let belum = ret.filter(k => k.validasi_bian && k.validasi_bian.includes('#N/A'))
    if(belum.length){
      that.listBelum = [...belum]
      that.spinner.succeed(`belum bian ${belum.length}`)
    }
    // let kontak = ret.filter(k => !k.status && k.nik)
    // if(kontak.length){
    //   that.listKontak = [...that.listKontak, ...kontak]
    //   that.spinner.succeed(`${file.nama} akan dicek ${kontak.length}`)
    // }
  }


}

exports._inputValidasi =  async ({ that, sasaran }) => {
  let res = await that.insertCell({
    spreadsheetId: sasaran.SheetID,
    range: `${sasaran.sheet}!H${sasaran.row}`,
    values: sasaran.name

  })
  that.spinner.succeed(`${JSON.stringify(sasaran)}, saved ${res.statusText}`)
  return res
}

// exports._insertTiket =  async ({ that, kontak }) => {
//   if(kontak.etiket) {
//     let res = await that.insertCell({
//       spreadsheetId: kontak.SheetID,
//       range: `${kontak.sheet}!C${kontak.row}`,
//       values: kontak.etiket

//     })
//     that.spinner.succeed(`${kontak.id} ${kontak.nik}, ${kontak.nama}, ${kontak.etiket}, saved ${res.statusText}`)
//     return res
//   }
// }

// exports._insertHP =  async ({ that, kontak }) => {
//   if(kontak.no_hp){
//     if(kontak.no_hp[0] !== '0' && kontak.no_hp[0] !== "'"){
//       kontak.no_hp = `'0${kontak.no_hp}`
//     } else if(kontak.no_hp[0] === '0'){
//       kontak.no_hp = `'${kontak.no_hp}`
//     } else if(kontak.no_hp[1] !== '0' && kontak.no_hp[0] === "'"){
//       kontak.no_hp = kontak.no_hp.substring(1)
//       kontak.no_hp = `'0${kontak.no_hp}`
//     }

//     let res = await that.insertCell({
//       spreadsheetId: kontak.SheetID,
//       range: `${kontak.sheet}!D${kontak.row}`,
//       values: `${kontak.no_hp}`

//     })
//     that.spinner.succeed(`${kontak.id} ${kontak.nik}, ${kontak.nama}, ${kontak.no_hp}, saved ${res.statusText}`)
//     return res
//   }
// }

// exports._listKontak =  async ({ that }) => {
//   return await that.listFile({
//     SheetID: that.config.SHEET_ID
//   })

// }

// exports._listSudah =  async ({ that }) => {
//   return await that.listFile({
//     SheetID: that.config.SHEET_ID2
//   })

// }