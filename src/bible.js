export const BOOK = 0;
export const CHAPTER = 1;
export const VERSE = 2;
export const PART_OF_SPEECH = 3;
export const PARSING = 4;
export const TEXT = 5;
export const WORD = 6;
export const NORMALIZED_WORD = 7;
export const LEMMA = 8;

const books = [ "", "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
    "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians",
    "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
    "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter",
    "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"];

export class Bible {
    constructor(verses) {
       this.verses = verses;
       this.parsings = extractParsings(verses);
    }

    computeAllowableParsings(settings) {
        const allowable = {}
        for (const parsing of Object.keys(this.parsings)) {
            let valid = true;
            for (let i=0; i < 7; i++) {
                if (parsing[i] !== "-" && !settings[i][parsing[i]]) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                allowable[parsing] = Object.keys(this.parsings[parsing]).length;
            }
        }
        return allowable;
    }

    chooseRandomWord(allowableParsings) {
        if (!allowableParsings) {
            return null;
        }
        let numWords = 0;
        for (const parsing of Object.keys(allowableParsings)) {
            numWords += allowableParsings[parsing];
        }
        let randomWord = Math.floor(numWords * Math.random());
        for (const parsing of Object.keys(allowableParsings)) {
            if (randomWord >= allowableParsings[parsing]) {
                randomWord -= allowableParsings[parsing];
            } else {
                const lemmas = Object.keys(this.parsings[parsing]);
                const randomLemma = lemmas[Math.floor(lemmas.length * Math.random())];
                const words = this.parsings[parsing][randomLemma];
                const word = words[Math.floor(words.length * Math.random())];
                const verse = this.verses[word[BOOK]-1][word[CHAPTER]-1][word[VERSE]-1];
                const result =  { book: books[word[BOOK]], chapter: word[CHAPTER], verseNumber: word[VERSE],
                    verseWords: verse,
                    targetWord: word }
                return result;
            }
        }
    }
}

const extractParsings = verses => {
    const parsings = {};
    for (const book of verses) {
        for (const chapter of book) {
            for (const verse of chapter) {
                for (let i=0; i < verse.length; i++) {
                    const word = verse[i];
                    if (word[PART_OF_SPEECH] !== "V-") {
                        continue;
                    }
                    const key = word[PARSING];
                    word.versePos = i;
                    let parsingsKey = parsings[key];
                    if (!parsingsKey) {
                        parsingsKey = {}
                        parsings[key] = parsingsKey;
                    }
                    let byLemma = parsingsKey[word[LEMMA]];
                    if (!byLemma) {
                        byLemma = []
                        parsingsKey[word[LEMMA]] = byLemma;
                    }
                    byLemma.push(word);
                }
            }
        }
    }
    return parsings;
}
