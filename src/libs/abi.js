import find from 'lodash/fp/find'

// prettier-ignore
export const getMethodAbi = (methodName, abi) => find({ 'name': methodName }, abi)
