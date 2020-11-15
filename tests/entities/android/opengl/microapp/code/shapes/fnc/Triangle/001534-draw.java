// Add program to OpenGL ES environment
GLES20.glUseProgram(mProgram);
// get handle to vertex shader's vPosition member
positionHandle = GLES20.glGetAttribLocation(mProgram, "vPosition");
// Enable a handle to the triangle vertices
GLES20.glEnableVertexAttribArray(positionHandle);
// Prepare the triangle coordinate data
GLES20.glVertexAttribPointer(positionHandle, COORDS_PER_VERTEX,
                            GLES20.GL_FLOAT, false,
                            vertexStride, vertexBuffer);
// get handle to fragment shader's vColor member
colorHandle = GLES20.glGetUniformLocation(mProgram, "vColor");
// Set color for drawing the triangle
GLES20.glUniform4fv(colorHandle, 1, color, 0);
// get handle to shape's transformation matrix
vPMatrixHandle = GLES20.glGetUniformLocation(mProgram, "uMVPMatrix");
// Pass the projection and view transformation to the shader
GLES20.glUniformMatrix4fv(vPMatrixHandle, 1, false, mvpMatrix, 0);
// Draw the triangle
GLES20.glDrawArrays(GLES20.GL_TRIANGLES, 0, vertexCount);
// Disable vertex array
GLES20.glDisableVertexAttribArray(positionHandle);