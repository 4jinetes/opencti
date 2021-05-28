import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import CssBaseline from '@material-ui/core/CssBaseline';
import { QueryRenderer } from '../relay/environment';
import { ConnectedThemeProvider } from '../components/AppThemeProvider';
import { ConnectedIntlProvider } from '../components/AppIntlProvider';
import Login from './components/Login';

const rootPublicQuery = graphql`
  query RootPublicQuery {
    settings {
      platform_theme
      platform_login_message
      platform_providers {
        name
        type
        provider
      }
      ...AppThemeProvider_settings
      ...AppIntlProvider_settings
    }
  }
`;

const Root = () => (
  <QueryRenderer
    query={rootPublicQuery}
    variables={{}}
    render={({ props }) => {
      if (props && props.settings) {
        return (
          <ConnectedThemeProvider settings={props.settings}>
            <CssBaseline />
            <ConnectedIntlProvider settings={props.settings}>
              <Login settings={props.settings} />
            </ConnectedIntlProvider>
          </ConnectedThemeProvider>
        );
      }
      return <div />;
    }}
  />
);

export default Root;
