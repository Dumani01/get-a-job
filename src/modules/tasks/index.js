import { createCrudModule } from "../../core/crud-service.js";
import config from "./tasks.config.js";
import * as mapper from "./tasks.mapper.js";

export default createCrudModule({ config, mapper });

