import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import {
  initClient as initSyncClient
} from './services/SyncService';

import reducers, { namespace } from './states';
import { 
  getWorkerId,
  Actions as WorkerAvailabilityActions 
} from './states/WorkerAvailabilityState';

import {
  subscribeToWorkerAvailability,
} from './services/workerAvailability/WorkerAvailabilityService';

import reservationHandler from './eventHandlers/reservationHandler';
import afterAcceptTaskHandler from './eventHandlers/afterAcceptTaskHandler';
import afterCompleteTaskHandler from './eventHandlers/afterCompleteTaskHandler';

const PLUGIN_NAME = 'FlexDynamicWorkerAvailabilityPlugin';

export default class FlexDynamicWorkerAvailabilityPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);

    initSyncClient(manager);

    manager.workerClient.on(
      'reservationCreated', 
      (r) => reservationHandler(manager.store.getState()[namespace])(r)
    );

    flex.Actions.addListener(
      'afterAcceptTask', 
      (p) => afterAcceptTaskHandler(manager.store.getState()[namespace], manager.store.dispatch)(p)
    );

    flex.Actions.addListener(
      'afterCompleteTask',
      (p) => afterCompleteTaskHandler(manager.store.getState()[namespace], manager.store.dispatch)(p)
    );

    manager.store.dispatch(WorkerAvailabilityActions.initWorkerAvailability());
    
    subscribeToWorkerAvailability(
      getWorkerId(),
      () => manager.store.dispatch(WorkerAvailabilityActions.refreshWorkerAvailability())
    );
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
