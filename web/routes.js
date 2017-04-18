/**
 * Created by liyanjie on 2017/4/16.
 */

import React from 'react';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';

import App from './containers/App/App';
import Jsondiff from './containers/Jsondiff/Jsondiff';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

export default (
  <Router history={appHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={App} />
    </Route>
    <Route path="/jsondiff" component={Jsondiff}>
      <IndexRoute component={Jsondiff} />
    </Route>
  </Router>
);
