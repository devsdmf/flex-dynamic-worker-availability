
import { Actions as WorkerAvailabilityActions } from '../states/WorkerAvailabilityState';

const afterCompleteTaskHandler = (state, dispatch) => payload => {
  console.log('afterCompleteTaskHandler called!');
  const { workerAvailability } = state;

  workerAvailability.activeTasks--;

  dispatch(WorkerAvailabilityActions.updateWorkerAvailability(workerAvailability));
};

export default afterCompleteTaskHandler;
