// Script example for ScriptAPI
// Author: GlitchyTurtle32 <https://github.com/GlitchyTurtle>
// Project: https://github.com/JaylyDev/ScriptAPI

import { Vector3 } from "@minecraft/server";

/**
 * 
 * @param {import("@minecraft/server").Vector3} vector 
 * @returns 
 */
export function magnitude(vector: Vector3) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}

export function calculateKnockbackVector(entityPosition: Vector3, pusherPosition: Vector3, forceMagnitude: number) {
    let direction = {
        x: entityPosition.x - pusherPosition.x,
        y: entityPosition.y - pusherPosition.y,
        z: entityPosition.z - pusherPosition.z
    };
  
    let distance = magnitude(direction);
  
    // Normalize the direction vector so it has a magnitude of 1
    direction = {
        x: direction.x / distance,
        y: direction.y / distance,
        z: direction.z / distance
    };
  
    // Scale the direction vector by the force magnitude to get the final knockback vector
    let knockback = {
        x: direction.x * forceMagnitude,
        y: direction.y * forceMagnitude,
        z: direction.z * forceMagnitude
    };
  
    return knockback;
}