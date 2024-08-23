import { Entity } from "@minecraft/server";
import { Vector3Builder } from "nxmbers/src/util/vector/VectorWrapper";

export default interface GrappleData {
    playerGasObjectiveSound: any;
    isGrappling: boolean,
    gasUsage: number,
    storedGas: number,
    grappleStart: number,
    hook: Entity
    hookSeat: Entity,
    targetLocation: Vector3Builder,
    initialViewVector: Vector3Builder,
    reachedObjective: boolean,  
}