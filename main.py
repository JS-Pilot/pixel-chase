def determineQuadrant(current_roll_in_degrees: number, current_pitch_in_degrees: number):
    if current_roll_in_degrees >= 0 and current_pitch_in_degrees <= 0:
        quadrant = "top_right"
    elif current_roll_in_degrees >= 0 and current_pitch_in_degrees > 0:
        quadrant = "bottom_right"
    elif current_roll_in_degrees < 0 and current_pitch_in_degrees >= 0:
        quadrant = "bottom_left"
    else:
        quadrant = "top_left"
    return quadrant
def roll_around_sprite(s: game.LedSprite):
    global current_roll_in_degrees, current_pitch_in_degrees, aiming_quadrant, sprite_direction
    current_roll_in_degrees = input.rotation(Rotation.ROLL)
    current_pitch_in_degrees = input.rotation(Rotation.PITCH)
    aiming_quadrant = determineQuadrant(current_roll_in_degrees, current_pitch_in_degrees)
    sprite_direction = directionForQuadrant(abs(current_roll_in_degrees),
        abs(current_pitch_in_degrees),
        aiming_quadrant)
    main_sprite.set(LedSpriteProperty.DIRECTION, sprite_direction)
    main_sprite.move(1)
    basic.pause(1000 - 3 * Math.sqrt(abs(current_roll_in_degrees) ** 2 + abs(current_pitch_in_degrees) ** 2))
def directionForQuadrant(absolute_roll: number, absolute_pitch: number, aiming_quadrant: str):
    global angle
    angle = Math.atan(absolute_roll / max(absolute_pitch, 0.001)) * 57.2958
    if aiming_quadrant == "top_right":
        direction = angle
    elif aiming_quadrant == "bottom_right":
        direction = angle + 90
    elif aiming_quadrant == "bottom_left":
        direction = angle + 180
    else:
        direction = angle + 270
    return direction
angle = 0
sprite_direction = 0
aiming_quadrant = ""
current_pitch_in_degrees = 0
current_roll_in_degrees = 0
main_sprite: game.LedSprite = None
main_sprite = game.create_sprite(3, 1)
goal_sprite = game.create_sprite(0, 0)
# Comment by John's dad:
#
# Note that sprites will roll along edges when relative direction exceeds 45 current_pitch_in_degrees in effect simulating some degree of "wall friction". Thus there is no need to program specifically for edge cases. For example, this will not move when direction is set below 45 (but will at anything above that):
#
# s = game.create_sprite(1, 0)
#
# s.set(LedSpriteProperty.DIRECTION, 45)
#
# s.move(4)
#
# Note also that the only way to achieve local scope variables using blocks is to have them as python function parameters. Blocks will generate any others as globals

def on_forever():
    global goal_sprite
    basic.pause(800)
    goal_sprite.delete()
    basic.pause(800)
    goal_sprite = game.create_sprite(0, 0)
basic.forever(on_forever)

def on_forever2():
    roll_around_sprite(main_sprite)
basic.forever(on_forever2)
