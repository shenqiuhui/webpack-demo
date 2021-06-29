'use strict'

import React from 'react';
import ReactDom from 'react-dom';
import share from './images/share.jpg';
import bg from './images/bg.png';

import './search.css';
// import './search.less';
debugger;
class Search extends React.Component {
  render() {
    a = 1;

    return (
      <div className="search-text">
        搜索文字的内容
        <img src={bg} alt="bg" />
        <img src={share} alt="share" />
      </div>
    );
  }
}

ReactDom.render(
  <Search />,
  document.getElementById('root')
);
