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
  requestEncryption: true,
  responseEncryption: true,
  encryptionMethod: 'CUSTOM', //AES OR ECDH

  // Data Encription/ Decryption Secret Key & Id
  secretKey:'62d0e54805b651c76f2aabc2d84256be',
  
  // BASE URLs for Application & APIs
  appBaseURL: 'https://workmate-uat.mappls.com/workflow-nextgen/',
  apiBaseUrl: '',
  servicePHPURL: 'https://workflow.mappls.com/workflow_admin_proxy/service.php',

  // BASE URLs && SSO ACCESS DETAILS
  ssoLoginUrl: '',
  ssoLoginStaticKey: ''
};