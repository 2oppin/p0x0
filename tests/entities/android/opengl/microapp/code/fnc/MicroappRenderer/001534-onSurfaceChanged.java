GLES20.glViewport(0, 0, width, height);

float ratio = (float) width / height;

// this projection matrix is applied to object coordinates
// in the onDrawFrame() method
Matrix.frustumM(projectionMatrix, 0, -ratio, ratio, -1, 1, 3, 7);