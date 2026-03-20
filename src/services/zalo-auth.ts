import { authorize, getAccessToken, getPhoneNumber, getSetting } from 'zmp-sdk/apis';

/**
 * Check xem user đã grant permission chưa
 */
export async function checkZaloPermissions(): Promise<{
  userInfo: boolean;
  phoneNumber: boolean;
}> {
  try {
    const settings = await getSetting();
    return {
      userInfo: settings.authSetting?.['scope.userInfo'] ?? false,
      phoneNumber: settings.authSetting?.['scope.userPhonenumber'] ?? false,
    };
  } catch {
    return { userInfo: false, phoneNumber: false };
  }
}

/**
 * Request user permission cho userInfo + phoneNumber
 * Nếu user đã grant rồi thì Zalo sẽ skip popup
 */
export async function requestZaloPermissions(): Promise<void> {
  await authorize({
    scopes: ['scope.userInfo', 'scope.userPhonenumber'],
  });
}

/**
 * Lấy Zalo access token (dùng để backend verify user identity)
 * getAccessToken() trả về Promise<string> — trực tiếp là access token string
 * Token này hết hạn sau 1 giờ nhưng ta chỉ cần khi login
 */
export async function getZaloAccessToken(): Promise<string> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('ZALO_ACCESS_TOKEN_EMPTY');
  }
  return accessToken;
}

/**
 * Lấy encrypted phone token
 * getPhoneNumber() trả về { number?: string, token?: string }
 * Từ SDK 2.24.0, dùng `token` (gửi lên backend decode), `number` deprecated
 */
export async function getZaloPhoneToken(): Promise<string> {
  const result = await getPhoneNumber();
  const phoneToken = result?.token;
  if (!phoneToken) {
    throw new Error('ZALO_PHONE_TOKEN_EMPTY');
  }
  return phoneToken;
}

/**
 * Full Zalo OAuth flow:
 * 1. Request permissions (nếu chưa có)
 * 2. Get access token
 * 3. Get phone token
 */
export async function performZaloAuth(): Promise<{
  accessToken: string;
  phoneToken: string;
}> {
  // Step 1: Request permissions
  await requestZaloPermissions();

  // Step 2: Get access token (string)
  const accessToken = await getZaloAccessToken();

  // Step 3: Get encrypted phone token
  const phoneToken = await getZaloPhoneToken();

  return { accessToken, phoneToken };
}
