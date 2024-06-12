import RAPIER, { Collider, QueryFilterFlags, RigidBodyDesc, RigidBodyType, ColliderDesc } from '@dimforge/rapier2d';


let world = new RAPIER.World({ x: 0.0, y: -9.81 });
{

    // DOCUSAURUS: Raycasting start
    let ray = new RAPIER.Ray({ x: 1.0, y: 2.0 }, { x: 0.0, y: 1.0 });
    let maxToi = 4.0;
    let solid = true;

    let hit = world.castRay(ray, maxToi, solid);
    if (hit != null) {
        // The first collider hit has the handle `hit.colliderHandle` and it hit after
        // the ray travelled a distance equal to `ray.dir * toi`.
        let hitPoint = ray.pointAt(hit.timeOfImpact); // Same as: `ray.origin + ray.dir * toi`
        console.log("Collider", hit.collider, "hit at point", hitPoint);
    }

    let hitWithNormal = world.castRayAndGetNormal(ray, maxToi, solid);
    if (hitWithNormal != null) {
        // This is similar to `QueryPipeline::cast_ray` illustrated above except
        // that it also returns the normal of the collider shape at the hit point.
        let hitPoint = ray.pointAt(hitWithNormal.timeOfImpact);
        console.log("Collider", hitWithNormal.collider, "hit at point", hitPoint, "with normal", hitWithNormal.normal);
    }

    world.intersectionsWithRay(ray, maxToi, solid, (hit) => {
        // Callback called on each collider hit by the ray.
        let hitPoint = ray.pointAt(hit.timeOfImpact);
        console.log("Collider", hit.collider, "hit at point", hitPoint, "with normal", hit.normal);
        return true; // Return `false` instead if we want to stop searching for other hits.
    });
    // DOCUSAURUS: Raycasting stop
}

{
    // DOCUSAURUS: Shapecasting start
    let shape = new RAPIER.Cuboid(1.0, 2.0);
    let shapePos = { x: 0.0, y: 1.0 };
    let shapeRot = 0.2;
    let shapeVel = { x: 0.1, y: 0.4 };
    let maxToi = 4.0;

    // FIXME: fix cast shape
    /*
    let hit = world.castShape(shapePos, shapeRot, shapeVel, shape, maxToi);
    if (hit != null) {
        // The first collider hit has the handle `handle`. The `hit` is a
        // structure containing details about the hit configuration.
        console.log("Hit the collider", hit.collider, "at time", hit.time_of_impact);
    }*/
    // DOCUSAURUS: Shapecasting stop
}

{
    // DOCUSAURUS: Pointprojection start
    let point = { x: 1.0, y: 2.0 };
    let solid = true;

    let proj = world.projectPoint(point, solid);
    if (proj != null) {
        // The collider closest to the point has this `handle`.
        console.log("Projected point on collider ", proj.collider, ". Point projection: ", proj.point);
        console.log("Point was inside of the collider shape: {}", proj.isInside);
    }

    world.intersectionsWithPoint(point, (handle) => {
        // Callback called on each collider with a shape containing the point.
        console.log("The collider", handle, "contains the point.");
        // Return `false` instead if we want to stop searching for other colliders containing this point.
        return true;
    });
    // DOCUSAURUS: Pointprojection stop
}
{
    // DOCUSAURUS: IntersectionTest start
    let shape = new RAPIER.Cuboid(1.0, 2.0);
    let shapePos = { x: 1.0, y: 2.0 };
    let shapeRot = 0.1;

    world.intersectionsWithShape(shapePos, shapeRot, shape, (handle) => {
        console.log("The collider", handle, "intersects our shape.");
        return true; // Return `false` instead if we want to stop searching for other colliders that contain this point.
    });

    let aabbCenter = { x: -1.0, y: -2.0 };
    let aabbHalfExtents = { x: 0.5, y: 0.6 };
    world.collidersWithAabbIntersectingAabb(aabbCenter, aabbHalfExtents, (handle) => {
        console.log("The collider", handle, "has an AABB intersecting our test AABB");
        return true; // Return `false` instead if we want to stop searching for other colliders that contain this point.
    });
    // DOCUSAURUS: IntersectionTest stop
}
{
    let rigidBodyDesc = RigidBodyDesc.dynamic();
    let player_rigid_body = world.createRigidBody(rigidBodyDesc);
    // DOCUSAURUS: QueryFilters start
    let ray = new RAPIER.Ray({ x: 1.0, y: 2.0 }, { x: 0.0, y: 1.0 });
    let maxToi = 4.0;
    let solid = true;

    let filterFlags = QueryFilterFlags.EXCLUDE_DYNAMIC;
    let filterGroups = 0x000b0001;
    let filterExcludeRigidBody = player_rigid_body;
    // FIXME: no userdata for collider ?
    /*let filterPredicate = (collider: Collider) => collider.userData == 10.0;


    let hit = world.castRay(ray, maxToi, solid, filterFlags, filterGroups, null, filterExcludeRigidBody, filterPredicate);
    if (hit != null) {
        // Handle the hit.
    }*/
    // DOCUSAURUS: QueryFilters stop
}