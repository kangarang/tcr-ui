import find from 'lodash/fp/find'

export const getMethodAbi = async (methodName, abi) => {
  // prettier-ignore
  const methodAbi = find({ 'name': methodName }, abi)
  return methodAbi
}
