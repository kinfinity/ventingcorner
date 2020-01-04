import EventEmitter from 'events'
import onComment from '../EventListeners/onComment'

// SetUp the various events and listeners 
const commentEvents = new EventEmitter()

//
commentEvents.on('comment-created',onComment.created)
commentEvents.on('comment-deleted',onComment.deleted)


export default commentEvents