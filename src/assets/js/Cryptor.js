import CryptoJS from 'crypto-js'
import store from '../../store/index'
export const encryptingFunctions = {
  encrypt (data) {
    let key = localStorage.getItem('publicKey')
    return CryptoJS.AES.encrypt(data, key).toString()
  },
  encryptPassword (password) {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64)
  },
  encryptLogin (data) {
    const privateKey = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.Base64)
    const fullPassword = privateKey + data.password
    store.dispatch('auth/createPublicKey', fullPassword)
    return {
      email: data.email,
      password: privateKey
    }
  },
  encryptRegister (data) {
    const privateKey = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.Base64)
    const publicKey = privateKey + data.password
    store.dispatch('auth/createPublicKey', publicKey)
    return {
      email: data.email,
      password: privateKey,
      passwordHelp: data.passwordHelp,
      username: data.username
    }
  },
  decrypt (data) {
    let key = localStorage.getItem('publicKey')
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8)
  }
}
