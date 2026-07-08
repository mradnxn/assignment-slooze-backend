export function decodeJwt(token: string) {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = Buffer.from(payloadBase64, 'base64').toString('utf8');
    return JSON.parse(decodedPayload);
  } catch (e) {
    return null;
  }
}
