'use strict'

import React from 'react';
import ReactDom from 'react-dom';

class Search extends React.Component {
  render() {
    return (
      <div>Search Text</div>
    );
  }
}

ReactDom.render(
  <Search />,
  document.getElementById('root')
);
