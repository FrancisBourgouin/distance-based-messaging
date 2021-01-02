# Distance based messaging

This project is a proof of concept / small fun test using Machine Learning (Tensorflow.js) and the Blazeface and FaceLandmarks models.

The goal is to show a different message at a different size in the browser window.

Instead of using proximity sensors, we can use an average interpupillary distance and the field of view of the webcam and some geometry to calculate the approximate distance of a user from the webcam.

This project is mostly maths & geometry, but using a machine learning model to recognize a face and find the positions of the eyes was crucial for this project.

## Example of the finished project

![Demo of the project](./README_IMG/distance-based-message-small.gif)
## Thought process

Those are the steps that were taken, from drawing the problem to calculations.

## Calculations

### FoV (Field of view)

On my current setup, I'm using a micro 4/3 camera with a lens at 22mm. That means an horizontal angle of view of 42.9°.

### Average interpupillary distance

On average, adults have an IPD of 63mm. That will be our baseline to calculate the distance of an user.

### Distance between two 3d points

Since the initial test had problems with 2d coordinates, we are using a model that gives us 3d coordinates for each iris. This is how we calculate the distance between two points.

distance = sqrt((x2 - x1)^2 + (y2 - y1)^2 + (z2 - z1)^2)

### Geometry

Since FoV is like an isosceles triangle, the other two angles are 68.55°.

The main height of a isosceles triangle is calculated like so : height = sqrt(a^2 - (b/2)^2)

In our case, we don't have all the sides, so splitting the triangle in two rectangle triangles is our way

Angles are 90 / 21.45 / 68.55

We know the height of one side is possible to calculate based on the ratio of IPD to width, then divided by two.

We can calculate the height of our isoceles triangle by calculating : tan(68.5) = height / calculatedIPDratioedetc

# Sources

- https://www.pointsinfocus.com/tools/depth-of-field-and-equivalent-lens-calculator
- https://en.wikipedia.org/wiki/Pupillary_distance
- https://www.engineeringtoolbox.com/distance-relationship-between-two-points-d_1854.html