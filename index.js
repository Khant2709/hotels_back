import {startServer} from "./components/http/index.js";
import {startMysql} from "./mySql.js";

(async () => {
    await startServer();
    await startMysql();
})();
