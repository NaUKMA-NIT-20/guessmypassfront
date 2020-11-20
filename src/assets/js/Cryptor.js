import CryptoJS from 'crypto-js'
import store from '../../store/index'
export const encryptingFunctions = {
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
    const username = CryptoJS.AES.encrypt(data.username, publicKey).toString()
    return {
      email: data.email,
      password: privateKey,
      passwordHelp: data.passwordHelp,
      username
    }
  },
  decrypt (data) {
    const key = this.$router.auth.getters.getPublicKey()
    return CryptoJS.AES.decrypt(data, key)
  }
}
