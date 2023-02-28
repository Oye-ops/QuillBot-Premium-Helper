import { makeAutoObservable } from 'mobx'
import { makePersistable, isHydrated } from 'mobx-persist-store'
import forage from 'utils/forage'

class LoadingStore {

  constructor() {
    makeAutoObservable(this)
  };

  list = [];

  get isLoading() {
    return this.list.length > 0;
  }

  get loadingList() {
    return this.list;
  }

  addLoading(task) {
    const id = Math.random().toString(16).slice(2);
    this.list.push({ task, id });
    return id;
  }

  removeLoading(id) {
    this.list = this.list.filter((item) => item.id !== id);
  }
}

class CacheStore {

  constructor() {
    makeAutoObservable(this)
    makePersistable(this, {
      name: 'QuillBot-Premium-Crack-Cache',
      properties: ['persistCache'],
      storage: forage,
      stringify: false
    })

  };

  cache = new Map();

  getCache(key) {
    return this.cache.get(key);
  }

  setCache(key, value) {
    this.cache.set(key, value);
  }

  persistCache = new Map();

  getPersistCache(key) {
    return this.persistCache.get(key);
  }

  setPersistCache(key, value) {
    this.persistCache.set(key, value);
  }

}


class RootStore {
  constructor() {
    this.cacheStore = new CacheStore(this);
    this.windowStore = new WindowStore(this);
    this.loadingStore = new LoadingStore(this);
    this.configStore = new ConfigStore(this);
    this.tokenStore = new TokenStore(this);
  }
}

class ConfigStore {

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this)
    makePersistable(this, {
      name: 'QuillBot-Premium-Crack-Config',
      properties: ['config'],
      storage: forage,
      stringify: false
    })
  };

  get isHydrated() {
    return isHydrated(this);
  }

  config = {
    available: true,
    domModifier: [],
    announcements: []
  };

  get getAnnouncements() {
    return this.config.announcements
  }

  get getDomModifier() {
    return this.config.domModifier
  }

  get getAvailable() {
    return this.config.available
  }

  setAvailable(available) {
    this.config.available = available;
  }

  setDomModifier(domModifier) {
    this.config.domModifier = domModifier;
  }

  setAnnouncements(announcements) {
    this.config.announcements = announcements;
  }

}

class WindowStore {

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this)
  };

  announcementWindowOpen = false;
  tokenWindowOpen = false;

  get isAnnouncementWindowOpen() {
    return this.announcementWindowOpen;
  }

  get isTokenWindowOpen() {
    return this.tokenWindowOpen;
  }

  toggleAnnouncementWindow() {
    this.announcementWindowOpen = !this.announcementWindowOpen;
  }

  toggleTokenWindow() {
    this.tokenWindowOpen = !this.tokenWindowOpen;
  }

}

class TokenStore {

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'QuillBot-Premium-Crack-Token',
      properties: ['tokens', 'activeId'],
      storage: forage,
      stringify: false,
    })
  };

  get isHydrated() {
    return isHydrated(this);
  }

  tokens = [];

  activeId = null;

  setActiveId(id) {
    this.activeId = id;
  }

  get getActiveId() {
    return this.tokens.find(t => t.id === this.activeId) || null;
  }

  deleteId(id) {
    this.tokens = this.tokens.filter(t => t.id !== id);
  }

  get getTokenList() {
    return this.tokens.sort((a, b) => {
      if (a.property === 'private' && b.property === 'public') {
        return -1;
      }
      if (a.property === 'public' && b.property === 'private') {
        return 1;
      }
      return 0;
    })
  }

  addToken(token) {
    if (this.tokens.find(t => t.id === token.id)) {
      this.tokens = this.tokens.map(t => {
        if (t.id === token.id) {
          return token;
        }
        return t;
      })
    } else {
      this.tokens.push(token);
    }
  }

}


export default new RootStore();