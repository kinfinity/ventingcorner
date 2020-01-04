import EventEmitter from 'events'
import onImage from '../EventListeners/onImage'

// SetUp the various events and listeners 
const categoryEvents = new EventEmitter()

// SignUp
//* userEvent.on('user-registered',onSignUp.user)
categoryEvents.on('category-ImageUploaded',onImage.category.imageUpdate)

//

export default categoryEvents