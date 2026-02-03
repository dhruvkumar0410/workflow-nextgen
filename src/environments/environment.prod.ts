import packageInfo from '../../package.json';

export const environment = {
  // for accessing version from package.json
  version: packageInfo.version,

  production: true,
  log: false,
  flags: {
    useNewHeader: false
  },

  // Data Encription
  requestDataEncription: true,
  responseDataEncription: true,

  // Data Encription/ Decryption Secret Key & Id
  secretKey:'',
  
  // BASE URLs for Application & APIs
  appBaseURL: '',
  apiBaseUrl: '',

  // BASE URLs && SSO ACCESS DETAILS
  ssoLoginUrl: '',
  ssoLoginStaticKey: ''
};