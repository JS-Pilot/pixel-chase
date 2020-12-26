def determineQuadrant():
    global current_quadrant
    if current_roll_in_degrees >= 0 and current_pitch_in_degrees <= 0:
        current_quadrant = "top_right"
    elif current_roll_in_degrees >= 0 and current_pitch_in_degrees > 0:
        current_quadrant = "bottom_right"
    elif current_roll_in_degrees < 0 and current_pitch_in_degrees >= 0:
        current_quadrant = "bottom_left"
    else:
        current_quadrant = "top_left"
def directionForQuadrant():
    global direction
    direction = Math.atan(absolute_roll / absolute_pitch) * 57.2958
    if current_quadrant == "top_right":
        direction = 90 - direction
    elif current_quadrant == "bottom_right":
        direction = direction + 90
    elif current_quadrant == "bottom_left":
        direction = 270 - direction
    else:
        direction = 270 + direction
direction = 0
current_pitch_in_degrees = 0
current_roll_in_degrees = 0
current_quadrant = ""
absolute_pitch = 0
absolute_roll = 0
current_quadrant = "top_right"
main_sprite = game.create_sprite(2, 4)
goal_sprite = game.create_sprite(0, 0)

def on_forever():
    global current_roll_in_degrees, current_pitch_in_degrees, absolute_pitch, absolute_roll
    current_roll_in_degrees = input.rotation(Rotation.ROLL)
    current_pitch_in_degrees = input.rotation(Rotation.PITCH)
    determineQuadrant()
    absolute_pitch = abs(current_pitch_in_degrees)
    absolute_roll = abs(current_roll_in_degrees)
    directionForQuadrant()
    main_sprite.set(LedSpriteProperty.DIRECTION, direction)
    main_sprite.move(1)
basic.forever(on_forever)

def on_forever2():
    global goal_sprite
    basic.pause(800)
    goal_sprite.delete()
    basic.pause(800)
    goal_sprite = game.create_sprite(0, 0)
basic.forever(on_forever2)
