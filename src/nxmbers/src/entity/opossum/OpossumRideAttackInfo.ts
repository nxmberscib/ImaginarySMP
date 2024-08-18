import { Entity, Player } from "@minecraft/server";

export default interface OpossumRideAttackInfo {
    attackStart: number;
    attackEnd: number;
    cooldown: number;
    opossumTarget: Player;
    opossumAttacker: Entity;
}
