import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';

import { App } from './app';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Helmet
      base={{ href: '/' }}
      title="Rock`n`Block"
      meta={[
        { charSet: 'utf-8' },
        { content: 'index, nofollow', name: 'robots' },
        { content: 'width=device-width, initial-scale=1', name: 'viewport' },
        { name: 'description', content: 'Project description' },
        { content: 'ie=edge', httpEquiv: 'x-ua-compatible' },
        { name: 'twitter:card', content: 'summary' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:creator', content: '@rocknblock' },
        { name: 'twitter:site', content: 'https://rocknblock.io/' },
        { name: 'twitter:url', content: 'https://rocknblock.io/' },
        { name: 'twitter:image', content: 'https://rocknblock.io/img/share.png' },
        { name: 'twitter:title', content: 'Rock`n`Block Website' },
        { name: 'twitter:description', content: 'Project description' },
        { property: 'og:url', content: 'https://rocknblock.io/' },
        { property: 'og:image', content: 'https://rocknblock.io/img/share.png' },
        { property: 'og:title', content: 'Rock`n`Block Website' },
        { property: 'og:description', content: 'Project description' },
      ]}
    />
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
