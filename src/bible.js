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

export const parsingCategories = [
    {
        category: "Voice", items: [
            {id: "active", label: "Active"},
            {id: "middle", label: "Middle"},
            { id: "passive", label: "Passive"},
        ]},
    { category: "Tense", items: [
            { id: "present", label: "Present"},
            { id: "imperfect", label: "Imperfect"},
            { id: "future", label: "Future"},
            { id: "aorist", label: "Aorist"},
            { id: "perfect", label: "Perfect"},
            { id: "pluperfect", label: "Pluperfect"},
        ]},
    { category: "Mood", items: [
            { id: "indicative", label: "Indicative"},
            { id: "imperative", label: "Imperative"},
            { id: "subjunctive", label: "Subjunctive"},
            { id: "optative", label: "Optative"},
            { id: "infinitive", label: "Infinitive"},
            { id: "participle", label: "Participle"},
        ]},
    { category: "Person", items: [
            {id: "first", label: "First"},
            {id: "second", label: "Second"},
            {id: "third", label: "Third"},
        ]
    },
    { category: "Number", items: [
            { id: "singular", label: "Singular"},
            { id: "plural", label: "Plural"},
        ]},
    { category: "Case", items: [
            { id: "nominative", label: "Nominative"},
            { id: "accusative", label: "Accusative"},
            { id: "genitive", label: "Genitive"},
            { id: "dative", label: "Dative"},
        ]},
    { category: "Gender", items: [
            { id: "masculine", label: "Masculine"},
            { id: "feminine", label: "Feminine"},
            { id: "neuter", label: "Neuter"},
        ]}
];

export const parsingCategoryLetters = {
    "active": { code: "A", offset: 2 },
    "middle": { code: "M", offset: 2 },
    "passive": { code: "P", offset: 2 },
    "present": { code: "P", offset: 1},
    "imperfect": { code: "I", offset: 1},
    "future": { code: "F", offset: 1},
    "aorist": { code: "A", offset: 1},
    "perfect": { code: "X", offset: 1},
    "pluperfect": { code: "Y", offset: 1},
    "indicative": { code: "I", offset: 3},
    "imperative": { code: "D", offset: 3},
    "subjunctive": { code: "S", offset: 3},
    "optative": { code: "O", offset: 3},
    "infinitive": { code: "N", offset: 3},
    "participle": { code: "P", offset: 3},
    "first": { code: "1", offset: 0},
    "second": { code: "2", offset: 0},
    "third": { code: "3", offset: 0},
    "singular": { code: "S", offset: 5},
    "plural": { code: "P", offset: 5},
    "nominative": { code: "N", offset: 4},
    "accusative": { code: "A",offset: 4},
    "genitive": { code: "G",offset: 4},
    "dative": { code: "D",offset: 4},
    "masculine": { code: "M", offset: 6},
    "feminine": { code: "F", offset: 6},
    "neuter": { code: "N", offset: 6},
}
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
