import { createCrudModule } from "../../core/crud-service.js";
import config from "./candidates.config.js";
import * as mapper from "./candidates.mapper.js";

export default createCrudModule({ config, mapper });

