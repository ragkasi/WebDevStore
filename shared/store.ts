import Engine from 'store/src/store-engine';
import LocalStorage from 'store/storages/localStorage';
import SessionStorage from 'store/storages/sessionStorage';
import MemoryStorage from 'store/storages/memoryStorage';
import CompressionPlugin from 'store/plugins/compression';

const Store = Engine.createStore(
  [LocalStorage, SessionStorage, MemoryStorage],
  [CompressionPlugin],
);

export default Store;
