import EventEmitter from 'events'
import onImage from '../EventListeners/onImage'
import onVent from '../EventListeners/onVent'
import onRant from '../EventListeners/onRant'

// SetUp the various events and listeners 
const ventEvents = new EventEmitter()

//
ventEvents.on('vent-ImagesUploaded',onImage.Vent.imageUpdate)
ventEvents.on('vent-created',onVent.created)
ventEvents.on('vent-deleted',onVent.deleted)
ventEvents.on('delete-rants',onRant.deleteMultiple)

export default ventEvents