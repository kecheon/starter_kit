import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';
import Main from './Main';

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
      this.setState({ loading: false });
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
      posts: [],
      loading: true
    }
  }

  render() {
    return (
      <div>
        <div className="container-fluid mt-5">
          <Navbar account={ this.state.account } />
          { this.state.loading
            ? <div id="loading" className="text-center mt-5"> Loading... </div>
            : <Main posts={ this.state.posts }/>
          }
        </div>
      </div>
    );
  }
}

export default App;
