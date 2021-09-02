import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Identicon from 'identicon.js';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web4) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('No ethereum browser detected')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    // to get post data we need Network ID, Address, ABI
    const networkId = await web3.eth.net.getId();
    const networkData = SocialNetwork.networks[networkId];
    if (networkData) {
      const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address);
      this.setState({ socialNetwork });
      const postCount = await socialNetwork.methods.postCount().call();
      this.setState({ postCount });
      // input id of mapping posts starts from 1 not 0
      let i = 1;
      while (i <= postCount) {
        const post = await socialNetwork.methods.posts(i).call();
        this.setState({
          posts: [...this.state.posts, post]
        })
        i++;
      }
      console.log({ posts: this.state.posts });
    } else {
      window.alert("SocialNetwork contract is not deployed to this network");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: []
    }
  }

  render() {
    return (
      <div>
        <div className="container-fluid mt-5">
          <Navbar account={this.state.account} />
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
              <div className="content mr-auto ml-auto">
                { this.state.posts.map((post, key) => {
                    return(
                      <div className="card mb-4" key={key}>
                        <div className="card-header">
                          <img className="ml-2"
                            width='30'
                            height='30'
                            src={`data:image/png;base64, ${ new Identicon(this.state.account, 20).toString() }`}
                            alt="avatar"
                          />
                          <small className="text-muted">{ post.author }</small>
                        </div>
                        <ul id="postList" className="list-group list-group-flush">
                          <li className="list-group-item">
                            { post.content }
                          </li>
                          <li key={key} className="list-group-item py-2">
                            <small className="float-eft mt-1 text-muted">
                              TIPS: { window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                            </small>
                            <button className="btn btn-link btn-sm float-right pt-0">
                              <span>
                                TIP 0.1 ETH
                              </span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    )
                  })
                }
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
