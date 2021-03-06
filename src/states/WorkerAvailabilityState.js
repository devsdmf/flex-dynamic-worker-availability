import { Manager } from '@twilio/flex-ui';
import { 
  initWorkerAvailability,
  getWorkerAvailability,
  updateWorkerAvailability
} from '../services/workerAvailability/WorkerAvailabilityService';

const ACTION_REFRESH_WORKER_AVAILABILITY = 'REFRESH_WORKER_AVAILABILITY';
const ACTION_UPDATE_WORKER_AVAILABILITY = 'UPDATE_WORKER_AVAILABILITY';

const initialState = null;

export const getWorkerId = () => Manager.getInstance()
  .store
  .getState()
  .flex
  .worker
  .attributes
  .twilio_contact_identity;

const getWorkerTasks = () => Manager.getInstance()
  .store
  .getState()
  .flex
  .worker
  .tasks;

export const Actions = {
  initWorkerAvailability: () => ({
    type: ACTION_REFRESH_WORKER_AVAILABILITY,
    payload: getWorkerAvailability(getWorkerId())
      .then(workerAvailability => {
        workerAvailability.activeTasks = getWorkerTasks().size;
        return workerAvailability;
      })
      .then(updatedAvailability => updateWorkerAvailability(getWorkerId(), updatedAvailability)),
  }),
  refreshWorkerAvailability: () => ({
    type: ACTION_REFRESH_WORKER_AVAILABILITY,
    payload: getWorkerAvailability(getWorkerId()),
  }),
  updateWorkerAvailability: (workerAvailability) => ({
    type: ACTION_UPDATE_WORKER_AVAILABILITY,
    payload: updateWorkerAvailability(getWorkerId(), workerAvailability),
  }),
};

export function reduce(state = initialState, action) {
  switch (action.type) {
    case `${ACTION_REFRESH_WORKER_AVAILABILITY}_PENDING`:
    case `${ACTION_UPDATE_WORKER_AVAILABILITY}_PENDING`:
      return state;
    case `${ACTION_REFRESH_WORKER_AVAILABILITY}_FULFILLED`:
    case `${ACTION_UPDATE_WORKER_AVAILABILITY}_FULFILLED`:
      return action.payload;
    case `${ACTION_REFRESH_WORKER_AVAILABILITY}_REJECTED`:
    case `${ACTION_UPDATE_WORKER_AVAILABILITY}_REJECTED`:
      return {
        ...state,
        error: action.payload.error,
      };
      break;
    default:
      return state;
  }
};
