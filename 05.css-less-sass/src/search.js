'use strict'

import React from 'react';
import ReactDom from 'react-dom';

// import './search.css';
import './search.less';

class Search extends React.Component {
  render() {
    return (
      <div className="search-text">Search Text</div>
    );
  }
}

ReactDom.render(
  <Search />,
  document.getElementById('root')
);
