import { authorize, getAuthCode, getUserInfo } from 'zmp-sdk/apis';

export interface ZaloUserInfo {
  zaloId: string;
  zaloName: string;
  zaloAvatar: string;
}

/**
 * Full Zalo Auth Flow (optimized for auth code TTL):
 * 1. authorize() → request all permissions upfront (ONE popup)
 * 2. getUserInfo() → { zaloId, name, avatar } (client-side, direct)
 * 3. getAuthCode() → { authCode, codeVerifier } (LAST — most time-sensitive!)
 * 4. Return immediately to caller → send to backend ASAP
 */
export async function performZaloAuth(): Promise<{
  authCode: string;
  codeVerifier: string;
  userInfo: ZaloUserInfo;
}> {
  // Step 1: Request permission ONCE upfront
  await authorize({
    scopes: ['scope.userInfo'],
  });

  // Step 2: Get user info (permission already granted, no popup)
  const { userInfo } = await getUserInfo({});

  if (!userInfo?.id) {
    throw new Error('ZALO_USER_INFO_EMPTY');
  }

  // Step 3: Get auth code LAST (most time-sensitive — expires quickly!)
  const result = await getAuthCode({});

  if (!result?.authCode) {
    throw new Error('ZALO_AUTH_CODE_EMPTY');
  }

  return {
    authCode: result.authCode,
    codeVerifier: result.authCodeVerify,
    userInfo: {
      zaloId: userInfo.id,
      zaloName: userInfo.name || '',
      zaloAvatar: userInfo.avatar || '',
    },
  };
}


