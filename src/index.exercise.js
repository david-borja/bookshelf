// 🐨 you'll need to import react and createRoot from react-dom up here
import '@reach/dialog/styles.css'
import React from 'react'
import { Logo } from 'components/logo'
import { createRoot } from 'react-dom/client'
import Dialog from '@reach/dialog'

// 🐨 you'll also need to import the Logo component from './components/logo'

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

function LoginForm({ onSubmit, buttonText }) {
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password } = event.target.elements


    onSubmit({
      username: username.value,
      password: password.value
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='username'>Username</label>
        <input id="username" type="text" />
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input id="password" type="password" />
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  )
}

const App = () => {
  const [openModal, setOpenModal] = React.useState('none')

  const handleLogin = () => {
    setOpenModal('login')
  }

  const handleRegister = () => {
    setOpenModal('register')
  }

  const handleClose = () => {
    setOpenModal('none')
  }

  const login = (formData) => {
    console.log(formData)
  }

  const register = (formData) => {
    console.log(formData)
  }

  return (
    <>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>
        <button onClick={handleRegister}>Register</button>
      </div>
      <Dialog aria-label='Login form' isOpen={openModal === 'login'}>
        <div>
          <button onClick={handleClose}>Close</button>
        </div>
        <h3>Login</h3>
        <LoginForm onSubmit={login} buttonText="Login" />
      </Dialog>
      <Dialog aria-label='Registration form' isOpen={openModal === 'register'}>
        <div>
          <button onClick={handleClose}>Close</button>
        </div>
        <h3>Register</h3>
        <LoginForm onSubmit={register} buttonText="Register" />
      </Dialog>
    </>
  )
}
const root = createRoot(document.getElementById('root'))
root.render(<App />)
// 🐨 use createRoot to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
