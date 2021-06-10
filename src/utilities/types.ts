interface word {
  word: string,
  spaceBefore: string,
  morphology: {
    tag: string,
    aspect: string,
    case: string,
    form: string,
    gender: string,
    mood: string,
    number: string,
    person: string,
    proper: string,
    reciprocity: string,
    tense: string,
    voice: string
  }
}

export {
  word
}