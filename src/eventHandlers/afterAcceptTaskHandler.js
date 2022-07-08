
import { Actions as WorkerAvailabilityActions } from '../states/WorkerAvailabilityState';

const afterAcceptTaskHandler = (state, dispatch) => payload => {
  console.log('afterAcceptTaskHandler called!');
  const { workerAvailability } = state;

  workerAvailability.activeTasks++;

  dispatch(WorkerAvailabilityActions.updateWorkerAvailability(workerAvailability));
};

export default afterAcceptTaskHandler;
