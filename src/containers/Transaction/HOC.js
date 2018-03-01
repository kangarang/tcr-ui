import React, { Component } from 'react'

const UDappHOC = WrappedComponent => {
  return class UDapp extends Component {
    constructor(props) {
      super(props)

      this.state = {
        fromAddress: false,
        currentMethod: '',
      }
    }

    // componentWillReceiveProps(newProps) {
    //   // console.log('HOC OLD PROPS:', this.props)
    //   // console.log('HOC NEW PROPS:', newProps)
    //   if (newProps.request.get('context').size > 0) {
    //     const listingStr = newProps.request.getIn(['context', 'listing'])
    //     const _pollID = newProps.request.getIn(['context', 'latest', 'pollID'])

    //     this.setState(prevState => ({
    //       ...prevState,
    //       [newProps.actions[0]]: {
    //         ...prevState[newProps.actions[0]],
    //         _listingHash: listingStr,
    //         _data: listingStr,
    //         _pollID,
    //         // _prevPollID,
    //       },
    //     }))
    //   }
    // }

    handleInputChange = async (e, method, input) => {
      const methName = method.name
      const inputName = input.name

      const inputValue = e.target.value

      this.setState(prevState => ({
        ...prevState,
        [methName]: {
          ...prevState[methName],
          [inputName]: inputValue,
        },
        currentMethod: methName,
      }))
    }

    getMethodArgs = method =>
      method.inputs.map(input => this.state[method.name][input.name])

    handleHOCCall = async (e, method, contract) => {
      e.preventDefault()
      const args = await this.getMethodArgs(method)
      this.props.handleCall({ method, contract, args })
    }
    handleHOCSendTransaction = async (e, method, contract) => {
      e.preventDefault()
      const args = this.getMethodArgs(method)
      console.log('this.state', this.state)
      this.props.handleSendTransaction({ method, args, contract, listing: this.state[method.name]._listingHash })
    }

    render() {
      return (
        <WrappedComponent
          hocInputChange={this.handleInputChange}
          hocCall={this.handleHOCCall}
          hocSendTransaction={this.handleHOCSendTransaction}
          currentMethod={this.state.currentMethod}
          {...this.props}
        />
      )
    }
  }
}

export default UDappHOC
