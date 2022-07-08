import { Manager } from '@twilio/flex-ui';

import {
  getDocument,
  subscribeForDocumentUpdates,
  updateDocument,
} from '../SyncService';

import WorkerAvailability from './WorkerAvailability';

export const getWorkerAvailability = async (workerId) => getDocument(workerId)
  .then(doc => doc ? workerAvailabilityFromSyncDocument(doc) : false);

export const updateWorkerAvailability = async (workerId, availability) => 
  updateDocument(workerId, availability.toSyncObject())
    .then(updated => updated ? workerAvailabilityFromSyncDocument(updated) : false);

export const subscribeToWorkerAvailability = (workerId, onUpdated) => 
  subscribeForDocumentUpdates(workerId, onUpdated);

const workerAvailabilityFromSyncDocument = doc => new WorkerAvailability(doc);
