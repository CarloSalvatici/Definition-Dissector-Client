import * as React from 'react'

type MyProps = {
  title: string,
  stringField: string,
  placeholder: string,
  onChangeFunction: (stringField, value) => {}
  onEnterFunction: () => {}
}

class TextInput extends React.Component<MyProps> {
  constructor(props) {
    super(props)

    this.onInputChange = this.onInputChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
  }

  onInputChange (e) {
    this.props.onChangeFunction([this.props.stringField], e.target.value)
  }

  onEnter(e) {
    if(e.key === 'Enter') {
      this.props.onEnterFunction()
    }
  }

  render() {
    return(
      <div>
        <div className="text-center my-1">{this.props.title}</div>
        <input className="form-control" type="text" placeholder={this.props.placeholder}
        onChange={this.onInputChange} onKeyDown={this.onEnter} autoFocus/>
      </div>
    )
  }
}

export default TextInput