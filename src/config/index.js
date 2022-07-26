import default_cfg from './default.json';

const config = Object.assign({}, default_cfg);

if (process.env.API_URL) {
  config.portal_api_url = process.env.API_URL;
}

config.get = function get (prop) {
  return this[prop];
};

export default config;
