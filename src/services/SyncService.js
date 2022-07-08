import { Manager } from '@twilio/flex-ui';
import { SyncClient } from 'twilio-sync';

const EVENT_DOCUMENT_UPDATED = 'updated';

const client = new SyncClient(Manager.getInstance().user.token);

const tokenUpdateHandler = () => {
  console.log('[SyncService] Refreshing SyncClient token');

  const loginHandler = Manager.getInstance()
    .store
    .getState()
    .flex
    .session
    .loginHandler;

  const {
    token: accessToken
  } = loginHandler.getTokenInfo();

  client.updateToken(accessToken);
};

export const initClient = (manager) => 
  manager.events.addListener('tokenUpdated', () => tokenUpdateHandler);

export const addDocument = async (id, initialValue) => client.document(id)
  .then(doc => doc.set(initialValue))
  .then(updatedDoc => true)
  .catch(err => {
    console.error('[SyncService.addDocument] An error occurred at trying to create document', err);
    return false;
  });

export const removeDocument = async (id) => client.document(id)
  .then(doc => doc.removeDocument())
  .then(_ => true)
  .catch(err => {
    console.error('[SyncService.removeDocument] An error occurred at trying to remove document', err);
    return false;
  });

export const documentExists = async (id) => 
  client.document({ id , mode: 'open_existing' })
    .then(_ => true)
    .catch(_ => false);

export const getDocument = async (id) => client.document(id)
  .then(_ => _.data)
  .catch(err => {
    console.error('[SyncService.getDocument] An error occurred at trying to get document', err);
    return false;
  });

export const updateDocument = async (id, data) => client.document(id)
  .then(doc => doc.update(data))
  .then(updatedDoc => updatedDoc)
  .catch(err => {
    console.error('[SyncService.updateDocument] An error occurred at trying to update document', err);
    return false;
  });

export const subscribeForDocumentUpdates = async (
  id,
  onDocumentUpdated 
) => {
  const doc = await client.document({ id, mode: 'open_existing' });
  doc.on(EVENT_DOCUMENT_UPDATED, args => onDocumentUpdated(args));
};

