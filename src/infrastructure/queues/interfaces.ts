export interface QueuePublisherInterface {
  publish: (message: any) => Promise<void>;
}

export interface QueueConsumerInterface {
  consume: () => Promise<void>;
}
