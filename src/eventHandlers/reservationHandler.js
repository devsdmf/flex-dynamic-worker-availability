import { Actions } from '@twilio/flex-ui';

const reservationHandler = state => reservation => {
  // simple validation against max tasks
  const {
    activeTasks,
    maxTasks,
  } = state.workerAvailability;

  if (activeTasks >= maxTasks) {
    // automatically reject task
    console.log('Worker is over capacity, rejecting task...', reservation.task);
    Actions.invokeAction('RejectTask', { sid: reservation.sid });
  }

  return reservation;
}

export default reservationHandler;
