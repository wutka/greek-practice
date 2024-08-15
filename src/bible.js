export const BOOK = 0;
export const CHAPTER = 1;
export const VERSE = 2;
export const PART_OF_SPEECH = 3;
export const PARSING = 4;
export const TEXT = 5;
export const WORD = 6;
export const NORMALIZED_WORD = 7;
export const LEMMA = 8;

export class Bible {
    constructor(verses) {
        this.verses = verses;
        this.verbs = extractVerbs(verses);
    }
}

const extractVerbs = verses => {
    const verbs = [];
    for (const book of verses) {
        for (const chapter of book) {
            for (const verse of chapter) {
                for (const word of verse) {
                    if (word[PART_OF_SPEECH] === "V-") {
                        verbs.push(word);
                    }
                }
            }
        }
    }
    return verbs;
}