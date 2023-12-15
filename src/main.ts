import http from 'http';
import { app } from './app';
const server = http.createServer(app);
// CronJob
// summarize();
console.log(server.address());
server.listen(process.env.PORT);
server.on('listening', async () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}/docs `);
});