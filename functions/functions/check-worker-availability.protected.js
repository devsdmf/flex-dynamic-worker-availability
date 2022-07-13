exports.handler = (context, event, callback) => {
  console.log('check-worker-availability called!');
  //console.log('context => ', context);
  //console.log('event => ', event);

  const client = context.getTwilioClient();
  const res = new Twilio.Response();

  const workerId = JSON.parse(event.WorkerAttributes)['twilio_contact_identity'];
  //console.log('workerId => ', workerId);

  return client.sync
    .services(context.SYNC_SERVICE_SID)
    .documents(workerId)
    .fetch()
    .then(doc => {
      console.log('doc ====> ', doc);
      const { data: workerAvailability } = doc;
      console.log('workerAvailability ===> ', workerAvailability);

      if (workerAvailability.activeTasks < workerAvailability.maxTasks) {
        console.log('Worker has availability to handle the conversation');
        res.setStatusCode(204);
      } else {
        console.log('Worker is overloaded, rejecting the conversation');
        res.setStatusCode(200);
        res.setBody({ instruction: 'reject' });
      }
      
      return callback(null,res);
    });
};
