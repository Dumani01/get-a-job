import { createCrudModule } from "../../core/crud-service.js";
import config from "./applications.config.js";
import * as mapper from "./applications.mapper.js";

export default createCrudModule({ config, mapper });
