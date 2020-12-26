function determineQuadrant (current_roll_in_degrees: number, current_pitch_in_degrees: number) {
    let quadrant: string;
if (current_roll_in_degrees >= 0 && current_pitch_in_degrees <= 0) {
        quadrant = "top_right"
    } else if (current_roll_in_degrees >= 0 && current_pitch_in_degrees > 0) {
        quadrant = "bottom_right"
    } else if (current_roll_in_degrees < 0 && current_pitch_in_degrees >= 0) {
        quadrant = "bottom_left"
    } else {
        quadrant = "top_left"
    }
    return quadrant
}
function roll_around_sprite (s: game.LedSprite) {
    current_roll_in_degrees = input.rotation(Rotation.Roll)
    current_pitch_in_degrees = input.rotation(Rotation.Pitch)
    aiming_quadrant = determineQuadrant(current_roll_in_degrees, current_pitch_in_degrees)
    sprite_direction = directionForQuadrant(Math.abs(current_roll_in_degrees), Math.abs(current_pitch_in_degrees), aiming_quadrant)
    main_sprite.set(LedSpriteProperty.Direction, sprite_direction)
    // basic.pause(100)
    main_sprite.move(1)
}
function directionForQuadrant (absolute_roll: number, absolute_pitch: number, aiming_quadrant: string) {
    let direction: number;
angle = Math.atan(absolute_roll / Math.max(absolute_pitch, 0.001)) * 57.2958
    if (aiming_quadrant == "top_right") {
        direction = angle
    } else if (aiming_quadrant == "bottom_right") {
        direction = angle + 90
    } else if (aiming_quadrant == "bottom_left") {
        direction = angle + 180
    } else {
        direction = angle + 270
    }
    return direction
}
let angle = 0
let sprite_direction = 0
let aiming_quadrant = ""
let current_pitch_in_degrees = 0
let current_roll_in_degrees = 0
let main_sprite: game.LedSprite = null
main_sprite = game.createSprite(3, 1)
let goal_sprite = game.createSprite(0, 0)
basic.forever(function () {
    roll_around_sprite(main_sprite)
    basic.pause(100)
})
/**
 * Comment by John's dad:
 * 
 * Note that sprites will roll along edges when relative direction exceeds 45 current_pitch_in_degrees in effect simulating some degree of "wall friction". Thus there is no need to program specifically for edge cases. For example, this will not move when direction is set below 45 (but will at anything above that):
 * 
 * s = game.create_sprite(1, 0)
 * 
 * s.set(LedSpriteProperty.DIRECTION, 45)
 * 
 * s.move(4)
 * 
 * Note also that the only way to achieve local scope variables using blocks is to have them as python function parameters. Blocks will generate any others as globals
 */
basic.forever(function () {
    basic.pause(800)
    goal_sprite.delete()
    basic.pause(800)
    goal_sprite = game.createSprite(0, 0)
})
