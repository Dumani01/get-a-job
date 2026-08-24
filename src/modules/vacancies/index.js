import { createCrudModule } from "../../core/crud-service.js";
import config from "./vacancies.config.js";
import * as mapper from "./vacancies.mapper.js";

export default createCrudModule({ config, mapper });
