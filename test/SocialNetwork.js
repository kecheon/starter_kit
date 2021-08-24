const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai').use(require('chai-as-promised')).should()

contract('SocialNetwork', ([deployer, author, tipper]) => {
  let socialNetwork
  before(async () => {
    socialNetwork = await SocialNetwork.deployed()
  })
  describe('deployment', () => {
    it('deployed successfully', async () => {
      const address = await socialNetwork.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has name', async () => {
      const name = await socialNetwork.name()
      assert.equal(name, 'Dapp Univ')
    })
  })

  describe('posts', async () => {
    let result, postCount
    it('creates posts', async () => {
      const result = await socialNetwork.createPost('test post', { from: author })
      postCount = await socialNetwork.postCount()
      assert.equal(postCount, 1)
      const event = result.logs[0].args
      console.log(event)
    })
    it('lists posts', async () => {

    })
    it('allow users to tip posts', async () => {

    })
  })
})