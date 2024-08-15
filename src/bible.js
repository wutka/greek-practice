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
       console.log("Random verb: ", this.pickVerb());
    }

    pickVerb(person="", tense="", voice="", mood="", _case="", num="", gender="") {
        const filteredVerbs = [];
        for (const verb of this.verbs) {
            const parsing = verb[PARSING];
            if (person && !person.includes(parsing[0])) continue;
            if (tense && !tense.includes(parsing[1])) continue;
            if (voice && !voice.includes(parsing[2])) continue;
            if (mood && !mood.includes(parsing[3])) continue;
            if (_case && !_case.includes(parsing[4])) continue;
            if (num && !num.includes(parsing[5])) continue;
            if (gender && !gender.includes(parsing[6])) continue;
            filteredVerbs.push(verb);
        }
        return filteredVerbs[Math.floor(filteredVerbs.length * Math.random())];
    }

}

const extractVerbs = verses => {
    const verbs = [];
    for (const book of verses) {
        for (const chapter of book) {
            for (const verse of chapter) {
                for (let i=0; i < verse.length; i++) {
                    const word = verse[i];
                    word.versePos = i;
                    if (word[PART_OF_SPEECH] === "V-") {
                        verbs.push(word);
                    }
                }
            }
        }
    }
    return verbs;
}
