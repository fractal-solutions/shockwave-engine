import { CSG } from 'three-csg-ts';
import * as THREE from 'three';

/**
 * Subtracts the second mesh from the first mesh using CSG operations.
 *
 * @param meshA The base mesh.
 * @param meshB The mesh to subtract from the base mesh.
 * @returns A new THREE.Mesh that is the result of the subtraction.
 */
export function subtract(meshA: THREE.Mesh, meshB: THREE.Mesh): THREE.Mesh {
  // Ensure the matrices are up to date
  meshA.updateMatrix();
  meshB.updateMatrix();

  // Perform the CSG operation
  const result = CSG.subtract(meshA, meshB);

  return result;
}

/**
 * Unions two meshes using CSG operations.
 *
 * @param meshA The first mesh.
 * @param meshB The second mesh.
 * @returns A new THREE.Mesh that is the result of the union.
 */
export function union(meshA: THREE.Mesh, meshB: THREE.Mesh): THREE.Mesh {
  meshA.updateMatrix();
  meshB.updateMatrix();
  const result = CSG.union(meshA, meshB);
  return result;
}

/**
 * Intersects two meshes using CSG operations.
 *
 * @param meshA The first mesh.
 * @param meshB The second mesh.
 * @returns A new THREE.Mesh that is the result of the intersection.
 */
export function intersect(meshA: THREE.Mesh, meshB: THREE.Mesh): THREE.Mesh {
  meshA.updateMatrix();
  meshB.updateMatrix();
  const result = CSG.intersect(meshA, meshB);
  return result;
}