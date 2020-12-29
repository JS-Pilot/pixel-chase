def determineTouching():
    global touching_for_total_of_milliseconds, last_touch_time
    if main_sprite.is_touching(goal_sprite):
        if last_touch_time != 0:
            touching_for_total_of_milliseconds = control.millis() - last_touch_time + touching_for_total_of_milliseconds
        last_touch_time = control.millis()
        touching_for_total_of_milliseconds = 1000
    else:
        last_touch_time = 0
        touching_for_total_of_milliseconds = 0
def pickRandomDirection():
    global Random_Value, randomDirection
    Random_Value = randint(1, 8)
    if Random_Value == 1:
        randomDirection = 0
    elif Random_Value == 2:
        randomDirection = 45
    elif Random_Value == 3:
        randomDirection = 90
    elif Random_Value == 4:
        randomDirection = 135
    elif Random_Value == 5:
        randomDirection = 180
    elif Random_Value == 6:
        randomDirection = 225
    elif Random_Value == 7:
        randomDirection = 270
    elif Random_Value == 8:
        randomDirection = 315
    return randomDirection
def deleteEnemies():
    global index_esprites, index_esprites_del
    index_esprites = 0
    while index_esprites <= len(enemy_sprites) - 1:
        enemy_sprites[index_esprites].delete()
        index_esprites += 1
    index_esprites_del = 0
    while index_esprites_del <= index_esprites - 1:
        enemy_sprites.pop()
        index_esprites_del += 1
def sanitize_lean(lean: number):
    if abs(lean) < 10:
        lean = 0
    elif lean > 80:
        lean = 80
    elif lean < -80:
        lean = -80
    return lean
def restartgame():
    global level
    level = 1
    goal_sprite.delete()
    main_sprite.delete()
    deleteEnemies()
    playLevel()
def determineLevelWin():
    global level
    if touching_for_total_of_milliseconds >= touching_milliseconds_to_win:
        goal_sprite.delete()
        main_sprite.set(LedSpriteProperty.BLINK, 100)
        if level == max_game_level:
            deleteEnemies()
            goal_sprite.delete()
            main_sprite.delete()
            basic.show_icon(IconNames.HAPPY)
            basic.pause(1000)
            basic.show_icon(IconNames.HEART)
            basic.pause(1000)
            control.reset()
        level += 1
        basic.pause(2000)
        main_sprite.delete()
        deleteEnemies()
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
    global index2
    index2 = 0
    while index2 <= len(enemy_sprites) - 1:
        if main_sprite.is_touching(enemy_sprites[index2]):
            if main_sprite.get(LedSpriteProperty.Y) == 4:
                main_sprite.set(LedSpriteProperty.Y, 0)
            while main_sprite.get(LedSpriteProperty.Y) < 4:
                main_sprite.set(LedSpriteProperty.DIRECTION, 180)
                main_sprite.move(1)
                basic.pause(300)
            images.icon_image(IconNames.SKULL).show_image(0)
            basic.pause(500)
            restartgame()
            break
        index2 += 1
def playLevel():
    global touching_milliseconds_to_win, touching_for_total_of_milliseconds, last_touch_time, sprite_coordinates, main_sprite, goal_sprite, enemy_sprites_by_level, indexpl, enemy_sprite_coordinates, enemy_sprite
    touching_milliseconds_to_win = 1
    touching_for_total_of_milliseconds = 0
    last_touch_time = 0
    sprite_coordinates = main_sprite_starting_coordinates_by_level[level - 1]
    main_sprite = game.create_sprite(sprite_coordinates[0], sprite_coordinates[1])
    sprite_coordinates = goal_sprite_starting_coordinates_by_level[level - 1]
    goal_sprite = game.create_sprite(sprite_coordinates[0], sprite_coordinates[1])
    goal_sprite.set(LedSpriteProperty.BLINK, 500)
    enemy_sprites_by_level = enemy_sprites_starting_coordinates_by_level[level - 1]
    indexpl = 0
    while indexpl <= len(enemy_sprites_by_level) - 1:
        enemy_sprite_coordinates = enemy_sprites_by_level[indexpl]
        if enemy_sprite_coordinates[0] != 9:
            enemy_sprite = game.create_sprite(enemy_sprite_coordinates[0], enemy_sprite_coordinates[1])
            enemy_sprite.set(LedSpriteProperty.BLINK, 50)
            enemy_sprites.append(enemy_sprite)
        indexpl += 1
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
def move_enemies():
    global index_mv, enemy_sprite, es_level_coordinates
    index_mv = 0
    while index_mv <= len(enemy_sprites) - 1:
        enemy_sprite = enemy_sprites[index_mv]
        level_coordinates = enemy_sprites_starting_coordinates_by_level[level - 1]
        es_level_coordinates = level_coordinates[index_mv]
        if es_level_coordinates[0] != enemy_sprite.get(LedSpriteProperty.X) or es_level_coordinates[1] != enemy_sprite.get(LedSpriteProperty.Y):
            enemy_sprite.set(LedSpriteProperty.X, es_level_coordinates[0])
            enemy_sprite.set(LedSpriteProperty.Y, es_level_coordinates[1])
        else:
            enemy_sprite.set(LedSpriteProperty.DIRECTION, pickRandomDirection())
            enemy_sprite.move(1)
        index_mv += 1
    basic.pause(520)
es_level_coordinates: List[number] = []
index_mv = 0
angle = 0
force = 0
sprite_direction = 0
aiming_quadrant = ""
current_pitch_in_degrees = 0
current_roll_in_degrees = 0
enemy_sprite: game.LedSprite = None
enemy_sprite_coordinates: List[number] = []
indexpl = 0
enemy_sprites_by_level: List[List[number]] = []
sprite_coordinates: List[number] = []
index2 = 0
touching_milliseconds_to_win = 0
level = 0
lean = 0
index_esprites_del = 0
index_esprites = 0
randomDirection = 0
Random_Value = 0
touching_for_total_of_milliseconds = 0
last_touch_time = 0
index22 = 0
enemy_sprites_starting_coordinates_by_level: List[List[List[number]]] = []
goal_sprite: game.LedSprite = None
main_sprite: game.LedSprite = None
main_sprite_starting_coordinates_by_level: List[List[number]] = []
goal_sprite_starting_coordinates_by_level: List[List[number]] = []
max_game_level = 0
enemy_sprites: List[game.LedSprite] = []
index = 0
max_game_level = 5
max_enemy_sprites = 10
goal_sprite_starting_coordinates_by_level = [[0, 0], [2, 2], [2, 0], [0, 4], [2, 0]]
main_sprite_starting_coordinates_by_level = [[2, 4], [2, 4], [2, 4], [4, 0], [2, 4]]
main_sprite = game.create_sprite(0, 4)
goal_sprite = game.create_sprite(4, 0)
enemy_sprites_starting_coordinates_by_level = [[[9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9]],
    [[3, 4],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9],
        [9, 9]],
    [[0, 4],
        [0, 3],
        [0, 2],
        [0, 1],
        [0, 0],
        [4, 4],
        [4, 3],
        [4, 2],
        [4, 1],
        [4, 0]],
    [[4, 1],
        [3, 2],
        [2, 3],
        [1, 4],
        [3, 0],
        [2, 1],
        [1, 2],
        [0, 3],
        [9, 9],
        [9, 9]],
    [[0, 4],
        [0, 3],
        [0, 2],
        [0, 1],
        [0, 0],
        [4, 4],
        [4, 3],
        [4, 2],
        [4, 1],
        [4, 0]]]
while index22 <= max_enemy_sprites - 1:
    enemy_sprites.append(game.create_sprite(0, 3))
    index22 += 1
restartgame()

def on_forever():
    if level == max_game_level:
        move_enemies()
basic.forever(on_forever)

def on_forever2():
    roll_around_sprite(main_sprite)
    determineTouching()
    determineLevelWin()
    checkandhandleEnemytouch()
basic.forever(on_forever2)
