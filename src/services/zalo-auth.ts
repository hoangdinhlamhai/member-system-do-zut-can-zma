import { authorize, getAuthCode } from 'zmp-sdk/apis';

/**
 * Request user permission cho userInfo + phoneNumber
 */
export async function requestZaloPermissions(): Promise<void> {
  await authorize({
    scopes: ['scope.userInfo', 'scope.userPhonenumber'],
  });
}

/**
 * Social API v4 Flow:
 * 1. Request permissions
 * 2. getAuthCode() → { authCode, authCodeVerify (= codeVerifier) }
 * 3. Gửi authCode + codeVerifier lên backend để exchange token
 */
export async function performZaloAuth(): Promise<{
  authCode: string;
  codeVerifier: string;
}> {
  // Step 1: Request permissions
  await requestZaloPermissions();

  // Step 2: Get auth code + code verifier (PKCE)
  const result = await getAuthCode({});
  
  if (!result?.authCode) {
    throw new Error('ZALO_AUTH_CODE_EMPTY');
  }

  return {
    authCode: result.authCode,
    codeVerifier: result.authCodeVerify,
  };
}
