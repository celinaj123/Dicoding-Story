import { StoryAPI } from '../../api/story-api.js';

export default class PostModel {
  async create({ imageBlob, title, description, lat, lng }) {
    const token = localStorage.getItem('authToken'); 

    if (token) {
      return StoryAPI.addStory({
        description: description || title,
        photoBlob: imageBlob,
        lat,
        lon: lng,
      });
    } else {
      return StoryAPI.addStoryGuest({
        description: description || title,
        photoBlob: imageBlob,
        lat,
        lon: lng,
      });
    }
  }

  async getAll({ page = 1, size = 10, location = 0 } = {}) {
    return StoryAPI.getStories({ page, size, location });
  }

  async getById(id) {
    return StoryAPI.getStoryById(id);
  }
}
