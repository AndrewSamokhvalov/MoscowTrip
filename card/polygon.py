__author__ = 'andrey'
import math
import json
import sys
from matplotlib import pyplot as pl
route = [[55.91623, 37.854672], [55.915976, 37.8547], [55.916013, 37.852633000000004], [55.913624, 37.852087000000004], [55.913664, 37.851494], [55.913975, 37.848209000000004]]

def rerange(route, a, b):
    minx = float('inf')
    maxx = float('-inf')

    miny = float('inf')
    maxy = float('-inf')

    for point in route:
        x = point[0]
        if x < minx:
            minx = x
        if x > maxx:
            maxx = x

        y = point[1]
        if x < miny:
            miny = y
        if x > maxy:
            maxy = y

    newpoints = []
    for point in route:
        x = point[0]
        y = point[1]

        dx = (x - minx) / (maxx - minx)
        dy = (y - miny) / (maxy - miny)
        newpoints.append([a + (b - a) * dx, a + (b - a) * dy])

    return newpoints

def get_polygon(R, route):

    # route = rerange(route, 0, 5)

    # get first point
    start_point = route[0]
    segment = route[0:2]

    # get line params of first route segment
    line = line_params(segment)


    # get perpendicular line params of first route segment
    p_line = perpendicular_line(line, start_point)

    # in first case as first_line we take perpendicular line to the first segment
    polygon = [start_point]
    left_prev_line = p_line
    right_prev_line = p_line

    for i in range(0, len(route) - 1):
        segment = route[i:i+2]
        s_line = line_params(segment)

        i_line = indent_left_line(R, s_line)
        polygon.insert(0, intersect(left_prev_line, i_line))
        left_prev_line = i_line

        i_line = indent_rigth_line(R, s_line)
        polygon.insert(len(polygon), intersect(right_prev_line, i_line))
        right_prev_line = i_line

    finish_point = route[-1]
    segment = route[-2:]

    # get line params of first route segment
    line = line_params(segment)

    # get perpendicular line params of first route segment
    p_line = perpendicular_line(line, finish_point)
    right_prev_line = indent_rigth_line(R, line)
    polygon.append(intersect(p_line, right_prev_line))

    p_line = perpendicular_line(line, finish_point)
    left_prev_line = indent_left_line(R, line)
    polygon.append(intersect(p_line, left_prev_line))

    polygon.append(finish_point)

    # pl.plot(*zip(*route), marker='o', color='g')
    # pl.plot(*zip(*polygon), marker='o', color='r')
    # pl.show()
    return json.dumps(polygon)

def intersect(f_line, s_line):
    A1 = f_line[0]
    B1 = f_line[1]
    C1 = f_line[2]

    A2 = s_line[0]
    B2 = s_line[1]
    C2 = s_line[2]

    # Cramer definition
    det1 = C1 * B2 - C2 * B1
    det2 = A1 * C2 - A2 * C1
    det = A1 * B2 - A2 * B1

    x = - det1 / det
    y = - det2 / det

    return [x, y]

def line_params(segment):
    f_point = segment[0]
    s_point = segment[1]

    y1 = f_point[1]
    y2 = s_point[1]
    x1 = f_point[0]
    x2 = s_point[0]

    A = y1 - y2
    B = x2 - x1
    C = x1*y2 - x2*y1

    return [A, B, C]

def perpendicular_line(line, point):
    A = line[0]
    B = line[1]

    x = point[0]
    y = point[1]

    pA = B
    pB = -A
    pC = - (pA * x + pB * y)

    zero = pA*A + pB*B
    return [pA, pB, pC]


def indent_rigth_line(R, line):
    A = line[0]
    B = line[1]
    C = line[2]

    # due ti the fact of line parallels iA = A , iB = B
    iA = A
    iB = B

    iC = C + R * math.sqrt(A ** 2 + B ** 2)
    # r = abs(iC - C)/ math.sqrt(A ** 2 + B ** 2)

    return [iA, iB, iC]

def indent_left_line(R, line):
    A = line[0]
    B = line[1]
    C = line[2]

    # due ti the fact of line parallels iA = A , iB = B
    iA = A
    iB = B

    iC = C - R * math.sqrt(A ** 2 + B ** 2)
    # r = abs(iC - C)/ math.sqrt(A ** 2 + B ** 2)

    return [iA, iB, iC]

def drange(start, end, dx):
    lx = []
    while start < abs(end):
        lx.append(start)
        start = start + dx
    return lx

def draw_line(line):
    A = line[0]
    B = line[1]
    C = line[2]

    lx = range(0,6)
    ly = []
    for x in lx:
        ly.append((-A/B) * x - C/B)

    pl.plot(lx, ly)

def draw_segment(segment):
    pl.plot(*zip(*segment), marker='o', color='r')

print(get_polygon(0.5, route))