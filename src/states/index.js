import { combineReducers } from 'redux';

import { reduce as WorkerAvailabilityReducer } from './WorkerAvailabilityState';

// Register your redux store under a unique namespace
export const namespace = 'flex-dynamic-worker-availability';

// Combine the reducers
export default combineReducers({
  workerAvailability: WorkerAvailabilityReducer,
});
