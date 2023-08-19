import './index.css'

export default function SignupForm() {
    return (
        <div id='signup-form'>
            <form>
            <input
            placeholder='First name'
            />
            <input
            placeholder='Last name'
            />
            <input
            placeholder='Username'
            />
            <input
            placeholder='Email'
            />
            <input
            placeholder='Passowrd'
            />
            <button type='submit'>Sign up</button>
        </form>
        </div>

    )
}
