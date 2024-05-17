use bevy::input::common_conditions::input_just_pressed;
use bevy::prelude::*;
use bevy_rapier2d::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugins(RapierPhysicsPlugin::<NoUserData>::pixels_per_meter(100.0))
        .add_plugins(RapierDebugRenderPlugin::default())
        .add_systems(Startup, setup_graphics)
        .add_systems(Startup, setup_physics)
        .add_systems(
            Update,
            modify_body_velocity.run_if(input_just_pressed(KeyCode::KeyV)),
        )
        .add_systems(Update, reset_position)
        .add_systems(
            Update,
            apply_forces.run_if(input_just_pressed(KeyCode::KeyF)),
        )
        .run();
}

fn setup_graphics(mut commands: Commands) {
    // Add a camera so we can see the debug-render.
    commands.spawn(Camera2dBundle::default());
}

fn setup_physics(mut commands: Commands) {
    // DOCUSAURUS: Creation start
    use bevy::prelude::*;
    use bevy_rapier2d::prelude::*;
    commands
        .spawn(RigidBody::Dynamic)
        .insert(TransformBundle::from(Transform::from_xyz(0.0, 5.0, 0.0)))
        .insert(Velocity {
            linvel: Vec2::new(1.0, 2.0),
            angvel: 0.2,
        })
        .insert(GravityScale(0.5))
        .insert(Sleeping::disabled())
        .insert(Ccd::enabled());
    // DOCUSAURUS: Creation stop

    // DOCUSAURUS: Velocity1 start
    commands.spawn(RigidBody::Dynamic).insert(Velocity {
        linvel: Vec2::new(0.0, 2.0),
        angvel: 0.4,
    });
    // DOCUSAURUS: Velocity1 stop

    // DOCUSAURUS: Forces1 start
    commands
        .spawn(RigidBody::Dynamic)
        .insert(ExternalForce {
            force: Vec2::new(1000.0, 2000.0),
            torque: 140.0,
        })
        .insert(ExternalImpulse {
            impulse: Vec2::new(100.0, 200.0),
            torque_impulse: 14.0,
        });
    // DOCUSAURUS: Forces1 stop
}

// DOCUSAURUS: Velocity2 stop

/* Set the velocities inside of a system. */
fn modify_body_velocity(mut velocities: Query<&mut Velocity>) {
    for mut vel in velocities.iter_mut() {
        vel.linvel = Vec2::new(0.0, 2.0);
        vel.angvel = 0.4;
    }
}
// DOCUSAURUS: Velocity2 stop

// DOCUSAURUS: Forces2 start
/* Apply forces and impulses inside of a system. */
fn apply_forces(
    mut ext_forces: Query<&mut ExternalForce>,
    mut ext_impulses: Query<&mut ExternalImpulse>,
) {
    // Apply forces.
    for mut ext_force in ext_forces.iter_mut() {
        ext_force.force = Vec2::new(1000.0, 2000.0);
        ext_force.torque = 0.4;
    }

    // Apply impulses.
    for mut ext_impulse in ext_impulses.iter_mut() {
        ext_impulse.impulse = Vec2::new(100.0, 200.0);
        ext_impulse.torque_impulse = 0.4;
    }
}
// DOCUSAURUS: Forces2 stop

/// System to avoid too much drift
fn reset_position(mut positions: Query<&mut Transform, With<RigidBody>>) {
    for mut position in positions.iter_mut() {
        if position.translation.y > 30.0 {
            position.translation.y -= 30.0;
        }
        if position.translation.x > 30.0 {
            position.translation.x -= 30.0;
        }
        if position.translation.z > 30.0 {
            position.translation.x -= 30.0;
        }
    }
}
