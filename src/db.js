import { openDB } from "idb";

const DB_NAME = "mydatabase";
const STORE = "subscriptions";
const STORY_STORE = "stories";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "endpoint" });
      }
      if (!db.objectStoreNames.contains(STORY_STORE)) {
        db.createObjectStore(STORY_STORE, { keyPath: "id" });
      }
    },
  });
};

export const saveSubscription = async (data) => {
  const db = await initDB();
  await db.put(STORE, data);
};

export const getAllSubscriptions = async () => {
  const db = await initDB();
  return db.getAll(STORE);
};

export const deleteSubscription = async (endpoint) => {
  const db = await initDB();
  return db.delete(STORE, endpoint);
};

export const saveStories = async (stories) => {
  const db = await initDB();
  const tx = db.transaction(STORY_STORE, "readwrite");
  for (const story of stories) {
    await tx.store.put(story);
  }
  await tx.done;
};

export const getAllStories = async () => {
  const db = await initDB();
  return db.getAll(STORY_STORE);
};

export const deleteStory = async (id) => {
  const db = await initDB();
  return db.delete(STORY_STORE, id);
};
