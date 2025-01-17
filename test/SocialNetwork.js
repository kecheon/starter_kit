const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai').use(require('chai-as-promised')).should()

contract('SocialNetwork', ([deployer, author, tipper, somebody]) => {
  let socialNetwork
  console.log(somebody)
  console.log(author)
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
    before(async () => {
      result = await socialNetwork.createPost('test post', { from: author })
      postCount = await socialNetwork.postCount()
    })

    it('creates posts', async () => {
      assert.equal(postCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id, postCount.toNumber(), 'id ok')
      assert.equal(event.content, 'test post', 'content ok')
      assert.equal(event.tipAmount, 0, 'tip amount ok')
      assert.equal(event.author, author, 'author ok')
      // console.log(event)
      // if content is empty
      await socialNetwork.createPost('', { from: author }).should.be.rejected;
    })

    it('lists posts', async () => {
      const post = await socialNetwork.posts(postCount)
      assert.equal(post.id, postCount.toNumber(), 'id ok')
      assert.equal(post.content, 'test post', 'content ok')
      assert.equal(post.tipAmount, 0, 'tip amount ok')
      assert.equal(post.author, author, 'author ok')
    })

    it('allows users to tip posts', async () => {
      let startBalance
      startBalance = await web3.eth.getBalance(author)
      startBalance = new web3.utils.BN(startBalance)

      result = await socialNetwork.tipPost(postCount, {
        from: tipper,
        value: web3.utils.toWei('1', 'Ether')
      })
      const event = result.logs[0].args
      assert.equal(event.id, postCount.toNumber(), 'id ok')
      assert.equal(event.content, 'test post', 'content ok')
      assert.equal(event.tipAmount, '1000000000000000000', 'tipAmount ok')
      assert.equal(event.author, author, 'author ok')

      let endBalance
      endBalance = await web3.eth.getBalance(author)
      endBalance = new web3.utils.BN(endBalance)

      let tipAmount
      tipAmount = web3.utils.toWei('1', 'Ether')
      tipAmount = new web3.utils.BN(tipAmount)
      const expectedBalance = startBalance.add(tipAmount)
      assert.equal(endBalance.toString(), expectedBalance.toString())

      await socialNetwork.tipPost(99, {
        from: tipper,
        value: web3.utils.toWei('1', 'Ether')
      }).should.be.rejected;
    })
  })
})