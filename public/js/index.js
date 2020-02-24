import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'
import { updateSettings } from './updateSettings'

// DOM Element
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')
const updateMe = document.querySelector('.form-user-data')
const userPwdForm = document.querySelector('.form-user-password')

// VALUES


// DELEGATION
if(mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations)
  displayMap(locations)
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const email     = document.getElementById('email').value
    const password  = document.getElementById('password').value  
    login(email,password)
  })
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout)
}

if (updateMe) {
  updateMe.addEventListener('submit',e => {
    e.preventDefault()
    const form = new FormData()
    form.append('name', document.getElementById('name').value)
    form.append('email', document.getElementById('email').value)
    form.append('photo', document.getElementById('photo').files[0])

    console.log(form)

    updateSettings(form, 'data')
  })
}

if (userPwdForm) {
  userPwdForm.addEventListener('submit',async e => {
    e.preventDefault()
    document.querySelector('.btn--save-password').textContent = 'Updating ...'
    const passwordCurrent   = document.getElementById('password-current').value
    const password          = document.getElementById('password').value
    const passwordConfirm   = document.getElementById('password-confirm').value
    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password')

    // On reset les input des password
    document.querySelector('.btn--save-password').textContent = 'Save paswword'
    document.getElementById('password-current').value = ''
    document.getElementById('password').value = ''
    document.getElementById('password-confirm').value = ''
  })
}