import EventEmitter from 'events'
import onImage from '../EventListeners/onImage'
import onVent from '../EventListeners/onVent'
import onRant from '../EventListeners/onRant'

// SetUp the various events and listeners 
const ventEvents = new EventEmitter()

//
ventEvents.on('bind-to-category',onVent.addToCategory)
ventEvents.on('bind-to-user',onVent.addToUser)
ventEvents.on('remove-from-category',onVent.removeFromCategory)
ventEvents.on('remove-from-user',onVent.removeFromUser)
ventEvents.on('on-delete',onVent.delete)

export default ventEvents