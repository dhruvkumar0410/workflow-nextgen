import packageInfo from '../../package.json';

export const environment = {
  // for accessing version from package.json
  version: packageInfo.version,

  production: false,
  log: true,
  flags: {
    useNewHeader: true
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