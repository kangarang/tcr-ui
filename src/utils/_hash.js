import utils from 'ethers/utils'

const _hash = {
  getVoteSaltHash: (vote, salt) =>
    utils.solidityKeccak256(['uint', 'uint'], [vote, salt]),

  getListingHash: listing => utils.solidityKeccak256(['string'], [listing]),
}

export default _hash
