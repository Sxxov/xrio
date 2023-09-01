import { server } from '../../build/index.js';
import { wsConfigureHttpServer } from '../ws/wsConfigureHttpServer.js';

wsConfigureHttpServer(server.server);
