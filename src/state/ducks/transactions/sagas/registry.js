export function* registryTxnSaga(action) {
  try {
    const registry = yield select(selectRegistry)
    const { methodName } = action.payload

    // typecheck arguments
    const args = action.payload.args.map(arg => {
      if (_.isObject(arg)) {
        return arg.toString()
      } else if (_.isString(arg)) {
        return arg
      }
      // TODO: more typechecking
      return arg
    })

    let finalArgs = _.clone(args)

    if (methodName === 'apply') {
      const fileHash = yield call(ipfsAddData, {
        id: args[0], // listing string (name)
        data: args[2], // data (address)
      })
      // const isSuccess = flow(get('status'), isEqual(200))
      // isSuccess(fileHash)
      // hash the string
      finalArgs[0] = getListingHash(args[0])
      // use ipfs CID as the _data field in the application
      finalArgs[2] = fileHash
    }

    console.log('finalArgs', finalArgs)

    yield call(sendTransactionSaga, registry, methodName, finalArgs)
  } catch (error) {
    console.log('registryTxn error', error)
  }
}
