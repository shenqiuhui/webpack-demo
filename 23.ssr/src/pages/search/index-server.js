'use strict'
const React = require('react');
const share = require('./images/share.jpg');
const bg = require('./images/bg.png');
const { funcA } = require('./tree-sharking');
const { helloworld } = require('../../common');

require('./search.css');

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      Text: null
    }
  }
  hello() {
    helloworld();
    funcA();

    // if (false) {
    //   funcA();
    // }
  }
  loadComponent() {
    import('./text.js').then((Text) => {
      this.setState({ Text: Text.default });
    });
  }
  render() {
    const { Text } = this.state;
    return (
      <div className="search-text">
        搜索文字的内容
        {Text ? <Text /> : null}
        <img src={bg} alt="bg" onClick={this.loadComponent.bind(this)} />
        <img src={share} alt="share" />
      </div>
    );
  }
}

module.exports = <Search />;
