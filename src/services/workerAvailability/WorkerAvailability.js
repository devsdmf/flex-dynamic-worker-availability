const DEFAULT_MAX_TASKS = 10;

class WorkerAvailability {

  constructor({
    activeTasks,
    maxTasks
  }) {
    this.activeTasks = activeTasks ?? 0;
    this.maxTasks = maxTasks ?? DEFAULT_MAX_TASKS;
  }

  toSyncObject() {
    return {
      activeTasks: this.activeTasks,
      maxTasks: this.maxTasks
    };
  }
}

export default WorkerAvailability;
