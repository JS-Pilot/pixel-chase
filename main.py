def determineTouching():
    global touching_for_total_of_milliseconds, last_touch_time
    if main_sprite.is_touching(goal_sprite):
        if last_touch_time != 0:
            touching_for_total_of_milliseconds = control.millis() - last_touch_time + touching_for_total_of_milliseconds
        last_touch_time = control.millis()
    else:
        last_touch_time = 0
        touching_for_total_of_milliseconds = 0
def sanitize_lean(lean: number):
    if abs(lean) < 0.5:
        lean = 0
    elif lean > 80:
        lean = 80
    elif lean < -80:
        lean = -80
    return lean
def determineLevelWin():
    global level
    if touching_for_total_of_milliseconds >= touching_milliseconds_to_win:
        goal_sprite.delete()
        main_sprite.set(LedSpriteProperty.BLINK, 100)
        level += 1
        basic.pause(2000)
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
    global current_roll_in_degrees, current_pitch_in_degrees, aiming_quadrant, sprite_direction, force
    current_roll_in_degrees = sanitize_lean(input.rotation(Rotation.ROLL))
    current_pitch_in_degrees = sanitize_lean(input.rotation(Rotation.PITCH))
    aiming_quadrant = determineQuadrant(current_roll_in_degrees, current_pitch_in_degrees)
    sprite_direction = directionForQuadrant(abs(current_roll_in_degrees),
        abs(current_pitch_in_degrees),
        aiming_quadrant)
    main_sprite.set(LedSpriteProperty.DIRECTION, sprite_direction)
    force = Math.sqrt(abs(current_roll_in_degrees) ** 2 + abs(current_pitch_in_degrees) ** 2)
    if force > 0.5:
        main_sprite.move(1)
        basic.pause(500 - 5 * force)
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
force = 0
sprite_direction = 0
aiming_quadrant = ""
current_pitch_in_degrees = 0
current_roll_in_degrees = 0
lean = 0
goal_sprite: game.LedSprite = None
main_sprite: game.LedSprite = None
last_touch_time = 0
touching_for_total_of_milliseconds = 0
touching_milliseconds_to_win = 0
level = 1
touching_milliseconds_to_win = 1000
touching_for_total_of_milliseconds = 0
last_touch_time = 0
main_sprite = game.create_sprite(3, 1)
goal_sprite = game.create_sprite(0, 0)

def on_forever():
    roll_around_sprite(main_sprite)
    determineTouching()
    determineLevelWin()
basic.forever(on_forever)

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

def on_forever2():
    global goal_sprite
    basic.pause(800)
    goal_sprite.delete()
    basic.pause(800)
    goal_sprite = game.create_sprite(0, 0)
basic.forever(on_forever2)
