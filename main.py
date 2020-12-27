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
def restartgame():
    global level
    level = 1
    playLevel()
def determineLevelWin():
    global level
    if touching_for_total_of_milliseconds >= touching_milliseconds_to_win:
        goal_sprite.delete()
        main_sprite.set(LedSpriteProperty.BLINK, 100)
        level += 1
        basic.pause(2000)
        main_sprite.delete()
        playLevel()
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
def checkandhandleEnemytouch():
    if main_sprite.is_touching(enemy_sprite):
        if main_sprite.get(LedSpriteProperty.Y) == 4:
            main_sprite.set(LedSpriteProperty.Y, 0)
        while main_sprite.get(LedSpriteProperty.Y) < 4:
            main_sprite.set(LedSpriteProperty.DIRECTION, 180)
            main_sprite.move(1)
            basic.pause(300)
        restartgame()
def playLevel():
    global touching_milliseconds_to_win, touching_for_total_of_milliseconds, last_touch_time, main_sprite, goal_sprite, enemy_sprite
    touching_milliseconds_to_win = 500
    touching_for_total_of_milliseconds = 0
    last_touch_time = 0
    main_sprite = game.create_sprite(2, 2)
    goal_sprite = game.create_sprite(0, 0)
    goal_sprite.set(LedSpriteProperty.BLINK, 500)
    if level == 2:
        enemy_sprite = game.create_sprite(4, 3)
        enemy_sprite.set(LedSpriteProperty.BLINK, 100)
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
enemy_sprite: game.LedSprite = None
touching_milliseconds_to_win = 0
level = 0
lean = 0
touching_for_total_of_milliseconds = 0
last_touch_time = 0
goal_sprite: game.LedSprite = None
main_sprite: game.LedSprite = None
restartgame()

def on_forever():
    roll_around_sprite(main_sprite)
    determineTouching()
    determineLevelWin()
    checkandhandleEnemytouch()
basic.forever(on_forever)
