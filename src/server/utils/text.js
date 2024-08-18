import fs from 'fs';
import { MessageType } from "../../shared/messageTypes.js";

const dictionary = fs.readFileSync('src/server/assets/russian-nouns.txt', 'utf8')

const isLetter = (char) => {
    if (char.toUpperCase() !== char.toLowerCase()) {
        return true
    }
    return false
}

export const qulifyMessage = (message) => {
    message.trim()

    if (message.length > 20) {
        return MessageType.Common
    }

    const words = message.split(' ')
    if (words.length > 1) {
        return MessageType.Common
    }

    if (message.split('').some((char) => {
        return !isLetter(char)
    })) {
        return MessageType.Common
    }

    if (!dictionary.includes(message)) {
        return MessageType.Common
    }

    return MessageType.Guessing
}

export const findMatches = (word, target) => {
    target = target.trim().toLowerCase()
    word = word.toLowerCase().split('')
    const highlightedWord = []
    let targetWithoutExactMatches = target.split('')
    let wordWithoutExactMatches = word

    word.forEach((char, i) => {
        if (char === target[i]) {
            highlightedWord.push({ char, match: 'exact' })
            targetWithoutExactMatches.splice(i, 1, '')
            return
        } else {
            highlightedWord.push({ char, match: 'not-exact' })
            return
        }
    })

    highlightedWord.forEach((element, i) => {
        if (element.match === 'exact') return

        const matchIndex = targetWithoutExactMatches.indexOf(element.char)
        let match = ''
        if (matchIndex > -1) {
            match = 'weak'
            targetWithoutExactMatches.splice(matchIndex, 1, '')
        } else {
            match = 'not'
        }
        highlightedWord[i].match = match
        return
    })


    return highlightedWord
}