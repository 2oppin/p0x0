float[] scratch = new float[16];

// Redraw background color
GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT);

// Set the camera position (View matrix)
Matrix.setLookAtM(viewMatrix, 0,
    0, 0, -3,  // eye
    0f, 0f, 0f, // looking ento
    0f, 1.0f, 0.0f // where the sky is (or where head vertex directed)
);

// Calculate the projection and view transformation
Matrix.multiplyMM(vPMatrix, 0, projectionMatrix, 0, viewMatrix, 0);

// Create a rotation transformation for the triangle
Matrix.setRotateM(rotationMatrix, 0, mAngle, 0, 0, -1.0f);

// Combine the rotation matrix with the projection and camera view
// Note that the vPMatrix factor *must be first* in order
// for the matrix multiplication product to be correct.
Matrix.multiplyMM(scratch, 0, vPMatrix, 0, rotationMatrix, 0);

// Draw triangle
mTriangle.draw(scratch);