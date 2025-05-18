import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default class PostFormView {
  constructor({ onSubmit }) {
    this.onSubmit = onSubmit;
    this.app = document.getElementById("app");
    this.videoStream = null;
  }

  render() {
    this.app.innerHTML = `
        <main tabindex="-1" id="main-content">
          <h1>Buat Post Baru</h1>
          <form id="post-form">
            <label>
              Title
              <input type="text" name="title" required />
            </label>
            <br>
            <label>
              Description
              <textarea name="description" required></textarea>
            </label>
            <section>
              <h2>Foto</h2>
              <video id="video" autoplay playsinline width="300"></video>
              <button type="button" id="take-photo">Ambil Foto</button>
              <canvas id="canvas" hidden></canvas>
              <img id="preview" alt="Preview foto" />
            </section>
            <section>
              <h2>Pilih Lokasi</h2>
              <div id="map" style="height: 300px;"></div>
            </section>
            <button type="submit">Kirim</button>
          </form>
        </main>
      `;
    this._initCamera();
    this._initMap();
    this._bindEvents();
    window.addEventListener("hashchange", this.stopCamera.bind(this));
  }

  _initCamera() {
    const video = this.app.querySelector("#video");
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.videoStream = stream;
        video.srcObject = stream;
      })
      .catch(console.error);
  }
  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
      this.videoStream = null;
    }
  }

  _initMap() {
    this.map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);

    const customIcon = L.icon({
      iconUrl: "../images/google-maps.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    this.marker = null;
    this.map.on("click", (e) => {
      if (this.marker) this.map.removeLayer(this.marker);
      this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map);
      this.chosenLatLng = e.latlng;

      this._getLocationName(e.latlng).then((locationName) => {
        this.marker.bindPopup(locationName).openPopup();
      });
    });
  }
  _getLocationName(latlng) {
    return new Promise((resolve, reject) => {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json&addressdetails=1`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const locationName = data.display_name || "Lokasi tidak ditemukan";
          resolve(locationName);
        })
        .catch((error) => {
          console.error("Error fetching location name:", error);
          reject("Gagal mendapatkan nama lokasi");
        });
    });
  }

  _bindEvents() {
    this.app.querySelector("#take-photo").addEventListener("click", () => {
      const video = this.app.querySelector("#video");
      const canvas = this.app.querySelector("#canvas");
      const preview = this.app.querySelector("#preview");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      preview.src = canvas.toDataURL("image/jpeg");
    });

    this.app.querySelector("#post-form").addEventListener("submit", (evt) => {
      evt.preventDefault();
      const formData = new FormData(evt.target);
      this.onSubmit({
        formData,
        canvas: this.app.querySelector("#canvas"),
        latlng: this.chosenLatLng,
      });
    });
  }
}
