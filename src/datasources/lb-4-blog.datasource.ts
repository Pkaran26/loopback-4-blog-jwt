import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'lb4_blog',
  connector: 'mongodb',
  url: '',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'lb4_blog',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class Lb4BlogDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'lb4_blog';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.lb4_blog', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
