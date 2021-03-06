import axios from 'axios'
import { showAlert } from './alert'

export const login = async (email,password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/users/login',
      data: {
        email,
        password
      }
    })

    if(res.data.status === 'success') {
      showAlert('success','You are logged in !')
      window.setTimeout(() => {
        location.assign('/')
      },1500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
  
}

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8080/api/v1/users/logout'
    })
    if (res.data.status === 'success') location.reload(true)
  } catch (err) {
    console.log(err.response)
    showAlert('error','Error loggin out, try again')
  }
}
