// @ts-check



import FrozenPiglin from './piglin/FrozenPiglin';
import HoneySlime from './slime/HoneySlime';
import InterstellarSlime from './slime/InterstellarSlime';
import MarineSlime from './slime/MarineSlime';
import PreassureAssasin from './illager/PreassureAssasin';

export default class ImaginaryEntities {
    static registerEntities() {
        import('./Breeze')
        import('./skeleton/BreezeSkeleton');
        import('./skeleton/CrystallineSkeleton');

        /**
         * @remarks
         * Register all the Imaginary skeleton-like entities.
         */
        //....

        /**
         * @remarks
         * Register all the Imaginary slime-like entities.
         */
        new HoneySlime();
        new InterstellarSlime();
        new MarineSlime()


        /**
         * @remarks
         * Register all the Imaginary piglin-like entities.
         */
        new FrozenPiglin();

        /**
         * @remarks
         * Register all the Imaginary illager entities.
         */
        new PreassureAssasin()
    }
}