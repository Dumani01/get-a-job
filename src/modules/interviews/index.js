import { createCrudModule } from "../../core/crud-service.js";
import config from "./interviews.config.js";
import * as mapper from "./interviews.mapper.js";

export default createCrudModule({ config, mapper });

