import { createCrudModule } from "../../core/crud-service.js";
import config from "./companies.config.js";
import * as mapper from "./companies.mapper.js";

export default createCrudModule({ config, mapper });

