import * as React from 'react'
import TextInput from '../components/TextInput'
import ClickToDefine from '../components/ClickToDefine'
import Footer from '../components/Footer'
import {word} from '../helpers/types'
import {spellMorphTag} from '../helpers/POSConversionObjects'


type myStates = {
  //Main search is a string so that it can be referenced from a variable
  "mainSearch": string,
  mainSearchWord: word,
  allWordDefinitions: {},
  settings: {
    language: string
  },
  definitionPickerPhase: string,
  definitionPickerWord: word,
  definitionPickerOptionsList: Array<string>,
  definitionPickerMeanings: Array<any>,
  definitionPickerLEI: number,
  definitionPickerEndFunction: any,
  enterToDefine: any
}

type myProps = {}

const emptyWord = {
  word: "",
  spaceBefore: "",
  morphology: {
    tag: 'TAG_UNKNOWN',
    aspect: 'ASPECT_UNKNOWN',
    case: 'CASE_UNKNOWN',
    form: 'FORM_UNKNOWN',
    gender: 'GENDER_UNKNOWN',
    mood: 'MOOD_UNKNOWN',
    number: 'SINGULAR',
    person: 'PERSON_UNKNOWN',
    proper: 'PROPER_UNKNOWN',
    reciprocity: 'RECIPROCITY_UNKNOWN',
    tense: 'TENSE_UNKNOWN',
    voice: 'VOICE_UNKNOWN'
  }
}

export default class DefinitionDissectorMain extends React.Component<myProps, myStates> {
  constructor(props) {
    super(props)
    this.state = {
      mainSearch: "", //what the user types
      mainSearchWord: emptyWord, //converted into word type
      allWordDefinitions: {},
      settings: { 
        language: "en-gb",
      },
      definitionPickerPhase: "sleep",
      definitionPickerWord: emptyWord,
      definitionPickerOptionsList: ["There are not yet any options set"],
      definitionPickerMeanings: [],
      definitionPickerLEI: 0,
      definitionPickerEndFunction: () => {},
      enterToDefine: () => {}
    }
    this.pickDefinition = this.pickDefinition.bind(this)
    this.definitionOptionClicked = this.definitionOptionClicked.bind(this)
  }

  //Receives a state variable name to modify, and changes it to value
  async onChange(stringField: any, value: myStates) {
    const newState = { [stringField]: value } as Pick<myStates, keyof myStates>;
    await this.setState(newState);
    let newWord = {
      word: this.state.mainSearch,
      spaceBefore: "",
      morphology: {
        tag: 'TAG_UNKNOWN',
        aspect: 'ASPECT_UNKNOWN',
        case: 'CASE_UNKNOWN',
        form: 'FORM_UNKNOWN',
        gender: 'GENDER_UNKNOWN',
        mood: 'MOOD_UNKNOWN',
        number: 'NUMBER_UNKNOWN',
        person: 'PERSON_UNKNOWN',
        proper: 'PROPER_UNKNOWN',
        reciprocity: 'RECIPROCITY_UNKNOWN',
        tense: 'TENSE_UNKNOWN',
        voice: 'VOICE_UNKNOWN'
      }
    }
    this.setState({mainSearchWord: newWord})
  }

  setEnterToDefineMethod(enterToDefine: Function) {
    this.setState({enterToDefine: enterToDefine})
  }

  //Receives a state variable name to modify as well as a value, and sends it to onChange
  mainSearchFunction() {
    this.state.enterToDefine()
  }

  definitionPickerBack() {
    switch (this.state.definitionPickerPhase) {
      case "sleep":
        break;
      case "pos":
        this.setState({definitionPickerPhase: "sleep"})
        break;
      case "definition":
        //calling pos phase, setting morphology tag to make sure pos phase doesn't pick pos automatically
        let tempObject = this.state.definitionPickerWord
        tempObject.morphology.tag = "PICK POS MANUALLY"
        this.setState({definitionPickerWord: tempObject})
        this.pickDefinition(this.state.definitionPickerWord, this.state.definitionPickerMeanings, this.state.definitionPickerEndFunction)
        break;
      default:
        this.setState({definitionPickerPhase: "sleep"})
        break;
    }
  }

  pickDefinition(word : word, meanings : Array<any>, endFunction: Function) {
    //Initializing state for new pick definition word
    this.setState({definitionPickerPhase: "pos"})
    this.setState({definitionPickerWord: word})
    this.setState({definitionPickerOptionsList: ["Failed to populate list"]})
    this.setState({definitionPickerEndFunction: endFunction})
    this.setState({definitionPickerMeanings: meanings})
    //comparing parts of speech
    let meaningsIndex;
    //if only one options avoid logic
    if (meanings.length == 1 && word.morphology.tag != "PICK POS MANUALLY") {
      meaningsIndex = 0
    } else {
      for (let i in meanings) {
        if(meanings[i].partOfSpeech.toUpperCase() == spellMorphTag[word.morphology.tag] && meanings[i].definitions != undefined){
          meaningsIndex = i
        }
      }
    }
    //if a POS isn't matched, update the Options List with the available POS list, otherwise move on to phase definition
    if (meaningsIndex == undefined) {
      let tempList = []
      for (let i in meanings) {
        tempList.push(meanings[i].partOfSpeech)
      }
      this.setState({definitionPickerOptionsList: tempList})
    } else {
      this.definitionOptionClicked(meaningsIndex)
    }
    
  }

  definitionOptionClicked(index: number) {
    //phase definition
    if (this.state.definitionPickerPhase == "definition") {
      console.log(this.state.definitionPickerMeanings[this.state.definitionPickerLEI].definitions)
      console.log("index" + index)
      this.state.definitionPickerEndFunction(this.state.definitionPickerMeanings[this.state.definitionPickerLEI].definitions[index].definition)
      this.setState({definitionPickerPhase: "sleep"})
    }
    if (this.state.definitionPickerPhase == "pos") {
      let definitions = this.state.definitionPickerMeanings[index].definitions
      let tempList = []
      for (let a in definitions) {
        tempList.push(definitions[a].definition)
      }
      console.log(tempList)
      this.setState({definitionPickerLEI: index})
      this.setState({definitionPickerOptionsList: tempList})
      this.setState({definitionPickerPhase: "definition"})
    }
  }

  render() {
    const {mainSearchWord, settings, definitionPickerPhase, definitionPickerWord, definitionPickerOptionsList} = this.state
    return(
      <React.Fragment>
        <h2 className="text-capitalize text-center border-bottom pb-2 pt-4">Definition Dissector</h2>
        <div className="d-flex justify-content-center">
          <TextInput 
            title="Search a word to begin dissecting"
            placeholder=""
            stringField="mainSearch"
            onChangeFunction={this.onChange.bind(this)}
            onEnterFunction={this.mainSearchFunction.bind(this)}
          />
        </div>
        <div className="">
          <ClickToDefine 
          word={mainSearchWord}
          definitionPickerFunction={this.pickDefinition.bind(this)} 
          setEnterFunction={this.setEnterToDefineMethod.bind(this)}
          language={settings.language}/>
        </div>
        {definitionPickerPhase != "sleep" ? 
          <div className="definition-picker">
            <h4 className="display-4 text-center border-bottom">{definitionPickerWord.word}</h4>
            <div className="dp-options">
              {definitionPickerOptionsList.map((value, index) => {
                return <div onClick={() => {this.definitionOptionClicked(index)}} className="dpo-item text-center" key={index}>{value}</div>
              })}
              <div className="dpo-item text-center" onClick={() => this.definitionPickerBack()}>&#9664;</div>
            </div>
          </div> : <div></div>}
        <Footer/>
      </React.Fragment>
    )
  }
}
