export default class Recording {
  constructor(data, token) {
    this.data = data;
    this.id = data.id;
  }

  isRecorded() {
    return this.data.recorded;
  }

  filename() {
    if (this.data.season && this.data.episode) {
      return `Series/${this.data.title}/Season ${this.data.season}/${this.data.title} - S${this.data.season}E${this.data.episode} - ${this.data.subtitle}`;
    }
    return `Movies/${this.data.title} - ${this.data.production_year}`;
  }

  async download() {
    const { file } = this.data.files[0];
    const res = await fetch(file, {
      headers: { 'Authorization': `Token token=${this.token}` }
    });
    return res.body;
  }

  async getSize() {
    const { file } = this.data.files[0];
    const res = await fetch(file, {
      method: 'HEAD',
      headers: { 'Authorization': `Token token=${this.token}` }
    });
    return res.headers.get('content-length');
  }
}
