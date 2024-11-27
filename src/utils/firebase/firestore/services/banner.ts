import { fetchWithAuth } from './fetchWithAuth';

export async function addBanner(cid: string, content: string, tagOptions: string[]): Promise<boolean> {
  try {
    const addBannerAck = await fetchWithAuth('/api/banners', {
      method: 'POST',
      body: JSON.stringify({ cid, content, tagOptions }),
    });
    console.log(addBannerAck);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getBanner() {
  try {
    const banner = await fetchWithAuth('/api/banners', { method: 'GET' });
    console.log('getBanner', banner);
    return banner;
  } catch (err) {
    console.error(err);
    return null;
  }
}