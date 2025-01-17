import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {
  render() {
    return (
      <div className="row">
        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
          <div className="content mr-auto ml-auto">
            <br />
            <form onSubmit={ (event) => {
              event.preventDefault();
              const content = this.postContent.value;
              this.props.createPost(content);
            }}>
              <div className="form-group mr-sm-2">
                <input
                  id="postContent"
                  type="text"
                  ref={ (input) => { this.postContent = input }}
                  className="form-control"
                  placeholder="Write something on blockchain..."
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Send</button>
            </form>
            <br />

            { this.props.posts.map((post, key) => {
                return(
                  <div className="card mb-4" key={key}>
                    <div className="card-header">
                      <img className="ml-2"
                        width='30'
                        height='30'
                        src={`data:image/png;base64, ${ new Identicon(post.author, 20).toString() }`}
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
                        <button className="btn btn-link btn-sm float-right pt-0"
                          onClick={ async (event) => {
                            let tipAmount = await window.web3.utils.toWei('0.1', 'Ether');
                            this.props.tipPost(post.id, tipAmount);
                          }} 
                        >
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
    );
  }
}

export default Main;