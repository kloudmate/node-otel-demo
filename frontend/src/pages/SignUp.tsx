import Quote from '../components/Quote'
import SignUpForm from '../components/SignUpForm'

const SignUp = () => {
  return (
    <div className='lg:grid grid-cols-2'>
      <div>
        <SignUpForm />
      </div>
      <div className='hidden lg:block'>
        <Quote />
      </div>
    </div>
  )
}

export default SignUp