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
  ssoLoginUrl: 'https://outpost.mappls.com/api/security/v4.0.0/oauth/token?grant_type=refresh_token&client_id=',
  ssoLoginStaticKey: 'Kz3TUIj7YQ',

  // Workflow CI & CS
  workflowCI: '33OkryzDZsIwX3v4wJX786hK2LZgr6rs4Q3RlFTD4vPhE8jXYz-6LIit8sEFbdZZYHaAFqjX51wsWLiQ20vFsA==',
  workflowCS: 'lrFxI-iSEg_FgOqxsLkzOcyCAY2G3uSKZlx1umf26Uf5xKmXh4SFwWr1jIkIyU5hmYWD70381K_HD0Mnm6OoeZdQA3LqWnP2'
};