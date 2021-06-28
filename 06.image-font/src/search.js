'use strict'

import React from 'react';
import ReactDom from 'react-dom';
import share from './images/share.jpg';
import bg from './images/bg.png';

// import './search.css';
import './search.less';

class Search extends React.Component {
  render() {
    return (
      <div className="search-text">
        搜索文字
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
