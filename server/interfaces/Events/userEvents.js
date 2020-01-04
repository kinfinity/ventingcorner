import EventEmitter from 'events'
import onImage from '../EventListeners/onImage'

// SetUp the various events and listeners 
const userEvents = new EventEmitter()

// SignUp
// userEvent.on('user-registered',onSignUp.user)
userEvents.on('user-ProfileImageUploaded',onImage.User.profileUpdate)

//

export default userEvents