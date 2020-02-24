import axios from 'axios'
import { showAlert } from './alert'

// Type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {

    const url = 
      type === 'password' 
      ? 'http://localhost:8080/api/v1/users/updateMyPassword'
      : 'http://localhost:8080/api/v1/users/updateMe'
    const res = await axios({
      method: 'PATCH',
      url,
      data
    })

    if(res.data.status === 'success') {
      showAlert('success',`Your ${type.toUpperCase()} has been updated`)
    }
  } catch (err) {
    console.log(err.response)
    showAlert('error', err.response.data.message)
  }
}