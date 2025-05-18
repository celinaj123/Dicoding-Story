import PostModel from '../../models/post-model';

export default class DetailPage {
  constructor(id) {
    this.model = new PostModel();
    this.id = id;
    this.app = document.getElementById('app');
  }

  async getLocationName(lat, lon) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await res.json();
      return data.display_name || 'Tidak diketahui';
    } catch (err) {
      console.warn('Gagal ambil nama lokasi:', err);
      return 'Tidak diketahui';
    }
  }

  async render() {
    this.app.innerHTML = `
      <main tabindex="-1" id="main-content">
        <h1>Detail Cerita</h1>
        <div id="story-detail" class="story-detail">Loading...</div>
      </main>
    `;

    try {
      const story = await this.model.getById(this.id);
      let locationInfo = '<p><em>Tidak ada lokasi tersedia.</em></p>';
    
      if (story.lat && story.lon) {
        const locationName = await this.getLocationName(story.lat, story.lon);
    
        locationInfo = `
          <p><strong>Lokasi:</strong> ${locationName} (Lat: ${story.lat}, Lon: ${story.lon})</p>
          <div id="map" style="height: 250px; margin-top: 10px; border-radius: 10px;"></div>
        `;
      }
    
      document.getElementById('story-detail').innerHTML = `
        <div class="detail-card">
          <h2>${story.name}</h2>
          <img src="${story.photoUrl}" alt="Foto Cerita" width="300" style="border-radius: 10px;" />
          <p><strong>Deskripsi:</strong> ${story.description}</p>
          <p><strong>Dibuat pada:</strong> ${new Date(story.createdAt).toLocaleString()}</p>
          ${locationInfo}
        </div>
      `;
 
      if (story.lat && story.lon) {
        const locationName = await this.getLocationName(story.lat, story.lon);
        const map = L.map('map').setView([story.lat, story.lon], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const markerIcon = L.icon({
          iconUrl: 'images/google-maps.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        L.marker([story.lat, story.lon], { icon: markerIcon })
          .addTo(map)
          .bindPopup(`<b>${locationName}</b>`)
          .openPopup();
      }

    } catch (err) {
      document.getElementById('story-detail').innerHTML = `<p style="color:red;">Gagal memuat cerita: ${err.message}</p>`;
    }
  }
}
