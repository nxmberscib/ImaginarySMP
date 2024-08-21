import Imaginary from "../Imaginary";
import { MobNameRegistry } from "../manager/MobNameManager";

export default class DiabloquitoEntity implements MobNameRegistry {
    public MOB_ID: string = "cib:diabloquito";
    public displayName: string = "§5Diabloquito";

    public constructor() {
        Imaginary.LOGGER.robust("Diabloquito entity loaded");
    }
}
