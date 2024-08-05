import EventEmitter from 'events';


const emmiter = new EventEmitter()

emmiter.once('1', () => {
    console.log('1');
})

emmiter.once('1', () => {
    console.log('2');
})

emmiter.emit('1')
emmiter.emit('1')

console.log('started');