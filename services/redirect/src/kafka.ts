import { Kafka, Partitioners } from 'kafkajs';

if (!process.env.KAFKA_BROKERS) {
  throw new Error('KAFKA_BROKERS environment variable is not defined');
}
const brokers = process.env.KAFKA_BROKERS.split(',');
const topic = process.env.KAFKA_TOPIC || 'analytics-event';

const kafka = new Kafka({
  clientId: 'redirect-service',
  brokers,
  connectionTimeout: 10000,
  requestTimeout: 60000,
  enforceRequestTimeout: false,
});

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  createPartitioner: Partitioners.DefaultPartitioner,
  retry: {
    initialRetryTime: 500,
    retries: 10,
  },
});

export const connectProducer = async () => {
  await producer.connect();
  console.log(`Kafka Producer connected to ${brokers}`);
};

export const sendAnalyticsEvent = async (event: {
  code: string;
  ip: string;
  userAgent: string;
  referer?: string;
}) => {
  // Fire and forget
  producer.send({
    topic,
    messages: [
      { value: JSON.stringify(event) },
    ],
  }).catch(err => {
    console.error('Failed to send Kafka event:', err);
  });
};
