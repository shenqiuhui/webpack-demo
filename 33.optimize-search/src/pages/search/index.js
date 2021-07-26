'use strict'

import React from 'react';
import ReactDom from 'react-dom';
import share from './images/share.jpg';
import bg from './images/bg.png';
import { funcA } from './tree-sharking';
import { helloworld } from '../../common';

import 'babel-polyfill';

import './search.css';
// import './search.less';

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      Text: null
    }
  }
  // a()
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

ReactDom.render(
  <Search />,
  document.getElementById('root')
);
