import Recording from './Recording.js';

export default class YouTv {
  async login(email, password) {
    const res = await fetch('https://www.youtv.de/api/v2/auth_token.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: { email, password },
      }),
    });
    const { token } = await res.json();
    this.token = token;
  }

  async fetchRecordings() {
    const res = await fetch('https://www.youtv.de/api/v2/recordings.json', {
      headers: { 'Authorization': `Token token=${this.token}` }
    });
    const { recordings } = await res.json();
    
    return Promise.all(recordings.map(async ({ id }) => {
      const res = await fetch(`https://www.youtv.de/api/v2/recordings/${id}.json`, {
        headers: { 'Authorization': `Token token=${this.token}` }
      });
      const { recording } = await res.json();
      return new Recording(recording, this.token);
    }));
  }
}
