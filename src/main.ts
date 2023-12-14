import { app } from './app';
import  http from 'http';
import { summarize } from './service/summarize-service/summarize-service';
const server = http.createServer(app);
// CronJob
summarize();
console.log( server.address() );
server.listen(process.env.PORT);
server.on('listening', async () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}/docs `);
});