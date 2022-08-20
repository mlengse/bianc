exports.verifynik = nik => {
  if(nik){
    nik = nik.replace(/\D/g,'')
    let salah
    if(nik.length !== 16){
      salah = 'NIK tidak 16 digit'
    }
    if( nik.slice(-4) === '0000' ){
      salah = 'NIK akhiran 0000'
    }
    return {nik, salah }
  
  }
  return {
    salah: 'NIK tidak ada'
  }
}