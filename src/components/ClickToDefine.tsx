import {useState, useEffect, Fragment} from 'react'
import * as React from 'react'
import axios from 'axios'

interface myProps {
  word: word,
  definitionPickerFunction: Function,
  setEnterFunction: Function,
  language: string
}

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



function ClickToDefine({word, language, definitionPickerFunction, setEnterFunction}: myProps) {
  const [isDefined, setIsDefined] = useState<boolean>(false)
  const [definition, setDefinition] = useState<Array<word>>([])

  useEffect(() => {
    setEnterFunction(defineWord.bind(this))
  }, [word])

  //reset definition if parent word changes
  useEffect(() => {
    setDefinition([])
    setIsDefined(false)
  }, [word.word])

  let defineWord = async () => {
    //turning singular if plural
    let cleanedWord = makeWordSingular(word)
    //getting dictionary definition info
    try {
      var dictionaryRes = await axios.get('api/dictionary/', {
        params: {
          word: cleanedWord.word,
          language: language
        }
      })
      console.log(dictionaryRes)
    } catch (err) {
      console.error(err)
    }
    //setting meanings if dictionaryRes got set, then moving to next phase
    if(dictionaryRes != undefined){
      let meanings = dictionaryRes.data[0].meanings
      //looping through meanings to match Part of Speech
      definitionPickerFunction(word, meanings, morphToDefinition)
    } else if(cleanedWord.word.slice(cleanedWord.word.length-1) == 's' && cleanedWord.morphology.number != 'PLURAL'){
      //checking if a word is plural but maybe not recognized as plural
      cleanedWord.morphology.number = "PLURAL"
      defineWord()
    } else{
      console.log("Couldn't retrieve information for the word " + word.word)
    }
  }

  function makeWordSingular(word) {
    let newWord = word;
    if(word.morphology.number == 'PLURAL') {
      if(!(word.word.slice(word.word.length-3) == 'ies')) {
        newWord.word = word.word.slice(0, -1)
      } else {
        newWord.word = word.word.slice(0, -3) + "y"
      }
    }
    return newWord
  }

  async function morphToDefinition(chosenDefinition) {
    //getting morphology info and organizing it into definition state variable
    let morphologyRes = await axios.get('api/morphology/', {
      params: {
        text: chosenDefinition
      }
    })
    morphologyRes.data = trimDefinitionData(morphologyRes.data)
    setDefinition(morphologyRes.data)
    //showing definition
    setIsDefined(true)
  }

  let trimDefinitionData = (data) => {
    //trimming a or an off of the beginning
    return data;
  }

  function isThereSpaceBefore(value, index) {
    let noSpaceIfAfter : Array<string> = ['-', '(']
    //punctuations always have no space before
    if (value.morphology.tag == "PUNCT" && value.word != '(') {
      return ""
    }
    //first value copies space before, other values check for hyphens before and if its there no space
    if (index == 0) {
      return word.spaceBefore
    } else {
      for (let symbol in noSpaceIfAfter) {
        if (definition[index-1].word == noSpaceIfAfter[symbol] ) {
          return ""
        }
      }
    }
    return " "
  }

  return (
    <Fragment>
      {
        isDefined ? 
        <span>
          <span className="definition-group">
          {
            definition.map((value, index) => {
              return <ClickToDefine 
              key={index} 
              word={{
                word: value.word,
                morphology: value.morphology,
                spaceBefore: isThereSpaceBefore(value, index),
              }} 
              definitionPickerFunction={definitionPickerFunction} 
              setEnterFunction={(literallyNothing) => {}}
              language={language}/>
            })
          }
          </span>
          <span className="group-bar"></span>
        </span> : 
        <span className="" onClick={defineWord}>{word.spaceBefore}{word.word}</span>
      }
    </Fragment>
  )
}

ClickToDefine.displayName = "Click To Define"

export default ClickToDefine