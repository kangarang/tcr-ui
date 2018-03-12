import abi from 'ethereumjs-abi'

const _hash = {
  getVoteSaltHash: (vote, salt) =>
    `0x${abi.soliditySHA3(['uint', 'uint'], [vote, salt]).toString('hex')}`,

  getListingHash: listing =>
    `0x${abi.soliditySHA3(['string'], [listing]).toString('hex')}`,
}

export default _hash
